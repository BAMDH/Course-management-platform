import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/Headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import Button from "@/components/admin/Button";

import Badge from "@/components/admin/badges/Badges";

import { supabase } from "@/services/supabase";
import { ExternalLink } from "lucide-react";

type PaymentDetail = {
  id: string;

  student: string;

  status: string;

  subtotal: number;

  discount: number;

  total: number;

  issued_at: string;

  paid_at: string | null;

  receipt_image_path: string | null;
};

type PaymentItem = {
  id: string;

  quantity: number;

  unit_price: number;

  total: number;

  description: string;

  course: {
    id: string;

    title: string;
  } | null;
};

const badgeVariants: Record<
  string,
  "danger" | "warning" | "info"
> = {
  RECHAZADO: "danger",

  PENDIENTE: "warning",

  PAGADO: "info",
};

const AdminPaymentDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [payment, setPayment] =
    useState<PaymentDetail | null>(null);

  const [products, setProducts] = useState<
    PaymentItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);

      // PAYMENT
      const { data, error } =
        await supabase
          .from("payments")
          .select(`
              id,
              status,
              subtotal,
              discount,
              total,
              issued_at,
              paid_at,
              receipt_image_path,
              student_id,
              profiles (
                full_name
              )
            `)
          .eq("id", id)
          .single();

      if (error) {
        console.error(error);
        return;
      }

      // PAYMENT ITEMS
      const {
        data: paymentItems,
        error: itemsError,
      } = await supabase
        .from("payment_items")
        .select(`
          id,
          quantity,
          unit_price,
          total,
          description,
          course_id,
          courses (
            id,
            title
          )
        `)
        .eq("payment_id", id);

      if (itemsError) {
        console.error(itemsError);
        return;
      }

      const formattedPayment = {
          id: data.id,

            student:
             (data.profiles as any)?.full_name ?? "Sin nombre",

        subtotal: Number(data.subtotal),

        discount: Number(data.discount),

        total: Number(data.total),

        issued_at: data.issued_at,

        paid_at: data.paid_at,

        receipt_image_path:
          data.receipt_image_path,

        status:
          data.status === "paid"
            ? "PAGADO"
            : data.status === "pending"
            ? "PENDIENTE"
            : "RECHAZADA",
      };

      const formattedItems =
        paymentItems?.map((item: any) => ({
          id: item.id,

          quantity: item.quantity,

          unit_price: Number(
            item.unit_price
          ),

          total: Number(item.total),

          description: item.description,

          course: item.courses
            ? {
                id: item.courses.id,

                title:
                  item.courses.title,
              }
            : null,
        })) || [];

      setPayment(formattedPayment);

      setProducts(formattedItems);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  if (loading || !payment) {
    return (
      <>
        <main className="p-8">
          <p>Cargando factura...</p>
        </main>
      </>
    );
  }

  const validatePayment = async () => {
  const confirmed = window.confirm(
    "¿Desea marcar la factura como pagada? Recuerde verificar el pago correctamente."
  );

  if (!confirmed) return;

  try {
    // Obtener payment items
    const {
      data: paymentItems,
      error: itemsError,
    } = await supabase
      .from("payment_items")
      .select(`
        course_id
      `)
      .eq("payment_id", payment.id);

    if (itemsError) {
      console.error(itemsError);

      alert(
        "Error obteniendo cursos de la factura."
      );

      return;
    }

    // Obtener student_id del payment
    const {
      data: paymentData,
      error: paymentError,
    } = await supabase
      .from("payments")
      .select(`
        student_id
      `)
      .eq("id", payment.id)
      .single();

    if (paymentError) {
      console.error(paymentError);

      alert(
        "Error obteniendo estudiante."
      );

      return;
    }

    //Crear enrollments
    const enrollments =
      paymentItems
        ?.filter(
          (item) => item.course_id
        )
        .map((item) => ({
          course_id: item.course_id,

          student_id:
            paymentData.student_id,

          status: "waitlisted",

          enrolled_at:
            new Date().toISOString(),
        })) || [];

    //Insertar enrollments
    if (enrollments.length > 0) {
      const {
        error: enrollmentsError,
      } = await supabase
        .from("enrollments")
        .insert(enrollments);

      if (enrollmentsError) {
        console.error(
          enrollmentsError
        );

        alert(
          "Error creando matrículas."
        );

        return;
      }
    }

    //Actualizar payment
    const { error: updateError } =
      await supabase
        .from("payments")
        .update({
          status: "paid",

          paid_at:
            new Date().toISOString(),
        })
        .eq("id", payment.id);

    if (updateError) {
      console.error(updateError);

      alert(
        "Error validando pago."
      );

      return;
    }

  
    await fetchPayment();

  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    alert(
      "Pago validado y estudiantes agregados a la lista de espera."
    );

  } catch (error) {
    console.error(error);

    alert(
      "Ocurrió un error inesperado."
    );
  }
};
const rejectPayment = async () => {
  const confirmed = window.confirm(
    "¿Desea rechazar esta factura?"
  );

  if (!confirmed) return;

  try {
    const { error } =
      await supabase
        .from("payments")
        .update({
          status: "cancelled",
        })
        .eq("id", payment.id);

    if (error) {
      console.error(error);

      alert(
        "Error rechazando factura."
      );

      return;
    }

    await fetchPayment();

    alert(
      "Factura rechazada."
    );

  } catch (error) {
    console.error(error);

    alert(
      "Error inesperado."
    );
  }
};
  return (
    <>
      <main className="p-8">
        {/* Header */}
        <div className="mb-10">
          <Breadcrumbs
            items={[
              {
                label: "Administración",
                href: "/admin",
              },

              {
                label: "Control de Pagos",
                href: "/admin/payments",
              },

              {
                label: "Detalle",
                href: `/admin/payments/detail/${payment.id}`,
              },
            ]}
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mt-6">
            <PageHeader
              title={`Factura #${payment.id.slice(
                0,
                8
              )}`}
              description="Detalle completo de la factura y estado del pago."
            />

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() =>
                  navigate("/admin/payments")
                }
              >
                Volver
              </Button>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-[2fr,1fr] gap-8">
          {/* LEFT */}
          <div className="space-y-8">
            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <Card className="p-6">
                <p className="text-xs tracking-widest text-gray-400 font-semibold">
                  ESTUDIANTE
                </p>

                <h3 className="text-xl font-bold mt-3 break-words">
                      {payment.student}
                    </h3>
              </Card>

              <Card className="p-6">
                <p className="text-xs tracking-widest text-gray-400 font-semibold">
                  EMITIDA
                </p>

                <h3 className="text-xl font-bold mt-3">
                  {new Date(
                    payment.issued_at
                  ).toLocaleDateString()}
                </h3>
              </Card>

              <Card className="p-6">
                <p className="text-xs tracking-widest text-gray-400 font-semibold">
                  PAGADA
                </p>

                <h3 className="text-xl font-bold mt-3">
                  {payment.paid_at
                    ? new Date(
                        payment.paid_at
                      ).toLocaleDateString()
                    : "No pagada"}
                </h3>
              </Card>

              <Card className="p-6">
                <p className="text-xs tracking-widest text-gray-400 font-semibold">
                  FACTURA
                </p>

                <h3 className="text-xl font-bold mt-3">
                  #{payment.id.slice(0, 8)}
                </h3>
              </Card>

              <Card className="p-6">
                <p className="text-xs tracking-widest text-gray-400 font-semibold mb-3">
                  ESTADO
                </p>

               
              <Badge
                variant={
                  badgeVariants[
                    payment.status
                  ]
                }
                className="w-fit max-w-full"
              >
                {payment.status}
              </Badge>
              </Card>
            </div>

            {/* PRODUCTS */}
            <Card className="overflow-hidden p-0">
              <div className="grid grid-cols-4 px-6 py-5 bg-gray-50 text-xs tracking-widest text-gray-400 font-semibold">
                <p>ID</p>

                <p>PRODUCTO</p>

                <p>CANTIDAD</p>

                <p>COSTO UNITARIO</p>
              </div>

              <div className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <div className="px-6 py-10 text-center text-gray-500">
                    No hay productos asociados
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-4 px-6 py-6 items-center"
                    >
                      <p className="text-gray-500">
                        #
                        {product.course?.id.slice(
                          0,
                          8
                        ) || "N/A"}
                      </p>

                      <div>
                        <p className="font-semibold">
                          {product.course
                            ?.title ||
                            product.description}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          {
                            product.description
                          }
                        </p>
                      </div>

                      <p>
                        {product.quantity}
                      </p>

                      <p className="font-bold">
                        ₡
                        {product.unit_price.toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <Card className="p-8 h-fit">
            <h2 className="text-3xl font-bold mb-8">
              Resumen de Pago
            </h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-bold">
                  ₡
                  {payment.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Descuento
                </span>

                <span className="font-bold">
                  ₡
                  {payment.discount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div>
              <p className="text-xs tracking-widest text-gray-400 font-semibold">
                TOTAL
              </p>

              <h3 className="text-5xl font-bold mt-2">
                ₡
                {payment.total.toLocaleString()}
              </h3>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  Comprobante de Pago
                </h3>
                {payment.receipt_image_path && (
                  <div className="flex items-center gap-2">
                    <a
                      href={payment.receipt_image_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
                    >
                      <ExternalLink size={16} />
                      Ver completo
                    </a>
                  </div>
                )}
              </div>

              {payment.receipt_image_path ? (
                <a 
                  href={payment.receipt_image_path} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block cursor-pointer bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
                >
                  <img
                    src={payment.receipt_image_path}
                    className="w-full h-[420px] object-contain"
                    alt="Comprobante de pago"
                  />
                </a>
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-300 h-[220px] flex items-center justify-center bg-gray-50">
                  <p className="text-gray-400 font-medium">
                    No se ha adjuntado un comprobante
                  </p>
                </div>
              )}
            </div>

           {payment.status ===
            "PENDIENTE" && (
            <div className="flex gap-3 mt-8">
              <Button
                className="flex-1"
                onClick={validatePayment}
              >
                Validar Pago
              </Button>

              <Button
                variant="secondary"
                className="flex-1"
                onClick={rejectPayment}
              >
                Rechazar
              </Button>
            </div>
          )}
          </Card>
        </div>
      </main>
    </>
  );
};

export default AdminPaymentDetail;
