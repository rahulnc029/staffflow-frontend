import UserLayout from "../../layouts/UserLayout";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <UserLayout>

            <h1 className="text-3xl font-bold">
                User Dashboard
            </h1>

            <p className="mt-2">
                Welcome {user.employeeName}
            </p>

        </UserLayout>
    );
}

export default Dashboard;