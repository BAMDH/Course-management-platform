import Badge from "@/components/admin/badges/Badges";
import TableCell from "@/components/admin/tables/TableCell";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

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

const badgeVariants: Record<string, "danger" | "warning" | "info"> = {
  ATRASADO: "danger",
  PENDIENTE: "warning",
  PAGADO: "info",
};

const PaymentRow = ({ payment }: Props) => {
  const navigate = useNavigate();
  return (
    <tr className="border-b border-[#e9e8e7] hover:bg-[#f5f3f2] transition">
      {/* Student */}
      <TableCell>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#f5f3f2] border border-[#e9e8e7] flex items-center justify-center font-bold text-[#dc2626]">
            {payment.initials}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1b1c1b]">
              {payment.student}
            </h4>
          </div>
        </div>
      </TableCell>

      {/* Invoice */}
      <TableCell className="text-[#5d5e60]">
        {payment.invoiceId}
      </TableCell>

      {/* Date */}
      <TableCell className="text-[#5d5e60]">
        {payment.date}
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={badgeVariants[payment.status]}>
          {payment.status}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <button
          onClick={() => navigate(`/admin/payments/detail/${payment.id}`)}
          title="Ver detalles"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-[#e9e8e7] hover:shadow-sm text-[#5d5e60] hover:text-[#1b1c1b] transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      </TableCell>
    </tr>
  );
};

export default PaymentRow;