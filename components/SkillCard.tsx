import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { isEmpty, toTitleCase } from '@/lib/helper';

interface SkillCardProps {
  title: string;
  description: string;
  imageSrc: string;
  materialHref?: string;
  exerciseHref?: string;
}

export default function SkillCard({
  title,
  description,
  imageSrc,
  materialHref,
  exerciseHref = '#',
}: SkillCardProps) {
  return (
    <div className="max-w-5xl w-full mx-auto bg-white rounded-[10px] p-6 shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-shadow hover:shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1.3fr] gap-6 items-start">
        <div className="order-2 md:order-0">
          <h2 className="text-lg font-saira font-semibold mb-2">{toTitleCase(title)}</h2>
          <p className="text-gray-700 font-saira mb-4">{isEmpty(description)? "No Description" : description }</p>

          <div className="flex gap-5">
            <a
              href={materialHref}
              className="w-fit flex items-center gap-2 px-5 py-2 rounded-lg font-saira text-black bg-zinc-200 hover:bg-zinc-300 transition-colors"
            >
              View Material
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={exerciseHref}
              className="w-fit flex items-center gap-2 px-5 py-2 rounded-lg font-saira font-semibold text-white bg-linear-to-r from-[#4C8BD4] to-[#3563E9] hover:from-[#3C7AC0] hover:to-[#274BD3] transition-all duration-300"
            >
              Take Exercise
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="order-1 md:order-0 md:justify-end justify-center flex">
          <div className="w-[200px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={imageSrc}
              alt={title}
              width={200}
              height={120}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
