import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import API from "../../services/api";



function Dashboard() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const fetchUsers = async () => {
        try {
            const response = await API.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-600 mt-1">
                        Wellcome {user.employeeName}
                    </p>
                </div>

                <button onClick={() => navigate("/admin/create-employee")} className="bg-blue-600 text-white px-5 py-2 rounded">Create New</button>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Employee Name</th>
                            <th className="text-left p-3">Employee Email</th>
                            <th className="text-left p-3">Role</th>
                            <th className="text-left p-3">Location</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/edit-user/${user._id}`)}>
                                <td className="p-3">{user.employeeName}</td>
                                <td className="p-3">{user.employeeEmail}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>

    )
}

export default Dashboard;