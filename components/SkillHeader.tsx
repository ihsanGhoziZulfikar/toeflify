'use client';

import { toTitleCase } from '@/lib/helper';
import ImageCustom from './ImageCustom';

interface SkillHeaderProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function SkillHeader({ title, description, imageSrc }: SkillHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-[200px] h-[120px] flex-shrink-0 overflow-hidden rounded-lg">
          <ImageCustom src={imageSrc} alt={title}/>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">{toTitleCase(title)}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{description || 'No description'}</p>
        </div>
      </div>
    </div>
  );
}