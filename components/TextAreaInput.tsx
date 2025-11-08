interface TextAreaInputProps {
  value: string;
  label: string;
  placeholder: string
  onChange: (val: string) => void;
}

export default function TextAreaInput({ value, label, placeholder, onChange }: TextAreaInputProps) {
  return (
    <div>
      <label className="block font-saira text-sm font-medium mb-2 text-gray-700">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        rows={4}
      />
    </div>
  );
}
