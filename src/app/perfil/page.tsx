import { faBars, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UltrasoundCard from '../components/UltrasoundCard';
import SectionsMenu from '../components/SectionsMenu';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col w-full p-4 gap-4">
        {/* Profile Card */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
          <div className="flex gap-2">
            <img src="/images/pfp.png" alt="logo" />
            <div className="flex flex-col gap-2">
              <p className="font-bold">Maria Fernanda Ramirez Gonzalez</p>
              <div>
                <p className="font-bold">Último ingreso:</p>
                <p>15/mar/2024 3:01:34 PM</p>
              </div>
            </div>
            <FontAwesomeIcon icon={faGear} className="aspect-square w-8 self-start" />
          </div>
          <SectionsMenu />
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-4">
          <p className="font-bold">Progreso</p>
          <div className="flex flex-col w-full items-center gap-2">
            <p className="font-bold">24 semanas y 1 día</p>
            <div className="w-full h-2.5 bg-[#D9D9D9] rounded-lg overflow-hidden">
              {/* Adjust width here for 60% */}
              <div className="w-3/5 h-2.5 bg-[#F2789F] rounded-lg"></div>
            </div>
            <p>15 semanas y 6 días restantes</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-16">
          <p className="font-bold">Mis Ultrasonidos</p>
          <UltrasoundCard
            date="12 de Enero de 2024"
            comments="Desarrollo normal, sin anomalías detectadas.Desarrollo normal, sin anomalías detectadas."
            gestation="20 semanas y 3 día"
            weight="350 gramos"
            health="Excelente"
            nextAppointment="22 de Marzo del 2024 a las 10:00 AM"
          />
          <UltrasoundCard
            date="2 de Abril del 2024"
            comments="Gemelos creciendo saludablemente y con buen peso."
            gestation="24 semanas y 1 día"
            weight="Bebé 1: 600 gramos, Bebé 2: 550 gramos"
            health="Muy buena, ambos bebés con movimientos activos."
            nextAppointment="9 de Abril del 2024 a las 11:30 AM"
          />
        </div>

        {/*  */}
      </div>
      <div>footer</div>
    </main>
  );
}
