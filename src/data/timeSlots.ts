export const getAvailableTimeSlots = async (date: Date): Promise<string[]> => {
  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  const dayOfWeek = date.getDay(); // 0 = Domenica
  
  // Define all possible time slots including half-hour slots
  let timeSlots: string[];
  
  if (dayOfWeek === 0) { // Domenica
    timeSlots = [
      '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
    ];
  } else if (dayOfWeek === 6) { // Sabato
    timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
  } else { // Giorni feriali
    timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00'
    ];
  }
  
  // If date is today, filter out past time slots
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    timeSlots = timeSlots.filter(timeSlot => {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      return (hours > currentHour) || (hours === currentHour && minutes > currentMinute + 30); // Add 30 min buffer
    });
  }
  
  try {
    const response = await fetch('/backend/get_booked_slots.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: date.toISOString().split('T')[0],
      }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch booked slots');
    
    const bookedSlots: string[] = await response.json();
    
    // Normalizza entrambi i formati per il confronto
    const normalizeTime = (time: string): string => {
      if (!time) return '';
      
      // Converti in stringa se non lo è già
      const timeStr = String(time).trim();
      
      // Estrai ore e minuti con regex
      const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = match[2];
        // Restituisci in formato standard HH:MM
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      
      return timeStr;
    };
    
    // Normalizza tutti gli orari prenotati
    const normalizedBooked = bookedSlots
      .filter(Boolean)
      .map(normalizeTime);
      
    // Normalizza anche gli orari disponibili per il confronto
    const normalizedAvailable = timeSlots.map(normalizeTime);
    
    // Filtra gli orari disponibili
    const available = normalizedAvailable.filter(
      availableTime => !normalizedBooked.includes(availableTime)
    );
    
    // Recupera i timeSlots originali che corrispondono agli orari disponibili normalizzati
    const result = timeSlots.filter((_, index) => 
      available.includes(normalizedAvailable[index])
    );
    
    // Debug logging
    console.log('📅 Data:', date.toISOString().split('T')[0]);
    console.log('🛑 Orari prenotati dal backend:', bookedSlots);
    console.log('✅ Orari normalizzati prenotati:', normalizedBooked);
    console.log('✅ Orari normalizzati disponibili:', normalizedAvailable);
    console.log('🟢 Orari disponibili finali:', result);
    
    return result;
  } catch (error) {
    console.error('Errore caricamento orari:', error);
    // Return default time slots if there's an error
    return timeSlots;
  }
};