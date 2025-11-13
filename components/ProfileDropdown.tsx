import { User, FileText, History, LogOut, Settings } from 'lucide-react';

export default function ProfileDropdown(){
    const userData ={
        name: "Prabowo Subianto",
        level: "A6",
        score: 67,
        image: "/assets/default.jpeg"
    }
    return(
        <div className="w-full max-w-3xs shadow-xl p-5 rounded-xl flex flex-col gap-2 h-fit">
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
                <div className="flex flex-row items-start hover:bg-gray-300 cursor-pointer rounded-lg gap-2 p-2">
                    <User size={20} />
                    <span>My Profile</span>
                </div>
                <div className="flex flex-row items-start hover:bg-gray-300 cursor-pointer rounded-lg gap-2 p-2">
                    <FileText size={20} />
                    <span>Take exam</span>
                </div>
                <div className="flex flex-row items-start hover:bg-gray-300 cursor-pointer rounded-lg gap-2 p-2">
                    <History size={20} />
                    <span>History</span>
                </div>
                <div className="flex flex-row items-start hover:bg-gray-300 cursor-pointer rounded-lg gap-2 p-2">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
                <div className="flex flex-row items-start hover:bg-red-600 hover:text-white cursor-pointer rounded-lg gap-2 p-2">
                    <LogOut size={20} />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
}