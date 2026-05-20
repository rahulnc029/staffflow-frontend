import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeEmail: "",
        employeePassword: "",
    })

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/auth/login", formData)

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            const role = response.data.user.role;

            if (role === "Admin") {
                navigate("/admin/dashboard");
            } else if (role === "Manager") {
                navigate("/manager/dashboard");
            } else {
                navigate("/user/dashboard")
            }

        } catch (error) {
            setError(
                error.response?.data?.messsage || "Login Failed"
            )
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-[400px]">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    StaffFlow Login
                </h1>

                {error && (<p className="text-red-500 mb-4">{error}</p>)}

                <div className="mb-4">
                    <label>Email</label>
                    <input type="email" name="employeeEmail" value={formData.employeeEmail} onChange={handleChange} className="w-full border p-2 rounded mt-1" />
                </div>

                <div className="mb-6">
                    <label>Password</label>

                    <input
                        type="password"
                        name="employeePassword"
                        value={formData.employeePassword}
                        onChange={handleChange}
                        className="w-full border p-2 rounded mt-1"
                    />

                    <div className="mb-4 text-right">
                        <button
                            type="button"
                            onClick={() => alert("Please contact Admin to reset your password")}
                            className="text-blue-600 text-sm cursor-pointer hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login;