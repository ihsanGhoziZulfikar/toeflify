interface RadioSelectProps {
  value: string;
  label: string;
  options: string[];
  onChange: (val: string) => void;
}

export default function RadioSelect({ value, label, options, onChange }: RadioSelectProps) {

  return (
    <div className="w-full md:w-[64%]">
      <label className="block font-saira text-sm font-medium mb-2 text-gray-700">{label}</label>
      <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-lg px-5 py-3">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`capitalize font-saira ${
              value === option ? "text-primary font-semibold" : "text-gray-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
