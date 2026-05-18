import Card from "./Card";

type Props = {
  title: string;
  value: string;
  icon: string;
};

const StatCard = ({
  title,
  value,
  icon,
}: Props) => {
  return (
    <Card className="p-6 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-2">
          {title}
        </p>

        <h3 className="text-4xl font-bold">
          {value}
        </h3>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
        {icon}
      </div>
    </Card>
  );
};

export default StatCard;