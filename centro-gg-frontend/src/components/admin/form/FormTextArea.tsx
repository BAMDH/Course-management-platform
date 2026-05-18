type Props = {
  label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const FormTextarea = ({
  label,
  ...props
}: Props) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 font-medium">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className="w-full bg-gray-100 rounded-xl px-5 py-4 h-36 resize-none outline-none"
      />
    </div>
  );
};

export default FormTextarea;