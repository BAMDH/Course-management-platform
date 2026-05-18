type Props = {
  title: string;
  description: string;
};

const PageHeader = ({
  title,
  description,
}: Props) => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">
        {title}
      </h1>

      <p className="text-gray-500 max-w-2xl">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;