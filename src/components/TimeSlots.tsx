import { useState, useEffect } from 'react';
import { getAvailableTimeSlots } from '../data/timeSlots';

interface TimeSlotsProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  refresh: number;
}

export const TimeSlots = ({
  selectedDate,
  selectedTime,
  onTimeSelect,
  refresh
}: TimeSlotsProps) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Griglia fissa: 09:00 – 19:00 ogni 30 min
  const fullSlotList = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30',
    '19:00'
  ];

  // Funzione di normalizzazione degli orari (come quella della funzione getAvailableTimeSlots)
  const normalizeTime = (time: string): string => {
    if (!time) return '';
    
    const timeStr = String(time).trim();
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = match[2];
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    return timeStr;
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const slots = await getAvailableTimeSlots(selectedDate);
        setAvailableTimeSlots(slots);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Errore nel caricamento degli orari disponibili');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, refresh]);

  if (isLoading) {
    return (
      <div className="p-4 text-gray-600">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Caricamento orari disponibili...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        {error}
      </div>
    );
  }

  // Normalizza gli orari disponibili per un confronto coerente
  const normalizedAvailable = availableTimeSlots.map(normalizeTime);

  return (
    <div className="grid grid-cols-3 gap-2">
      {fullSlotList.map(time => {
        // Normalizza il time corrente nella lista completa prima di confrontarlo
        const normalizedTime = normalizeTime(time);
        const isAvailable = normalizedAvailable.includes(normalizedTime);
        const isSelected = selectedTime === time;

        return (
          <button
            key={time}
            className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
              isAvailable
                ? isSelected
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
            onClick={() => isAvailable && onTimeSelect(time)}
            disabled={!isAvailable}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
};