import { useEffect, useState } from "react";
import API from "../../services/api";
import ManagerLayout from "../../layouts/ManagerLayout";


function LeaveRequests() {
    const [leaves, setLeaves] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");

    const fetchLeaves = async () => {
        try {
            const response = await API.get("/leave/requests");
            setLeaves(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApprove = async (id) => {
        try {
            await API.put(`/leave/approve/${id}`);
            fetchLeaves();
        } catch (error) {
            console.log(error);
        }
    };

    const handleReject = async (id) => {
        try {
            await API.put(`/leave/reject/${id}`);
            fetchLeaves();
        } catch (error) {
            console.log(error);
        }
    };

    const filteredLeaves = filterStatus === "All" ? leaves : leaves.filter((item) => item.status === filterStatus);



    return (
        <ManagerLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Leave Requests
                </h1>

                {/* Filters */}
                <div className="flex gap-3 mb-5">
                    <button
                        onClick={() => setFilterStatus("All")}
                        className={`px-4 py-2 rounded ${filterStatus === "All" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus("Pending")}
                        className={`px-4 py-2 rounded ${filterStatus === "Pending" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus("Approved")}
                        className={`px-4 py-2 rounded ${filterStatus === "Approved" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilterStatus("Rejected")}
                        className={`px-4 py-2 rounded ${filterStatus === "Rejected" ? "bg-red-600 text-white" : "bg-gray-200"}`}
                    >
                        Rejected
                    </button>
                </div>

                {/* Table */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Employee</th>
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">From</th>
                            <th className="p-3 text-left">To</th>
                            <th className="p-3 text-left">Days</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredLeaves.map((item) => (
                            <tr key={item._id} className="border-b">
                                <td className="p-3">
                                    {item.employeeId?.employeeName}
                                </td>
                                <td className="p-3">
                                    {item.leaveType}
                                </td>
                                <td className="p-3">
                                    {item.fromDate}
                                </td>
                                <td className="p-3">
                                    {item.toDate}
                                </td>
                                <td className="p-3">
                                    {item.totalDays}
                                </td>
                                <td className="p-3">
                                    {item.reason}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-white text-sm ${item.status === "Pending" ? "bg-orange-500" : item.status === "Approved" ? "bg-green-600" : "bg-red-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    {item.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(item._id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(item._id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ManagerLayout>
    )
}

export default LeaveRequests;