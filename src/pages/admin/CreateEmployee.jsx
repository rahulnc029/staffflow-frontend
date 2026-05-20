import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";


function CreateEmployee() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        employeeName: "",
        employeeCode: "",
        employeeEmail: "",
        employeePassword: "",
        location: "",
        role: "User",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/users/create", formData);
            navigate("/admin/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create employee");
        }
    };
    return (
        <AdminLayout>

            <div className="bg-white p-6 rounded-lg shadow max-w-2xl">

                <h1 className="text-2xl font-bold mb-6">
                    Create Employee
                </h1>

                {error && (
                    <p className="text-red-500 mb-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >

                    <div>
                        <label>Employee Name</label>

                        <input
                            type="text"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label>Employee Code</label>

                        <input
                            type="text"
                            name="employeeCode"
                            value={formData.employeeCode}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label>Employee Email</label>

                        <input
                            type="email"
                            name="employeeEmail"
                            value={formData.employeeEmail}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label>Employee Password</label>

                        <input
                            type="password"
                            name="employeePassword"
                            value={formData.employeePassword}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div>
                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mt-1"
                        >
                            <option value="Admin">
                                Admin
                            </option>

                            <option value="Manager">
                                Manager
                            </option>

                            <option value="User">
                                User
                            </option>
                        </select>
                    </div>

                    <div className="col-span-2">

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded cursor-pointer"
                        >
                            Create Employee
                        </button>

                    </div>

                </form>

            </div>

        </AdminLayout>
    )
}


export default CreateEmployee;