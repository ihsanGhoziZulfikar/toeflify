'use client';

interface ChapterHeaderProps {
  title: string;
}

export default function ChapterHeader({ title }: ChapterHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold font-rowdies text-primary">{title}</h1>
    </div>
  );
}