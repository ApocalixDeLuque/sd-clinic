'use client';
import UltrasoundCard from '../components/UltrasoundCard';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useSession } from '@/api/session';
import { useAuthenticated } from '../hooks/useAuthenticated';

export default function ProfilePage() {
  const session = useSession();

  useAuthenticated();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col w-full p-4 gap-4">
        {/* Profile Card */}
        <ProfileCard />
        {/* Progress Bar */}
        {/* <PregnantProgressBar
          currentWeeks={24}
          currentDays={1}
          remainingWeeks={15}
          remainingDays={6}
          estimatedDueDate="2 de Julio del 2024"
        /> */}

        {/* Mis ultrasonidos */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-16">
          <p className="font-bold text-lg">Mis Ultrasonidos</p>
          <UltrasoundCard
            id="bebe1ultrasonido"
            date="12 de Enero de 2024"
            comments="Desarrollo normal, sin anomalías detectadas.Desarrollo normal, sin anomalías detectadas."
            gestation="20 semanas y 3 día"
            weight="350 gramos"
            health="Excelente"
            nextAppointment="22 de Marzo del 2024 a las 10:00 AM"
          />
          <UltrasoundCard
            id="bebe2ultrasonido"
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
