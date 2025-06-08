import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';
import { AppointmentConfirmation } from './AppointmentConfirmation';
import { format } from 'date-fns';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshSlots, setRefreshSlots] = useState(0);

  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const formRef = useScrollAnimation<HTMLDivElement>();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    // Reset errors when user makes a new selection
    setErrors([]);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Reset errors when user makes a new selection
    setErrors([]);
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    // Reset errors when user makes a new selection
    setErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset errors when user types
    setErrors([]);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService(null);
    setBookingDetails({
      name: '',
      email: '',
      phone: ''
    });
    setErrors([]);
    setSuccessMessage(null);
  };

  // Funzione per convertire orario AM/PM in formato 24 ore (HH:MM)
  // Ora non più necessaria se gli orari sono già in formato 24h
  function convertTo24Hour(time: string): string {
    return time;
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedDate || !selectedTime || !selectedService) return;
  
  //   setIsSubmitting(true);
  //   setErrors([]);
  //   setSuccessMessage(null);
  
  //   try {
  //     // Conversione orario in formato 24 ore
  //     const timeToSend = convertTo24Hour(selectedTime);
  //     const response = await fetch('/backend/save_booking.php', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         name: bookingDetails.name,
  //         email: bookingDetails.email,
  //         phone: bookingDetails.phone,
  //         date: format(selectedDate, 'yyyy-MM-dd'),
  //         time: timeToSend,
  //         service: selectedService
  //       })
  //     });
  
  //     const result = await response.json();
  
  //     if (!response.ok) {
  //       // Handle validation errors from the backend
  //       if (result.details && Array.isArray(result.details)) {
  //         setErrors(result.details);
  //       } else {
  //         setErrors([result.error || 'Errore durante la prenotazione']);
  //       }
  //       setRefreshSlots(prev => prev + 1); // Aggiorna la lista degli orari anche in caso di errore
  //       // Non resettiamo il form in caso di errore
  //       return;
  //     }
  
  //     // Prenotazione avvenuta con successo
  //     setSuccessMessage(result.message || 'Prenotazione effettuata con successo!');
      
  //     // Oppure avanza al passo successivo del wizard
  //     setStep(2);
  //     setRefreshSlots(prev => prev + 1);
  //   } catch (err) {
  //     console.error(err);
  //     setErrors(['Si è verificato un errore durante la prenotazione. Riprova più tardi.']);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !selectedService) return;
  
    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage(null);
  
    try {
      const timeToSend = convertTo24Hour(selectedTime);
  
      const response = await fetch('/backend/save_booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: bookingDetails.name,
          email: bookingDetails.email,
          phone: bookingDetails.phone,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: timeToSend,
          service: selectedService
        })
      });
      const result = await response.json();
      if (response.ok) {
        // ✅ Mostra subito la conferma
        // setSuccessMessage(result.message || 'Prenotazione effettuata con successo!');
        setStep(2);
  
        // 🔁 Aggiorna gli slot dopo senza bloccare la UI
        setTimeout(() => {
          console.log("🔁 Ricarico gli orari disponibili dopo la prenotazione");
          setRefreshSlots(prev => prev + 1);
        }, 100);

        setSuccessMessage(result.message || 'Prenotazione effettuata con successo!'); //provare cosi 

      } else {
        
        if (result.details && Array.isArray(result.details)) {
          setErrors(result.details);
        } else {
          setErrors([result.error || 'Errore durante la prenotazione']);
        }
        setRefreshSlots(prev => prev + 1);
      }
  
    } catch (err) {
      console.error(err);
      setErrors(['Si è verificato un errore durante la prenotazione. Riprova più tardi.']);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  const resetBooking = () => {
    resetForm();
    setStep(1);
  };

  return (
    <section id="appointment" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl font-bold text-center mb-12 opacity-0">
          Prenota un Appuntamento
        </h2>
        
        {/* Messaggi di errore */}
        {errors.length > 0 && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              <p className="font-medium mb-2">Si sono verificati i seguenti errori:</p>
              <ul className="list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Messaggio di successo */}
        {successMessage && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
              {successMessage}
            </div>
          </div>
        )}
        
        {step === 1 ? (
          <div ref={formRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden opacity-0">
            <div className="md:flex">
              <div className="md:w-1/2 p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-4">Seleziona Data e Ora</h3>
                <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
                {selectedDate && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">
                      Orari disponibili per{' '}
                      {format(selectedDate, 'EEEE, d MMMM yyyy')}:
                    </h4>
                    <TimeSlots
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={handleTimeSelect}
                      refresh={refreshSlots}
                    />
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-6">
                <h3 className="text-xl font-semibold mb-4">I Tuoi Dati</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="service">
                      Seleziona Servizio
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedService || ''}
                      onChange={e => handleServiceSelect(e.target.value)}
                      required
                    >
                      <option value="">Seleziona un servizio</option>
                      <option value="haircut">Taglio Capelli - €25</option>
                      <option value="haircut-beard">Taglio Capelli e Barba - €35</option>
                      <option value="beard">Taglio Barba - €15</option>
                      <option value="shave">Rasatura - €30</option>
                      <option value="kids">Taglio Bambino - €20</option>
                      <option value="senior">Taglio Senior - €20</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={bookingDetails.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={bookingDetails.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={bookingDetails.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={!selectedDate || !selectedTime || !selectedService || isSubmitting}
                      className={`flex-1 py-2 px-4 rounded-md font-medium text-white 
                        ${!selectedDate || !selectedTime || !selectedService || isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      {isSubmitting ? 'Prenotazione in corso...' : 'Prenota Appuntamento'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="py-2 px-4 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div ref={formRef} className="opacity-0">
            {selectedDate && selectedTime && (
              <AppointmentConfirmation
                date={selectedDate}
                time={selectedTime}
                bookingDetails={bookingDetails}
                onReset={resetBooking}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};