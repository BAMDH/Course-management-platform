type Props = React.HTMLAttributes<HTMLDivElement>;

const Card = ({ className = "", ...props }: Props) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-[#e9e8e7] shadow-sm ${className}`}
      {...props}
    />
  );
};

export default Card;