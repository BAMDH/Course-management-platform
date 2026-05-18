import Badge from "./Badges";

type Props = {
  status: string;
};

const StatusBadge = ({
  status,
}: Props) => {
  const variants: Record<string, any> = {
    Activo: "success",

    Pendiente: "warning",

    Completo: "danger",
  };

  return (
    <Badge variant={variants[status]}>
      {status}
    </Badge>
  );
};

export default StatusBadge;