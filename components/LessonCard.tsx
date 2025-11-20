import Image from 'next/image';
import Link from 'next/link';

interface LessonCardProps {
  title: string;
  section: string;
  chapter?: string;
  topic?: string;
  imageSrc?: string;
  href: string;
}

const gradients = ['from-blue-500 via-sky-500 to-cyan-400', 'from-purple-500 via-pink-500 to-rose-400', 'from-emerald-500 via-teal-500 to-green-400', 'from-amber-500 via-orange-500 to-rose-400'];

const getGradient = (seed: string) => {
  const index = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % gradients.length;
  return gradients[index];
};

export default function LessonCard({ title, section, chapter, topic, imageSrc, href }: LessonCardProps) {
  const gradient = getGradient(section + (topic ?? ''));

  return (
    <Link href={href} className="group block h-full">
      <article className="h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]">
        <div className={`relative h-40 w-full overflow-hidden bg-linear-to-br ${gradient}`}>
          {imageSrc ? <Image src={imageSrc} alt={title} fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" /> : <div className="absolute inset-0" />}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">{section}</span>
            {topic && <p className="mt-2 text-sm text-white/90">{topic}</p>}
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
          {(chapter || topic) && <p className="text-sm text-gray-500">{[chapter, topic].filter(Boolean).join(' • ')}</p>}
          <div className="flex items-center justify-between pt-2 text-sm font-semibold text-primary">
            <span>View lesson</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
