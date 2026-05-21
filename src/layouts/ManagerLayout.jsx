import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function ManagerLayout({ children }) {

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 bg-gray-100 flex flex-col">

                <Header />

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default ManagerLayout;