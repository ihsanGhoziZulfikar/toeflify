import Image from "next/image";
import { toTitleCase } from "@/lib/helper";

interface ImageCustomProps{
    alt?: string;
    src?: string;
}

export default function ImageCustom({ src, alt }: ImageCustomProps){
return (
    <div className="relative w-full h-full bg-linear-to-br from-blue-50 to-teal-50">
        {src && src != "/assets/default.jpeg" ? (
            <Image src={src} alt={alt?? ""} fill className="object-cover" />
            ) : (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-4 w-32 h-26 flex flex-col items-center justify-center">
                <div className="text-gray-800 text-xs line-clamp-3 font-bold text-center mb-2">{toTitleCase(alt?? "")}</div>
                <div className="w-full space-y-1">
                    {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-1 bg-gray-300 rounded"></div>
                    ))}
                </div>
                </div>
            </div>
            )}
        </div>
    )
}