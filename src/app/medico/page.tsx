"use client";
import UltrasoundCard from "../components/UltrasoundCard";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { useSession } from "@/api/session";
import { useAuthenticated } from "../hooks/useAuthenticated";

export default function ProfilePage() {
  const session = useSession();

  useAuthenticated();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row w-full p-4 gap-4">
        {/* Profile Card */}
        <ProfileCard />
        {/* Mis ultrasonidos */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-16">
          <p className="font-bold text-lg">Mis Ultrasonidos</p>
          <UltrasoundCard
            id="bebe1ultrasonido"
            date="12 de Enero de 2024"
            comments={[]}
          />
        </div>

        {/*  */}
      </div>
      <div>footer</div>
    </main>
  );
}
