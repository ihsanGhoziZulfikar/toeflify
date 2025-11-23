import CustomPortableTextBlock from "./CustomPortableTextBlock";


interface ChapterContentProps {
  content: any;
}

export default function ChapterContent({ content }: ChapterContentProps) {
  return (
    <div className="bg-whitep-8 mb-12">
      <div className="prose prose-gray max-w-none font-saira">
        <CustomPortableTextBlock value={content} />
      </div>
    </div>
  );
}