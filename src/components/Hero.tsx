import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const Hero = () => {
  const elementRef = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="home" className="relative bg-gray-800 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')",
        }}
      >
        <div className="container mx-auto px-4">
          <div ref={elementRef} className="max-w-xl opacity-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Barber Shop
            </h1>
            <p className="text-xl mb-8">
              Precision haircuts and expert styling for the modern gentleman
            </p>
            <a
              href="#appointment"
              className="inline-block bg-white text-gray-800 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Prenota Appuntamento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};