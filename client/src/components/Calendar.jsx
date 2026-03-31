import { useState } from 'react';
import { 
    format, addMonths, subMonths, startOfMonth, endOfMonth, 
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
    isAfter, isBefore, isWithinInterval, startOfDay
} from 'date-fns';
import '../css/ProductPage/Calendar.css'; 

function Calendar({ checkIn, checkOut, setCheckIn, setCheckOut }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfDay(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day) => {
        if (isBefore(day, today)) return; 

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(day);
            setCheckOut(null);
        } else if (checkIn && !checkOut) {
            if (isBefore(day, checkIn)) {
                setCheckIn(day); 
            } else {
                setCheckOut(day);
            }
        }
    };

    const renderHeader = () => (
        <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={nextMonth}>&gt;</button>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(new Date());
        for (let i = 0; i < 7; i++) {
            days.push(<div className="day-name" key={i}>{format(addDays(startDate, i), 'EEEEE')}</div>);
        }
        return <div className="days-row">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                
                let cellClass = "cell";
                if (!isSameMonth(day, monthStart)) cellClass += " disabled";
                else if (isBefore(day, today)) cellClass += " past";
                
                if (checkIn && isSameDay(day, checkIn)) cellClass += " selected-start";
                if (checkOut && isSameDay(day, checkOut)) cellClass += " selected-end";
                if (checkIn && checkOut && isWithinInterval(day, { start: checkIn, end: checkOut })) {
                    cellClass += " in-range";
                }

                days.push(
                    <div 
                        className={cellClass} 
                        key={day} 
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className="date-number">{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="days-grid" key={day}>{days}</div>);
            days = [];
        }
        return <div className="calendar-body">{rows}</div>;
    };

    return (
        <div className="custom-calendar">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
}

export default Calendar;