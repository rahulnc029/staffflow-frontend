import ManagerLayout from "../../layouts/ManagerLayout";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <ManagerLayout>
            <h1 className="text-3xl font-bold">
                Manager Dashboard
            </h1>

            <p className="mt-2">Welcome {user.employeeName}</p>
        </ManagerLayout>
    );
}

export default Dashboard;