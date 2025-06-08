import { ScissorsIcon, PhoneIcon, MapPinIcon, ClockIcon, InstagramIcon, FacebookIcon, TwitterIcon } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Footer = () => {
  const footerRef = useScrollAnimation<HTMLDivElement>();

  return <footer id="contact" className="bg-gray-800 text-white pt-12 pb-6">
      <div ref={footerRef} className="container mx-auto px-4 opacity-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ScissorsIcon className="h-6 w-6" />
              <span className="text-xl font-bold">Classic Cuts</span>
            </div>
            <p className="text-gray-300 mb-4">
              Premium barber services for the modern gentleman. Quality
              haircuts, beard trims, and hot towel shaves.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="flex items-start space-x-3 mb-3">
              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-gray-300">
                123 Main Street, Anytown, ST 12345
              </span>
            </div>
            <div className="flex items-center space-x-3 mb-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-300">(555) 123-4567</span>
            </div>
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="text-gray-300">
                <div>Mon-Fri: 9am - 8pm</div>
                <div>Saturday: 9am - 6pm</div>
                <div>Sunday: 10am - 4pm</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="#appointment" className="text-gray-300 hover:text-white">
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Our Team
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Classic Cuts Barber Shop. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};