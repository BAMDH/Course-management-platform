import Badge from "@/components/admin/badges/Badges";

import StatusBadge from "@/components/admin/badges/StatusBadge";

import TableCell from "@/components/admin/tables/TableCell";

type User = {
  name: string;
  email: string;
  role: string;
  status: string;
  image: string;
};

type Props = {
  user: User;

  onBan: () => void;
};

const roleVariants: Record<string, string> = {
  Estudiante: "info",
  Profesor: "warning",
  Administrador: "danger",
};

const UserRow = ({
  user,
  onBan,
}: Props) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      {/* User */}
      <TableCell>
        <div className="flex items-center gap-4">
          <img
            src={user.image}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h4 className="font-semibold text-sm">
              {user.name}
            </h4>

            <p className="text-sm text-gray-400">
              Registrado recientemente
            </p>
          </div>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="text-gray-600">
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
        <StatusBadge
          status={user.status}
        />
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-3">
          <button className="hover:scale-110 transition text-lg">
            ✏️
          </button>

          <button
            onClick={onBan}
            className="hover:scale-110 transition text-lg"
          >
            {user.status === "Activo"
              ? "🚫"
              : "✅"}
          </button>
        </div>
      </TableCell>
    </tr>
  );
};

export default UserRow;