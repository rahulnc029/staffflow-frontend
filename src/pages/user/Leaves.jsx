import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";


function Leaves() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchLeaves = async () => {
        try {
            const response = await API.get(`/leave/my/${user.id}`);
            setLeaves(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/leave/apply", {
                employeeId: user.id,
                ...formData,
            });
            alert("Leave applied successfully");

            setFormData({
                leaveType: "",
                fromDate: "",
                toDate: "",
                reason: "",
            });

            fetchLeaves();

        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <UserLayout>
            <div className="bg-white p-6 rounded shadow mb-6">
                <h1 className="text-2xl font-bold mb-6">
                    Apply Leave
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >
                    <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">
                            Select Leave Type
                        </option>
                        <option value="Sick Leave">
                            Sick Leave
                        </option>
                        <option value="Casual Leave">
                            Casual Leave
                        </option>
                        <option value="Emergency Leave">
                            Emergency Leave
                        </option>
                    </select>

                    <input
                        type="date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />

                    <textarea
                        name="reason"
                        placeholder="Reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="border p-2 rounded col span-2"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded w-fit cursor-pointer"
                    >
                        Apply Leave
                    </button>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">
                    My Leave Requests
                </h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Leave Type</th>
                            <th className="p-3 text-left">From</th>
                            <th className="p-3 text-left">To</th>
                            <th className="p-3 text-left">Reason</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaves.map((item) => (
                            <tr
                            key={item._id}
                            className="border-b"
                            >
                                <td className="p-3">{item.leaveType}</td>
                                <td className="p-3">{item.fromDate}</td>
                                <td className="p-3">{item.toDate}</td>
                                <td className="p-3">{item.reason}</td>
                                <td className="p-3">
                                    <span
                                    className={`px-3 py-1 rounded text-white text-sm ${item.status === "Pending" ? "bg-orange-500" : item.status === "Approved" ? "bg-green-600" : "bg-red-600"}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UserLayout>
    )
}


export default Leaves;