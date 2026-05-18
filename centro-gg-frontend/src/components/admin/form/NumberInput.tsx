type Props = {
  label?: string;

  value: number;

  onChange: (value: number) => void;
};

const NumberInput = ({
  label,
  value,
  onChange,
}: Props) => {
  return (
    <div>
      {label && (
        <p className="mb-3 text-sm uppercase tracking-[3px] text-gray-500 font-bold">
          {label}
        </p>
      )}

      <input
        type="number"
        min={1}
        max={7}
        value={value}
        onPaste={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (
            e.key === "-" ||
            e.key === "+" ||
            e.key === "e"
          ) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const value = Number(e.target.value);

          if (value > 7) {
            onChange(7);
            return;
          }

          if (value < 1) {
            onChange(1);
            return;
          }

          onChange(value);
        }}
        className="w-full bg-gray-100 rounded-xl px-5 py-4 text-center outline-none"
      />
    </div>
  );
};

export default NumberInput;