import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    let menuItems = [];

    // Admin Menu
    if (user.role === "Admin") {
        menuItems = [
            {
                name: "Home",
                path: "/admin/dashboard",
            },
            {
                name: "Create Employee",
                path: "/admin/create-employee",
            },
            {
                name: "Holidays",
                path: "/admin/holidays",
            },
        ];
    }

    // Manager Menu
    else if (user.role === "Manager") {

        menuItems = [
            {
                name: "Home",
                path: "/manager/dashboard",
            },
            {
                name: "Regularizations",
                path: "/manager/regularizations",
            },
            {
                name: "Leave Requests",
                path: "/manager/leave-requests",
            },
        ];
    }

    // User Menu
    else {

        menuItems = [
            {
                name: "Home",
                path: "/user/dashboard",
            },
            {
                name: "Attendance",
                path: "/user/attendance",
            },
            {
                name: "Leave Requests",
                path: "/user/leaves",
            },
            {
                name: "Attendance Calendar",
                path: "/user/attendance-calendar",
            },
        ];
    }

    return (
        <div className="w-[250px] h-screen bg-gray-900 text-white p-5 overflow-y-auto flex-shrink-0">
            <h1 className="text-2xl font-col gap-3">
                StaffFlow
            </h1>

            <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} className={`p-3 rounded ${location.pathname === item.path ? "bg-blue-600" : "hover:bg-gray-700"}`}>
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sidebar;