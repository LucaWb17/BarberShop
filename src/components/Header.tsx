import { useState } from 'react';
import { ScissorsIcon, MenuIcon, XIcon } from 'lucide-react';
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ScissorsIcon className="h-6 w-6 text-gray-800" />
          <span className="text-xl font-bold text-gray-800">Barber Shop</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-800 hover:text-gray-600">
            Home
          </a>
          {/* <a href="#services" className="text-gray-800 hover:text-gray-600">
            Services
          </a> */}
          <a href="#appointment" className="text-gray-800 hover:text-gray-600">
          Prenota Appuntamento
          </a>
          <a href="#contact" className="text-gray-800 hover:text-gray-600">
            Contact
          </a>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <a href="#home" className="py-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            {/* <a href="#services" className="py-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
              Services
            </a> */}
            <a href="#appointment" className="py-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
              Prenota Appuntamento
            </a>
            <a href="#contact" className="py-2 text-gray-800" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
          </div>
        </div>}
    </header>;
};