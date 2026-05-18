import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "@/layout/AdminLayout";

import Breadcrumbs from "@/components/admin/navigation/Breadcrumbs";

import PageHeader from "@/components/admin/headers/PageHeader";

import Card from "@/components/admin/Cards/Card";

import Button from "@/components/admin/Button";

import Badge from "@/components/admin/badges/Badges";

import { supabase } from "@/services/supabase";

const products = [
  {
    id: "PRD-001",
    name: "Masterclass Pastelería Fina",
    quantity: 1,
    price: "$240.00",
  },
  {
    id: "PRD-015",
    name: "Libro sobre bases de datos",
    quantity: 1,
    price: "$45.00",
  },
  {
    id: "PRD-022",
    name: "Introducción a la Administración",
    quantity: 1,
    price: "$140.00",
  },
];

type PaymentDetail = {
  id: string;

  student: string;

  status: string;

  subtotal: number;

  discount: number;

  total: number;

  issued_at: string;

  paid_at: string | null;
};

const badgeVariants: Record<
  string,
  "danger" | "warning" | "info"
> = {
  ATRASADO: "danger",

  PENDIENTE: "warning",

  PAGADO: "info",
};

const AdminPaymentDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [payment, setPayment] =
    useState<PaymentDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    setLoading(true);

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
                student_id,
                profiles (
                  full_name
                )
              `)
        .eq("id", id)
        .single();

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    const formattedPayment = {
      id: data.id,

      student:
        data.profiles?.full_name ??
        "Sin nombre",

      subtotal: data.subtotal,

      discount: data.discount,

      total: data.total,

      issued_at: data.issued_at,

      paid_at: data.paid_at,

      status:
        data.status === "paid"
          ? "PAGADO"
          : data.status === "pending"
          ? "PENDIENTE"
          : "ATRASADO",
    };

    setPayment(formattedPayment);

    setLoading(false);
  };

  if (loading || !payment) {
    return (
      <AdminLayout>
        <main className="p-8">
          <p>Cargando factura...</p>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="bg-[#f5f5f5] min-h-screen p-8">
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

              <Button>
                Descargar PDF
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

                <h3 className="text-xl font-bold mt-3">
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
                {products.map(
                  (product, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 px-6 py-6 items-center"
                    >
                      <p className="text-gray-500">
                        {product.id}
                      </p>

                      <p className="font-semibold">
                        {product.name}
                      </p>

                      <p>
                        {product.quantity}
                      </p>

                      <p className="font-bold">
                        {product.price}
                      </p>
                    </div>
                  )
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
              <h3 className="text-xl font-bold mb-4">
                Comprobante de Pago
              </h3>

              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"
                className="rounded-3xl w-full h-[420px] object-cover"
              />
            </div>

            {payment.status !==
              "PAGADO" && (
              <Button className="w-full mt-8">
                Validar Pago
              </Button>
            )}
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminPaymentDetail;