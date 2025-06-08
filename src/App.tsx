import { Header } from './components/Header';
import { Hero } from './components/Hero';
// import { Services } from './components/Services';
import { AppointmentBooking } from './components/AppointmentBooking';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* <Services /> */}
        <AppointmentBooking />
      </main>
      <Footer />
    </div>
  );
}