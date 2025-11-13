'use client';

interface OutlineButtonProps{
    name: string;
    onClick: () => void;
}

export default function OutlineButton({ name, onClick }: OutlineButtonProps ){
    return(
        <button
            className="bg-white border border-primary text-primary font-semibold text-sm text-right py-1 px-2 rounded-lg cursor-pointer hover:bg-primary hover:text-white w-fit h-fit"
            onClick={onClick}
            >
            {name}
        </button>
    );
}