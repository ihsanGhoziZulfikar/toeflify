import { ChevronRight, Circle } from "lucide-react";
import Link from "next/link";

interface ColoredStickProps {
  text: string;
  color?: string;
  href: string;
}

export default function ColoredStick({
  text,
  color = "#7253A4",
  href,
}: ColoredStickProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between w-full max-w-3xl font-medium px-4 py-3 mt-4 rounded-lg cursor-pointer transition text-white"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center gap-2">
        <Circle size={20} className="shrink-0" />
        <span>{text}</span>
      </div>
      <ChevronRight size={25} />
    </Link>
  );
}
