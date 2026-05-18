import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function ManagerLayout({ children }) {

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-100 min-h-screen">

                <Header />

                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default ManagerLayout;