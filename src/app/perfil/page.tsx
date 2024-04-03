'use client';
import UltrasoundCard from '../components/UltrasoundCard';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useSession } from '@/api/session';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { useClient } from "@/api/context";

export default function ProfilePage() {
  const { client } = useClient("user");
  const session = useSession();

  useAuthenticated();

  const { data } = client.reports.useSwr((f) => f.all())();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col w-full p-4 gap-4">
        {/* Profile Card */}
        <ProfileCard />

        {/* Mis ultrasonidos */}
        <h2 className="font-bold text-xl text-center">Mis Ultrasonidos</h2>

        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-16">
          {data?.map((report) => (
            <UltrasoundCard
              key={report._id}
              id={report._id}
              date={new Date(report.createdAt).toLocaleString("es-MX", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
              comments={report.observations ?? []}
            />
          ))}
        </div>

        {/*  */}
      </div>
      <div>footer</div>
    </main>
  );
}
