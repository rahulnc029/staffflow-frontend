import ManagerLayout from "../../layouts/ManagerLayout";
import { useEffect, useState } from "react";
import API from "../../services/api";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const fetchDashboard = async () => {
        try {
            const response = await API.get("/dashboard/manager");
            setDashboard(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (!dashboard) {
        return (
            <ManagerLayout>
                <p>Loading...</p>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>

            <h1 className="text-2xl font-bold mb-5">
                Manager Dashboard
            </h1>

            {/* CARDS */}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Total Employees
                    </h2>

                    <p className="text-2xl font-bold mt-1">
                        {dashboard.totalEmployees}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Present Today
                    </h2>

                    <p className="text-2xl font-bold mt-1 text-green-600">
                        {dashboard.presentToday}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        On Leave
                    </h2>

                    <p className="text-2xl font-bold mt-1 text-purple-600">
                        {dashboard.onLeaveToday}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Incomplete Attendance
                    </h2>

                    <p className="text-2xl font-bold mt-1 text-orange-600">
                        {dashboard.incompleteAttendance}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Pending Leaves
                    </h2>

                    <p className="text-2xl font-bold mt-1 text-blue-600">
                        {dashboard.pendingLeaves}
                    </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Pending Regularizations
                    </h2>

                    <p className="text-2xl font-bold mt-1 text-red-600">
                        {dashboard.pendingRegularizations}
                    </p>
                </div>

            </div>

            {/* RECENT LEAVES */}

            <div className="bg-white p-5 rounded-xl shadow-sm mb-6">

                <h2 className="text-lg font-bold mb-4">
                    Recent Leave Requests
                </h2>

                <table className="w-full text-sm">

                    <thead>

                        <tr className="border-b">

                            <th className="p-2 text-left">
                                Employee
                            </th>

                            <th className="p-2 text-left">
                                Leave Type
                            </th>

                            <th className="p-2 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            dashboard.recentLeaves.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b"
                                >

                                    <td className="p-2">
                                        {item.employeeId?.employeeName}
                                    </td>

                                    <td className="p-2">
                                        {item.leaveType}
                                    </td>

                                    <td className="p-2">
                                        {item.status}
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

            {/* RECENT REGULARIZATIONS */}

            <div className="bg-white p-5 rounded-xl shadow-sm">

                <h2 className="text-lg font-bold mb-4">
                    Recent Regularizations
                </h2>

                <table className="w-full text-sm">

                    <thead>

                        <tr className="border-b">

                            <th className="p-2 text-left">
                                Employee
                            </th>

                            <th className="p-2 text-left">
                                Date
                            </th>

                            <th className="p-2 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            dashboard.recentRegularizations.map((item) => (

                                <tr
                                    key={item._id}
                                    className="border-b"
                                >

                                    <td className="p-2">
                                        {item.employeeId?.employeeName}
                                    </td>

                                    <td className="p-2">
                                        {item.date}
                                    </td>

                                    <td className="p-2">
                                        {item.regularizationStatus}
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </ManagerLayout>
    );
}

export default Dashboard;