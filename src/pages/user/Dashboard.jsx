import { useEffect, useState } from "react";
import UserLayout from "../../layouts/UserLayout";
import API from "../../services/api";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [attendance, setAttendance] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const [currentTime, setCurrentTime] = useState("");

    const [todayAttendance, setTodayAttendance] = useState(null);

    const [showHolidayModal, setShowHolidayModal] =
        useState(false);

    // Calendar Month State
    const [currentDate, setCurrentDate] =
        useState(new Date());

    const currentYear =
        currentDate.getFullYear();

    const currentMonth =
        currentDate.getMonth();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // LIVE CLOCK
    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(
                new Date().toLocaleTimeString()
            );

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    // FETCH DATA
    const fetchData = async () => {

        try {

            const attendanceResponse =
                await API.get(`/attendance/${user.id}`);

            const holidayResponse =
                await API.get("/holidays");

            const leaveResponse =
                await API.get(`/leave/my/${user.id}`);

            setAttendance(attendanceResponse.data);

            setHolidays(holidayResponse.data);

            setLeaves(leaveResponse.data);

            const today =
                new Date().toISOString().split("T")[0];

            const todayRecord =
                attendanceResponse.data.find(
                    (item) => item.date === today
                );

            setTodayAttendance(todayRecord);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchData();

    }, []);

    // CLOCK IN
    const handleClockIn = async () => {

        try {

            await API.post("/attendance/clock-in", {
                employeeId: user.id,
            });

            fetchData();

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    // CLOCK OUT
    const handleClockOut = async () => {

        try {

            await API.post("/attendance/clock-out", {
                employeeId: user.id,
            });

            fetchData();

        } catch (error) {

            alert(error.response?.data?.message);

        }

    };

    // NEXT UPCOMING HOLIDAY
    const today = new Date().toISOString().split("T")[0];

    const upcomingHoliday = holidays.find(
        (item) => item.holidayDate >= today
    );

    // LEAVE BALANCE
    const approvedLeaves = leaves.filter(
        (item) => item.status === "Approved"
    );

    let sickUsed = 0;
    let casualUsed = 0;

    approvedLeaves.forEach((leave) => {

        if (leave.leaveType === "Sick Leave") {
            sickUsed += leave.totalDays;
        }

        if (leave.leaveType === "Casual Leave") {
            casualUsed += leave.totalDays;
        }

    });

    const sickRemaining = 12 - sickUsed;
    const casualRemaining = 12 - casualUsed;

    // CALENDAR LOGIC

    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const fullDate =
            `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dateObject = new Date(fullDate);

        const isSunday =
            dateObject.getDay() === 0;

        const holiday = holidays.find(
            (item) => item.holidayDate === fullDate
        );

        const leave = approvedLeaves.find(
            (item) =>
                fullDate >= item.fromDate &&
                fullDate <= item.toDate
        );

        const attendanceRecord = attendance.find(
            (item) => item.date === fullDate
        );

        let label = "";
        let bgColor = "";

        if (holiday) {

            label = "H";
            bgColor = "bg-red-100";

        }

        else if (isSunday) {

            label = "WO";
            bgColor = "bg-yellow-100";

        }

        else if (leave) {

            label = "L";
            bgColor = "bg-purple-100";

        }

        else if (attendanceRecord) {

            if (attendanceRecord.status === "Present") {

                label = "P";
                bgColor = "bg-green-100";

            }

            else {

                label = "I";
                bgColor = "bg-orange-100";

            }

        }

        cells.push({
            day,
            label,
            bgColor,
        });

    }

    // SUMMARY

    const presentCount = attendance.filter(
        (item) => item.status === "Present"
    ).length;

    const incompleteCount = attendance.filter(
        (item) => item.status === "Incomplete"
    ).length;

    const lateCount = attendance.filter(
        (item) => item.arrivalStatus === "Late"
    ).length;

    return (

        <UserLayout>

            {/* TOP PROFILE CARD */}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <h1 className="text-3xl font-bold">
                    Welcome {user.employeeName}
                </h1>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">

                    <div>
                        <p className="text-gray-500">
                            Employee ID
                        </p>

                        <p className="font-semibold">
                            {user.employeeCode}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Email
                        </p>

                        <p className="font-semibold">
                            {user.employeeEmail}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Role
                        </p>

                        <p className="font-semibold">
                            {user.role}
                        </p>
                    </div>

                </div>

            </div>

            {/* SMALL CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                {/* ATTENDANCE CARD */}

                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="text-lg font-semibold mb-4">
                        Live Attendance
                    </h2>

                    <p className="text-2xl font-bold">
                        {currentTime}
                    </p>

                    <p className="mt-3">
                        Status:
                        <span className="font-semibold ml-2">
                            {
                                todayAttendance
                                    ? todayAttendance.status
                                    : "Not Clocked In"
                            }
                        </span>
                    </p>

                    <div className="flex gap-3 mt-5">

                        <button
                            onClick={handleClockIn}
                            disabled={todayAttendance}
                            className={`px-4 py-2 rounded text-white cursor-pointer ${todayAttendance
                                ? "bg-gray-400"
                                : "bg-green-600"
                                }`}
                        >
                            Clock In
                        </button>

                        <button
                            onClick={handleClockOut}
                            disabled={
                                !todayAttendance ||
                                todayAttendance?.checkOutTime
                            }
                            className={`px-4 py-2 rounded text-white cursor-pointer ${!todayAttendance ||
                                todayAttendance?.checkOutTime
                                ? "bg-gray-400"
                                : "bg-red-600"
                                }`}
                        >
                            Clock Out
                        </button>

                    </div>

                </div>

                {/* HOLIDAY CARD */}

                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="text-lg font-semibold mb-4">
                        Upcoming Holiday
                    </h2>

                    {
                        upcomingHoliday ? (
                            <>
                                <p className="text-xl font-bold">
                                    {upcomingHoliday.holidayName}
                                </p>

                                <p className="text-gray-500 mt-2">
                                    {upcomingHoliday.holidayDate}
                                </p>

                                <button
                                    onClick={() =>
                                        setShowHolidayModal(true)
                                    }
                                    className="mt-5 text-blue-600 font-semibold cursor-pointer"
                                >
                                    View More
                                </button>
                            </>
                        ) : (
                            <p>No upcoming holidays</p>
                        )
                    }

                </div>

                {/* LEAVE BALANCE */}

                <div className="bg-white rounded-xl shadow-sm p-5">

                    <h2 className="text-lg font-semibold mb-4">
                        Leave Balance
                    </h2>

                    <div className="mb-4">

                        <p className="text-gray-500">
                            Sick Leave
                        </p>

                        <p className="text-xl font-bold">
                            {sickRemaining}/12
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Casual Leave
                        </p>

                        <p className="text-xl font-bold">
                            {casualRemaining}/12
                        </p>

                    </div>

                </div>

            </div>

            {/* CALENDAR + SUMMARY */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

                {/* CALENDAR */}

                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-4">

                    <div className="flex items-center justify-between mb-4">

                        <button
                            onClick={() =>
                                setCurrentDate(
                                    new Date(
                                        currentYear,
                                        currentMonth - 1,
                                        1
                                    )
                                )
                            }
                            className="cursor-pointer text-lg px-2"
                        >
                            ←
                        </button>

                        <h2 className="text-lg font-bold">
                            {monthNames[currentMonth]} {currentYear}
                        </h2>

                        <button
                            onClick={() =>
                                setCurrentDate(
                                    new Date(
                                        currentYear,
                                        currentMonth + 1,
                                        1
                                    )
                                )
                            }
                            className="cursor-pointer text-lg px-2"
                        >
                            →
                        </button>

                    </div>

                    {/* WEEK DAYS */}

                    <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-semibold text-gray-600">

                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>

                    </div>

                    {/* CALENDAR */}

                    <div className="grid grid-cols-7 gap-1">

                        {cells.map((cell, index) => (

                            <div
                                key={index}
                                className={`h-16 rounded border p-1 text-xs ${cell?.bgColor || "bg-gray-50"
                                    }`}
                            >

                                {
                                    cell && (
                                        <>

                                            <div className="font-semibold">
                                                {cell.day}
                                            </div>

                                            <div className="mt-1 text-[10px] font-bold">
                                                {cell.label}
                                            </div>

                                        </>
                                    )
                                }

                            </div>

                        ))}

                    </div>

                </div>

                {/* SUMMARY */}

                <div className="bg-white rounded-xl shadow-sm p-4 h-fit">

                    <h2 className="text-lg font-semibold mb-4">
                        Attendance Summary
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between items-center border-b pb-2">
                            <span>Present Days</span>

                            <span className="font-bold text-green-600">
                                {presentCount}
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b pb-2">
                            <span>Incomplete</span>

                            <span className="font-bold text-orange-500">
                                {incompleteCount}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Late Arrivals</span>

                            <span className="font-bold text-red-500">
                                {lateCount}
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            {/* ATTENDANCE TABLE */}

            <div className="bg-white rounded-xl shadow-sm p-5">

                <div className="flex items-center justify-between mb-4">

                    <h2 className="text-lg font-bold">
                        Recent Attendance
                    </h2>

                    {/* <button
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        View More
                    </button> */}

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead>

                            <tr className="border-b text-gray-600">

                                <th className="text-left py-2">
                                    Date
                                </th>

                                <th className="text-left py-2">
                                    In
                                </th>

                                <th className="text-left py-2">
                                    Out
                                </th>

                                <th className="text-left py-2">
                                    Hours
                                </th>

                                <th className="text-left py-2">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                attendance.slice(0, 5).map((item) => (

                                    <tr
                                        key={item._id}
                                        className="border-b last:border-none"
                                    >

                                        <td className="py-3">
                                            {item.date}
                                        </td>

                                        <td className="py-3">
                                            {item.checkInTime || "--"}
                                        </td>

                                        <td className="py-3">
                                            {item.checkOutTime || "--"}
                                        </td>

                                        <td className="py-3">
                                            {item.grossHours || "--"}
                                        </td>

                                        <td className="py-3">

                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${item.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* HOLIDAY MODAL */}

            {
                showHolidayModal && (

                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                        <div className="bg-white rounded-xl p-6 w-[500px]">

                            <div className="flex justify-between items-center mb-5">

                                <h2 className="text-2xl font-bold">
                                    Holidays
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowHolidayModal(false)
                                    }
                                    className="cursor-pointer text-xl"
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto">

                                {
                                    holidays.map((item) => (

                                        <div
                                            key={item._id}
                                            className="border rounded p-4"
                                        >

                                            <p className="font-bold">
                                                {item.holidayName}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                {item.holidayDate}
                                            </p>

                                            {
                                                item.description && (
                                                    <p className="text-sm mt-2">
                                                        {item.description}
                                                    </p>
                                                )
                                            }

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    </div>

                )
            }

        </UserLayout>

    );

}

export default Dashboard;