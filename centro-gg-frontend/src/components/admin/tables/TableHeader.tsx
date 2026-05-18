type Props = {
  children?: React.ReactNode;
};

const TableHeader = ({
  children,
}: Props) => {
  return (
    <th className="px-6 py-4 font-medium">
      {children}
    </th>
  );
};

export default TableHeader;