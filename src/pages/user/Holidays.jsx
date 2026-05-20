import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";


function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const fetchHolidays = async () => {
        try {
            const response = await API.get("/holidays");
            setHolidays(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    return (
        <UserLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Holiday List
                </h1>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">Holiday</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {holidays.map((item) => (
                            <tr
                            key={item._id}
                            className="border-b"
                            >
                                <td className="p-3">{item.holidayName}</td>
                                <td className="p-3">{item.holidayDate}</td>
                                <td className="p-3">{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UserLayout>
    )
}

export default Holidays;