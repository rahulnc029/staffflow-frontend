import { useEffect, useState } from "react";
import API from "../../services/api";
import UserLayout from "../../layouts/UserLayout";

function AttendanceCalendar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [attendance, setAttendance] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

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

    // fetch data
    const fetchData = async () => {
        try {
            const attendanceResponse = await API.get(`/attendance/${user.id}`);
            const holidayResponse = await API.get("/holidays");
            const leaveResponse = await API.get(`/leave/my/${user.id}`);

            setAttendance(attendanceResponse.data);
            setHolidays(holidayResponse.data);
            setLeaves(leaveResponse.data.filter((item) => item.status === "Approved"));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Days in Month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    // First Day Index
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const cells = [];

    // Empty Cells
    for (let i = 0; i < firstDay; i++) {
        cells.push(null);
    }

    // Date Cells
    for (let day = 1; day <= daysInMonth; day++) {
        const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dateObject = new Date(fullDate);
        // Sunday
        const isSunday = dateObject.getDay() === 0;
        // Holiday
        const holiday = holidays.find((item) => item.holidayDate === fullDate);
        // Leave
        const leave = leaves.find((item) => fullDate >= item.fromDate && fullDate <= item.toDate);
        // Attendance
        const attendanceRecord = attendance.find((item) => item.date === fullDate);
        let label = "";
        let bgColor = "";

        if (holiday) {
            label = "H";
            bgColor = "bg-red-100"
        } else if (isSunday) {
            label = "WO";
            bgColor = "bg-yellow-100";
        } else if (leave) {
            label = "L";
            bgColor = "bg-purple-100";
        } else if (attendanceRecord) {
            if (attendanceRecord.status === "Present") {
                label = "P";
                bgColor = "bg-green-100";
            } else {
                label = "I";
                bgColor = "bg-orange-100";
            }
        }
        cells.push({
            day,
            label,
            bgColor,
            holidayName: holiday?.holidayName || "",
        });
    }


    return (
        <UserLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-6">
                    Attendance Calendar
                </h1>

                <h2 className="text-xl font-semibold mb-4">
                    {monthNames[currentMonth]} {currentYear}
                </h2>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-3 mb-3 font-semibold text-center">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>

                {/* Calendar */}
                <div className="grid grid-cols-7 gap-3">
                    {cells.map((cell, index) => (
                        <div
                            key={index}
                            className={`h-24 border rounded p-2 ${cell?.bgColor || "bg-gray-50"}`}
                        >
                            {cell && (
                                <>
                                    <div className="font-bold">
                                        {cell.day}
                                    </div>
                                    <div className="mt-2 text-sm font-semibold">
                                        {cell.label}
                                    </div>

                                    {
                                        cell.holidayName && (
                                            <div className="text-xs text-red-600 mt-1">
                                                {cell.holidayName}
                                            </div>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-5 mt-6 text-sm">
                    <div>
                        <span className="font-bold">
                            P
                        </span> - Present
                    </div>
                    <div>
                        <span className="font-bold">
                            I
                        </span> - Incomplete
                    </div>
                    <div>
                        <span className="font-bold">
                            H
                        </span> - Holiday
                    </div>

                    <div>
                        <span className="font-bold">
                            WO
                        </span> - Week Off
                    </div>

                    <div>
                        <span className="font-bold">
                            L
                        </span> - Leave
                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default AttendanceCalendar;