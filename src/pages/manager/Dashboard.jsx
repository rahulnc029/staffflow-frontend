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
            <h1 className="text-3xl font-bold mb-6">
                Manager Dashboard
            </h1>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        Total Employees
                    </h2>
                    <p className="text-3xl font-bold mt-2">
                        {dashboard.totalEmployees}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        Present Today
                    </h2>

                    <p className="bg-white p-5 rounded shadow">
                        {dashboard.presentToday}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        On Leave
                    </h2>

                    <p className="text-3xl font-bold mt-2 text-purple-600">
                        {dashboard.onLeaveToday}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        Incomplete Attendance
                    </h2>

                    <p className="text-3xl font-bold mt-2 text-orange-600">
                        {dashboard.incompleteAttendance}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        Pending Leaves
                    </h2>

                    <p className="text-3xl font-bold mt-2 text-blue-600">
                        {dashboard.pendingLeaves}
                    </p>
                </div>

                <div className="bg-white p-5 rounded shadow">
                    <h2 className="text-gray-500">
                        Pending Regularizations
                    </h2>

                    <p className="text-3xl font-bold mt-2 text-red-600">
                        {dashboard.pendingRegularizations}
                    </p>
                </div>

            </div>

            {/* Recent Leaves */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">
                    Recent Leave Requests
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">
                                Employee
                            </th>

                            <th className="p-3 text-left">
                                Leave Type
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            dashboard.recentLeaves.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-3">
                                        {item.employeeId?.employeeName}
                                    </td>

                                    <td className="p-3">
                                        {item.leaveType}
                                    </td>

                                    <td className="p-3">
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Recent Regularizations */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">
                    Recent Regularizations
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Employee</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dashboard.recentRegularizations.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-3">{item.employeeId?.employeeName}</td>
                                    <td className="p-3">{item.date}</td>
                                    <td className="p-3">{item.regularizationStatus}</td>
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