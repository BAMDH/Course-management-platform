// src/components/admin/forms/FormInput.tsx

type Props =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
  };

const FormInput = ({
  label,

  ...props
}: Props) => {
  return (
    <div>
      {label && (
        <label className="block mb-3 text-xl font-semibold">
          {label}
        </label>
      )}

      <input
  {...props}
  className="w-full bg-gray-100 rounded-xl px-5 py-4 outline-none"
/>
    </div>
  );
};

export default FormInput;