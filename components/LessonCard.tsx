import Image from 'next/image';
import Link from 'next/link';

interface LessonCardProps {
  title: string;
  section: string;
  imageSrc: string;
  href: string;
}

export default function LessonCard({ title, section, imageSrc, href }: LessonCardProps) {
  return (
    <Link href={href}>
      <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Card Image */}
        <div className="relative w-full aspect-[3/2] bg-gradient-to-br from-pink-400 to-purple-500">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Card Content */}
        <div className="p-3 bg-white">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-xs text-blue-600 font-semibold">{section}</span>
          </div>
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Hover overlay with dimensions */}
        <div className="absolute inset-0 bg-blue-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-white font-mono text-sm">
            {/* You can add hover info here if needed */}
          </span>
        </div>
      </div>
    </Link>
  );
}
