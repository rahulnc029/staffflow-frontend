import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <div className="bg-white h-[70px] shadow px-6 flex items-center justify-between">
            <h1 className="text-xl font-bold">StaffFlow</h1>

            <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-blue-600 text-white cursor-pointer">
                    {user.employeeName.charAt(0)}
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-12 bg-white shadow rounded w-[180px]">
                        <div className="p-3 border-b">
                            <p className="font-semibold">{user.employeeName}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>

                )}
            </div>
        </div>
    );
}

export default Header;