type Props = {
  title: string;

  children: React.ReactNode;
};

const FormSection = ({
  title,
  children,
}: Props) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8">
        {title}
      </h2>

      {children}
    </div>
  );
};

export default FormSection;