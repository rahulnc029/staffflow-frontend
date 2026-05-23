import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { useEffect, useState } from "react";

function Attendance() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [attendance, setAttendance] = useState([]);
    const [currentTime, setCurrentTime] = useState("");
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [showRegularization, setShowRegularization] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [regularizationData, setRegularizationData] = useState({
        regularizationReason: "",
        regularizedCheckIn: "",
        regularizedCheckOut: "",
    });
    const [isHoliday, setisHoliday] = useState(false);
    const [holidayMessage, setHolidayMessage] = useState("");
    const [clockInLoading, setClockInLoading] = useState(false);
    const [clockOutLoading, setClockOutLoading] = useState(false);
    const [regularizationLoading, setRegularizationLoading] = useState(false);

    // LIVE CLOCK
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // FETCH ATTENDANCE
    const fetchAttendance = async () => {
        try {
            const response = await API.get(`/attendance/${user.id}`);
            setAttendance(response.data);

            const today = new Date().toISOString().split("T")[0];
            const todayRecord = response.data.find((item) => item.date === today);
            setTodayAttendance(todayRecord);

            const todayDate = new Date();
            const isSunday = todayDate.getDay() === 0;
            if (isSunday) {
                setisHoliday(true);
                setHolidayMessage("Today is Sunday - Week Off");
            } else {
                try {
                    const holidayResponse = await API.get("/holidays");
                    const todayHoliday = holidayResponse.data.find((item) => item.holidayDate === today);

                    if (todayHoliday) {
                        setisHoliday(true);
                        setHolidayMessage(`Today is ${todayHoliday.holidayName}`);
                    } else {
                        setisHoliday(false);
                        setHolidayMessage("");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // CLOCK IN
    const handleClockIn = async () => {
        try {
            setClockInLoading(true);

            await API.post("/attendance/clock-in", {
                employeeId: user.id,
            });

            fetchAttendance();

        } catch (error) {
            alert(error.response?.data?.message);
        } finally {
            setClockInLoading(false);
        }
    }

    // CLOCK OUT
    const handleClockOut = async () => {
        try {
            const confirmClockOut = window.confirm(
                `Are you sure you want to clock out at ${currentTime}`
            );

            if (!confirmClockOut) {
                return;
            }

            setClockOutLoading(true);

            await API.post("/attendance/clock-out", {
                employeeId: user.id,
            });

            fetchAttendance();

        } catch (error) {
            alert(error.response?.data?.message);
        } finally {
            setClockOutLoading(false);
        }
    };

    const handleRegularization = async () => {
        try {
            setRegularizationLoading(true);

            await API.post("/attendance/regularization", {
                attendanceId: selectedAttendance._id,
                ...regularizationData,
            });

            alert("Regularization submitted successfully");

            setShowRegularization(false);

            fetchAttendance();

        } catch (error) {
            alert(error.response?.data?.message);

        } finally {
            setRegularizationLoading(false);
        }
    };

    const isRegularizationExpired = (createdAt) => {
        const createdTime = new Date(createdAt);
        const currentTime = new Date();
        const diffHours = (currentTime - createdTime) / (1000 * 60 * 60);
        return diffHours > 24;
    };


    return (
        <UserLayout>
            <h1 className="text-3xl font-bold mb-6">Attendance</h1>
            {/* Action Card */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Live Session</h2>
                <p className="text-2xl font-bold mb-2">{currentTime}</p>
                <p className="mt-3 text-lg">Status:
                    <span className="font-semibold ml-2">
                        {todayAttendance ? todayAttendance.status : "Not Clocked In"}
                    </span>
                </p>
                {
                    isHoliday && (
                        <p className="text-red-600 font-semibold mt-3">
                            {holidayMessage}
                        </p>
                    )
                }
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={handleClockIn}
                        disabled={todayAttendance || isHoliday || clockInLoading}
                        className={`px-5 py-2 rounded text-white ${todayAttendance || isHoliday || clockInLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600"
                            }`}
                    >
                        {clockInLoading ? "Clocking In..." : "Clock In"}
                    </button>
                    <button
                        onClick={handleClockOut}
                        disabled={
                            !todayAttendance ||
                            todayAttendance?.checkOutTime ||
                            clockOutLoading
                        }
                        className={`px-5 py-2 rounded text-white ${!todayAttendance ||
                                todayAttendance?.checkOutTime ||
                                clockOutLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600"
                            }`}
                    >
                        {clockOutLoading ? "Clocking Out..." : "Clock Out"}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Clock In</th>
                            <th className="text-left p-3">Clock Out</th>
                            <th className="text-left p-3">Gross Hours</th>
                            <th className="text-left p-3">Arrival</th>
                            <th className="text-left p-3">Arrival Time</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendance.map((item) => (
                            <tr key={item._id} className="border-b">
                                <td className="p-3">{item.date}</td>
                                <td className="p-3">{item.checkInTime}</td>
                                <td className="p-3">{item.checkOutTime || "--"}</td>
                                <td className="p-3">{item.grossHours || "--"}</td>
                                <td className="p-3">{item.arrivalStatus}</td>
                                <td className="p-3">{item.arrivalTimeText}</td>
                                <td className="p-3">{item.status}</td>
                                <td className="p-3">

                                    {
                                        item.status === "Incomplete" &&
                                        !isRegularizationExpired(item.createdAt) && (
                                            <button
                                                title="Regularize Attendance"
                                                onClick={() => {

                                                    setSelectedAttendance(item);

                                                    setRegularizationData({
                                                        regularizationReason: "",
                                                        regularizedCheckIn: "",
                                                        regularizedCheckOut: "",
                                                    });

                                                    setShowRegularization(true);
                                                }}
                                                className="text-orange-500 text-xl cursor-pointer cursor-pointer"
                                            >
                                                📝
                                            </button>
                                        )
                                    }

                                    {
                                        item.status === "Incomplete" &&
                                        isRegularizationExpired(item.createdAt) && (
                                            <span
                                                className="text-gray-400 text-xl"
                                                title="Regularization Expired"
                                            >
                                                ⛔
                                            </span>
                                        )
                                    }

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showRegularization && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white p-6 rounded w-[400px]">
                            <h2 className="text-xl font-bold mb-4">
                                Attendance Regularization
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                Enter corrected check-in and check-out timings.
                            </p>

                            <label className="block mb-1">
                                Correct Check In
                            </label>

                            <input
                                type="time"
                                value={regularizationData.regularizedCheckIn}
                                onChange={(e) =>
                                    setRegularizationData({
                                        ...regularizationData,
                                        regularizedCheckIn: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded mb-3"
                            />

                            <label className="block mb-1">
                                Correct Check Out
                            </label>

                            <input
                                type="time"
                                value={regularizationData.regularizedCheckOut}
                                onChange={(e) =>
                                    setRegularizationData({
                                        ...regularizationData,
                                        regularizedCheckOut: e.target.value,
                                    })
                                }
                                className="w-full border p-2 rounded mb-3"
                            />

                            <textarea
                                placeholder="Reason"
                                value={regularizationData.regularizationReason}
                                onChange={(e) => setRegularizationData({
                                    ...regularizationData,
                                    regularizationReason: e.target.value,
                                })}
                                className="w-full border p-2 rounded mb-4"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRegularization}
                                    disabled={regularizationLoading}
                                    className={`text-white px-4 py-2 rounded ${regularizationLoading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 cursor-pointer"
                                        }`}
                                >
                                    {regularizationLoading
                                        ? "Submitting..."
                                        : "Submit"}
                                </button>

                                <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer" onClick={() => setShowRegularization(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}


export default Attendance;