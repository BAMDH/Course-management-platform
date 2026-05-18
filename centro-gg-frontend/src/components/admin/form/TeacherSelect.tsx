type Teacher = {
  id: string;
  full_name: string;
};

type Props = {
  teachers: Teacher[];

  value: string;

  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
};

const TeacherSelect = ({
  teachers,
  value,
  onChange,
}: Props) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-gray-100 rounded-xl px-5 py-4 text-black border border-gray-200 outline-none"
    >
      <option value="">
        Seleccionar profesor
      </option>

      {teachers.map((teacher) => (
        <option
          key={teacher.id}
          value={teacher.id}
        >
          {teacher.full_name || "Profesor"}
        </option>
      ))}
    </select>
  );
};

export default TeacherSelect;