type SearchInputProps = {
  placeholder?: string;

  value?: string;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const SearchInput = ({
  placeholder,
  value,
  onChange,
}: SearchInputProps) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        md:w-[420px]
        bg-gray-100
        rounded-xl
        px-5
        py-3
        outline-none
        focus:ring-2
        focus:ring-red-500
      "
    />
  );
};

export default SearchInput;