import { User, FileText, History, LogOut, Settings } from 'lucide-react';
import { JSX } from 'react';
import { useRouter } from "next/navigation";

export default function ProfileDropdown(){
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const userData ={
        name: "Nurhayati Subakat",
        level: "A6",
        score: 67,
        image: "/assets/images/profile_default.jpg"
    }

    type ProfileItem = { href?: string; label: string; icon: JSX.Element; danger?: boolean; onClick?: () => void; };

    const PROFILE_ITEMS: ProfileItem[] = [
        { href: "/profile", label: "My Profile", icon: <User size={20} /> },
        { href: "/exam", label: "Take Exam", icon: <FileText size={20} /> },
        { href: "/history", label: "History", icon: <History size={20} /> },
        { href: "/settings", label: "Settings", icon: <Settings size={20} /> },
        { onClick: handleLogout, label: "Logout", icon: <LogOut size={20} />, danger: true },
    ];

    return(
        <div className="bg-white w-3xs shadow-xl p-5 rounded-xl flex flex-col gap-2 h-fit">
            {/* upper */}
            <div className="text-center py-3 flex flex-col gap-1">
                {/* profile pic */}
                <div className="w-30 h-30 rounded-full overflow-hidden flex-shrink-0 border border-gray-300 p-2 mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                        src={userData.image?? "/assets/default.jpeg"} 
                        alt="Profile Picture" 
                        className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <p className="text-primary font-semibold">Level {userData.level}</p>
                <h2 className="text-lg font-semibold">{userData.name}</h2>
                <div className="rounded-lg bg-primary px-2 py-1 my-1 text-white inline-block w-fit mx-auto">Score {userData.score}</div>
            </div>

            <hr />

            {/* bottom */}
            <div className="text-gray-500">
                {PROFILE_ITEMS.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={item.onClick}
                        className={`flex flex-row items-start gap-2 p-2 rounded-lg cursor-pointer
                        ${item.danger 
                            ? "hover:bg-red-600 hover:text-white text-red-600" 
                            : "hover:bg-gray-300"
                        }
                        `}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}