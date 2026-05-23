import { useEffect, useState } from "react";
import API from "../../services/api";
import ManagerLayout from "../../layouts/ManagerLayout";

function Regularizations() {
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(false);
    const [approveLoadingId, setApproveLoadingId] = useState(null);
    const [rejectLoadingId, setRejectLoadingId] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const response = await API.get(
                "/attendance/regularizations"
            );

            setRequests(response.data);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = filterStatus === "All" ? requests : requests.filter((item) => item.regularizationStatus === filterStatus);

    const handleApprove = async (id) => {
        try {
            setApproveLoadingId(id);

            await API.put(
                `/attendance/regularizations/approve/${id}`
            );

            fetchRequests();

        } catch (error) {
            console.log(error);

        } finally {
            setApproveLoadingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setRejectLoadingId(id);

            await API.put(
                `/attendance/regularizations/reject/${id}`
            );

            fetchRequests();

        } catch (error) {
            console.log(error);

        } finally {
            setRejectLoadingId(null);
        }
    };

    return (
        <ManagerLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Regularization Requests
                </h1>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setFilterStatus("All")}
                        className={`cursor-pointer px-4 py-2 rounded ${filterStatus === "All" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus("Pending")}
                        className={`cursor-pointer px-4 py-2 rounded ${filterStatus === "Pending"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus("Approved")}
                        className={`cursor-pointer px-4 py-2 rounded ${filterStatus === "Approved"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilterStatus("Rejected")}
                        className={`cursor-pointer px-4 py-2 rounded ${filterStatus === "Rejected"
                            ? "bg-red-600 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Employee</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Check In</th>
                            <th className="p-3 text-left">Check Out</th>
                            <th className="p-3 text-left">Actions</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-10"
                                >
                                    <div className="flex justify-center items-center">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((item) => (
                                <tr
                                    key={item._id}
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {item.employeeId?.employeeName}
                                    </td>

                                    <td className="p-3">
                                        {item.date}
                                    </td>

                                    <td className="p-3">
                                        {item.regularizationReason}
                                    </td>

                                    <td className="p-3">
                                        {item.regularizedCheckIn}
                                    </td>

                                    <td className="p-3">
                                        {item.regularizedCheckOut}
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        {item.regularizationStatus ===
                                            "Pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(item._id)
                                                        }
                                                        disabled={
                                                            approveLoadingId ===
                                                            item._id ||
                                                            rejectLoadingId ===
                                                            item._id
                                                        }
                                                        className={`px-3 py-1 rounded text-white ${approveLoadingId ===
                                                                item._id
                                                                ? "bg-green-400 cursor-not-allowed"
                                                                : "bg-green-600 cursor-pointer"
                                                            }`}
                                                    >
                                                        {approveLoadingId ===
                                                            item._id
                                                            ? "Approving..."
                                                            : "Approve"}
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleReject(item._id)
                                                        }
                                                        disabled={
                                                            approveLoadingId ===
                                                            item._id ||
                                                            rejectLoadingId ===
                                                            item._id
                                                        }
                                                        className={`px-3 py-1 rounded text-white ${rejectLoadingId ===
                                                                item._id
                                                                ? "bg-red-400 cursor-not-allowed"
                                                                : "bg-red-600 cursor-pointer"
                                                            }`}
                                                    >
                                                        {rejectLoadingId ===
                                                            item._id
                                                            ? "Rejecting..."
                                                            : "Reject"}
                                                    </button>
                                                </>
                                            )}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-white text-sm ${item.regularizationStatus ===
                                                    "Pending"
                                                    ? "bg-orange-500"
                                                    : item.regularizationStatus ===
                                                        "Approved"
                                                        ? "bg-green-600"
                                                        : "bg-red-600"
                                                }`}
                                        >
                                            {item.regularizationStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No regularization requests found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ManagerLayout>
    );
}

export default Regularizations;