import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import API from "../../services/api";

import AdminLayout from "../../layouts/AdminLayout";

function EditUser() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeCode: "",
        employeeEmail: "",
        location: "",
        role: "",
    });

    const fetchUser = async () => {

        const response = await API.get(
            `/users/${id}`
        );

        setFormData(response.data);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await API.put(
            `/users/${id}`,
            formData
        );

        navigate("/admin/dashboard");
    };

    return (
        <AdminLayout>

            <div className="bg-white p-6 rounded shadow max-w-2xl">

                <h1 className="text-2xl font-bold mb-6">
                    Edit User
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >

                    <input
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="email"
                        name="employeeEmail"
                        value={formData.employeeEmail}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border p-2 rounded"
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

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded"
                    >
                        Update User
                    </button>

                </form>

            </div>

        </AdminLayout>
    );
}

export default EditUser;