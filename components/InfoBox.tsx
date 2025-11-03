import Link from "next/link";

interface InfoBoxProps {
  title: string;
  subtitle: string;
  color?: string;
  href: string;
  buttonText?: string;
}

export default function InfoBox({
  title,
  subtitle,
  color = "#a855f7", // default purple tone
  href,
  buttonText = "Learn More →",
}: InfoBoxProps) {
  return (
    <div
      className="p-4 rounded-lg shadow transition hover:shadow-lg"
      style={{ backgroundColor: color }}
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/90 mt-1">{subtitle}</p>
      <Link
        href={href}
        className="inline-block mt-3 bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded transition hover:bg-gray-100"
      >
        {buttonText}
      </Link>
    </div>
  );
}
