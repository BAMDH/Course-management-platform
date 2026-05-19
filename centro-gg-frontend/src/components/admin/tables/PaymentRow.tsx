
import Badge from "@/components/admin/badges/Badges";

import TableCell from "@/components/admin/tables/TableCell";


import { useNavigate } from "react-router-dom";

type Payment = {
   id: string;
   
  initials: string;

  student: string;

  studentId: string;

  invoiceId: string;

  date: string;

  status: string;
};

type Props = {
  payment: Payment;
};

const badgeVariants: Record<
  string,
  "danger" | "warning" | "info"
> = {
  ATRASADO: "danger",

  PENDIENTE: "warning",

  PAGADO: "info",
};

const PaymentRow = ({
  payment,
}: Props) => {
  const navigate = useNavigate();
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      {/* Student */}
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-red-600">
            {payment.initials}
          </div>

          <div>
            <h4 className="font-semibold text-sm">
              {payment.student}
            </h4>

            
          </div>
        </div>
      </TableCell>

      {/* Invoice */}
      <TableCell className="text-gray-600">
        {payment.invoiceId}
      </TableCell>

      {/* Date */}
        <TableCell className="text-gray-600">
        {payment.date}
        </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={
            badgeVariants[
              payment.status
            ]
          }
        >
          {payment.status}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <button
          onClick={() =>
            navigate(
              `/admin/payments/detail/${payment.id}`
            )
          }
          className="text-red-600 font-semibold text-right hover:opacity-80 transition"
        >
          Ver Detalles
        </button>
      </TableCell>
    </tr>
  );
};

export default PaymentRow;