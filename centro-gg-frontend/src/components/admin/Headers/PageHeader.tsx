type Props = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: Props) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold font-['Manrope',sans-serif] text-[#1b1c1b] mb-2">
        {title}
      </h1>

      <p className="text-[#5d5e60] text-[15px] max-w-2xl">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;