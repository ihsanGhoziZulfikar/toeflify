interface ToggleOptionsProps {
  options: { label: string; name: string }[];
  values: Record<string, boolean>;
  onChange: (name: string, checked: boolean) => void;
}

export default function ToggleOptions({ options, values, onChange }: ToggleOptionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map(({ label, name }) => (
        <label
          key={name}
          className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer"
        >
          <span className="font-saira text-sm">{label}</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={values[name] || false}
              onChange={(e) => onChange(name, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      ))}
    </div>
  );
}
