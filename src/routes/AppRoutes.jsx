import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import CreateEmployee from "../pages/admin/CreateEmployee";
import ProtectedRoute from "./ProtectedRoute";
import ManagerDashboard from "../pages/manager/Dashboard";
import UserDashboard from "../pages/user/Dashboard";
import EditUser from "../pages/admin/EditUser";
import Attendance from "../pages/user/Attendance";
import Regularizations from "../pages/manager/Regularizations";
import LeaveRequests from "../pages/manager/LeaveRequests";
import Leaves from "../pages/user/Leaves";
import AdminHolidays from "../pages/admin/Holidays";
import UserHolidays from "../pages/user/Holidays";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* Admin */}
                <Route path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>

                    } />

                <Route path="/admin/create-employee"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <CreateEmployee />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/edit-user/:id"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <EditUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/holidays"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <AdminHolidays />
                        </ProtectedRoute>
                    }
                />

                {/* Manager */}
                <Route
                    path="/manager/dashboard"
                    element={
                        <ProtectedRoute allowedRole="Manager">
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/regularizations"
                    element={
                        <ProtectedRoute allowedRole="Manager">
                            <Regularizations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/leave-requests"
                    element={
                        <ProtectedRoute allowedRole="Manager">
                            <LeaveRequests />
                        </ProtectedRoute>
                    }
                />

                {/* User */}
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute allowedRole="User">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/attendance"
                    element={
                        <ProtectedRoute allowedRole="User">
                            <Attendance />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/leaves"
                    element={
                        <ProtectedRoute allowedRole="User">
                            <Leaves />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/holidays"
                    element={
                        <ProtectedRoute allowedRole="User">
                            <UserHolidays />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;