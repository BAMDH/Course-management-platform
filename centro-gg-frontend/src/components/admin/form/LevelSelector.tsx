type Props = {
  levels: string[];
  selected: string;
  onSelect: (level: string) => void;
};

const LevelSelector = ({
  levels,
  selected,
  onSelect,
}: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {levels.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onSelect(level)}
          className={`w-full rounded-xl px-5 py-4 transition font-medium ${
            selected === level
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;