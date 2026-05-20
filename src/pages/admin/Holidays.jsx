import { useEffect, useState } from "react";
import API from "../../services/api"
import AdminLayout from "../../layouts/AdminLayout";

function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [formData, setFormData] = useState({
        holidayName: "",
        holidayDate: "",
        description: "",
    });

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/holidays/add", formData);
            alert("Holiday added successfully");

            setFormData({
                holidayName: "",
                holidayDate: "",
                description: "",
            });

            fetchHolidays();

        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <AdminLayout>
            <div className="bg-white p-6 rounded shadow mb-6">
                <h1 className="text-2xl font-bold mb-5">
                    Add Holiday
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4"
                >
<input
                        type="text"
                        name="holidayName"
                        placeholder="Holiday Name"
                        value={formData.holidayName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="holidayDate"
                        value={formData.holidayDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded"
                    >
                        Add Holiday
                    </button>
                </form>
            </div>

            {/* Holiday List */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-5">
                    Holiday List
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">
                                Holiday
                            </th>
                            <th className="p-3 text-left">
                                Date
                            </th>
                            <th className="p-3 text-left">
                                Description
                            </th>
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
        </AdminLayout>
    );
}

export default Holidays;