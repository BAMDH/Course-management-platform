import Badge from "@/components/admin/badges/Badges";
import StatusBadge from "@/components/admin/badges/StatusBadge";
import TableCell from "@/components/admin/tables/TableCell";
import { Pencil, Ban, CheckCircle } from "lucide-react";

type Props = {
  user: any;
  onBan?: () => void;
  onEdit?: () => void;
};

const roleVariants: Record<string, string> = {
  Estudiante: "info",
  Profesor: "warning",
  Administrador: "danger",
};

const UserRow = ({ user, onBan, onEdit }: Props) => {
  return (
    <tr className="border-b border-[#e9e8e7] hover:bg-[#f5f3f2] transition">
      {/* User */}
      <TableCell>
        <div className="flex items-center gap-4">
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-[#e9e8e7]"
          />
          <div>
            <h4 className="font-bold text-[#1b1c1b] text-sm">
              {user.name}
            </h4>
            <p className="text-xs text-[#5d5e60]">
              Usuario del sistema
            </p>
          </div>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="text-[#5d5e60]">
        {user.email}
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge
          variant={
            roleVariants[user.role] as
              | "info"
              | "warning"
              | "danger"
          }
        >
          {user.role}
        </Badge>
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            title="Editar rol"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-[#e9e8e7] hover:shadow-sm text-[#5d5e60] hover:text-[#1b1c1b] transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={onBan}
            title={user.status === "Activo" ? "Bloquear" : "Activar"}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-[#e9e8e7] hover:shadow-sm transition-all"
          >
            {user.status === "Activo" ? (
              <Ban className="w-4 h-4 text-[#dc2626]" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </button>
        </div>
      </TableCell>
    </tr>
  );
};

export default UserRow;