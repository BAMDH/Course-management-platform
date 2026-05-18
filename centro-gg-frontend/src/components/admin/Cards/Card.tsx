type Props =
  React.HTMLAttributes<HTMLDivElement>;

const Card = ({
  className = "",
  ...props
}: Props) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 shadow-sm ${className}`}
      {...props}
    />
  );
};

export default Card;