import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import CreateEmployee from "../pages/admin/CreateEmployee";
import ProtectedRoute from "./ProtectedRoute";
import ManagerDashboard from "../pages/manager/Dashboard";
import UserDashboard from "../pages/user/Dashboard";
import EditUser from "../pages/admin/EditUser";

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

                {/* Manager */}
                <Route 
                path="/manager/dashboard"
                element={
                    <ProtectedRoute allowedRole="Manager">
                        <ManagerDashboard/>
                    </ProtectedRoute>
                }
                />

                {/* User */}
                <Route 
                path="/user/dashboard"
                element={
                    <ProtectedRoute allowedRole="User">
                        <UserDashboard/>
                    </ProtectedRoute>
                }
                />

                <Route 
                path="/admin/edit-user/:id"
                element={
                    <ProtectedRoute allowedRole="Admin">
                        <EditUser/>
                    </ProtectedRoute>
                }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;