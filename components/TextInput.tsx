interface TextInputProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  min?: number;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  min,
}: TextInputProps) {
  return (
    <div>
      <label className="block font-saira text-sm font-medium mb-2 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        min={type === "number" ? min : undefined}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>
  );
}
