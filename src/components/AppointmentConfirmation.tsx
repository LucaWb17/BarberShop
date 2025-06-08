import { format } from 'date-fns';
import { CheckCircleIcon } from 'lucide-react';
import { it } from 'date-fns/locale';

interface AppointmentConfirmationProps {
  date: Date;
  time: string;
  bookingDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onReset: () => void;
}

export const AppointmentConfirmation = ({
  date,
  time,
  bookingDetails,
  onReset
}: AppointmentConfirmationProps) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircleIcon className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold mb-4">Appuntamento Confermato!</h3>
      <p className="text-gray-600 mb-6">
        Grazie per aver prenotato con Classic Cuts Barber Shop. Ti aspettiamo!
      </p>
      <div className="bg-gray-50 rounded-md p-4 mb-6">
        <div className="mb-2">
          <span className="font-medium">Data:</span>{' '}
          {format(date, 'EEEE d MMMM yyyy', { locale: it })}
        </div>
        <div className="mb-2">
          <span className="font-medium">Ora:</span> {time}
        </div>
        <div className="mb-2">
          <span className="font-medium">Nome:</span> {bookingDetails.name}
        </div>
        <div>
          <span className="font-medium">Telefono:</span> {bookingDetails.phone}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Una email di conferma è stata inviata a {bookingDetails.email}.
        Per modificare o cancellare l'appuntamento, chiamaci al (555) 123-4567.
      </p>
      <button
        onClick={onReset}
        className="bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition duration-200"
      >
        Prenota un altro appuntamento
      </button>
    </div>
  );
};