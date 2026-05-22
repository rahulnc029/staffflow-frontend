import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUsers, FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaBars} from "react-icons/fa";

function Sidebar() {
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [collapsed, setCollapsed] = useState(false);

    let menuItems = [];

    // Admin Menu
    if (user.role === "Admin") {
        menuItems = [
            {
                name: "Home",
                path: "/admin/dashboard",
                icon: <FaHome />,
            },
            {
                name: "Create Employee",
                path: "/admin/create-employee",
                icon: <FaUsers />,
            },
            {
                name: "Holidays",
                path: "/admin/holidays",
                icon: <FaCalendarAlt />,
            },
        ];
    }

    // Manager Menu
    else if (user.role === "Manager") {

        menuItems = [
            {
                name: "Home",
                path: "/manager/dashboard",
                icon: <FaHome />,
            },
            {
                name: "Regularizations",
                path: "/manager/regularizations",
                icon: <FaClipboardList />,
            },
            {
                name: "Leave Requests",
                path: "/manager/leave-requests",
                icon: <FaCalendarAlt />,
            },
        ];
    }

    // User Menu
    else {

        menuItems = [
            {
                name: "Home",
                path: "/user/dashboard",
                icon: <FaHome />,
            },
            {
                name: "Attendance",
                path: "/user/attendance",
                icon: <FaClipboardList />,
            },
            {
                name: "Leave Requests",
                path: "/user/leaves",
                icon: <FaCalendarAlt />,
            },
            // {
            //     name: "Attendance Calendar",
            //     path: "/user/attendance-calendar",
            // },
        ];
    }

    return (
        <div
        className={`bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[250px]"}`}
        >
            {/* Top Header */}
            <div className="h-[70px] flex items-center justify-between px-4 border-b border-gray-700 flex-shrink-0">
                {
                    !collapsed && (
                        <h1 className="text-xl font-bold">
                            StaffFlow
                        </h1>
                    )
                }
                <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-lg cursor-pointer"
                >
                    <FaBars/>
                </button>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {
                    menuItems.map((item) => (
                        <Link 
                        key={item.path}
                        to={item.path}
                        title={collapsed ? item.name : ""}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${location.pathname === item.path ? "bg-blue-600" : "hover:bg-gray-800"}`}
                        >
                            <span className="text-lg">
                                {item.icon}
                            </span>
                            {
                                !collapsed && (
                                    <span>
                                        {item.name}
                                    </span>
                                )
                            }
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar;