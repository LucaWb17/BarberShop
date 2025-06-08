import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}
export const Calendar = ({
  selectedDate,
  onDateSelect
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const onDateClick = (day: Date) => {
    onDateSelect(day);
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const renderHeader = () => {
    return <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded-full">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="font-bold text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded-full">
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>;
  };
  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return <div className="grid grid-cols-7 mb-1">
        {days.map(day => <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
            {day}
          </div>)}
      </div>;
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
    // Disable past dates and allow only 30 days in advance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isDisabled = day < today || day > maxDate;
        days.push(<div key={day.toString()} className={`relative p-1 h-10 flex items-center justify-center
              ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''}
              ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
              ${isSameDay(day, selectedDate as Date) ? 'bg-gray-800 text-white hover:bg-gray-700' : ''}
            `} onClick={() => !isDisabled && onDateClick(cloneDay)}>
            <span className="text-sm">{formattedDate}</span>
          </div>);
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>);
      days = [];
    }
    return <div>{rows}</div>;
  };
  return <div className="calendar bg-white rounded-md border border-gray-200">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>;
};