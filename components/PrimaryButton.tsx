'use client';

interface PrimaryButtonProps{
    name: string;
    onClick: () => void;
}

export default function PrimaryButton({ name, onClick }: PrimaryButtonProps ){
    return(
        <button
            className="bg-primary text-white font-semibold text-sm text-right py-1 px-2 rounded-lg cursor-pointer hover:bg-blue-500 w-fit h-fit"
            onClick={onClick}
            >
            {name}
        </button>
    );
}