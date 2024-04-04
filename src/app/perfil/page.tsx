'use client';
import UltrasoundCard from '../components/UltrasoundCard';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useSession } from '@/api/session';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { useClient } from '@/api/context';

export default function ProfilePage() {
  const { user } = useSession();
  const { client } = useClient('user');
  const session = useSession();

  useAuthenticated();

  const { data } = client.reports.useSwr((f) => f.all())();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col lg:max-w-[1500px] lg:flex-row w-full p-4 self gap-4">
        {/* Profile Card */}
        <ProfileCard />
        {/* Mis ultrasonidos */}
        <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-16">
          <h2 className="font-bold text-xl text-center">{user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos'}</h2>
          {data?.map((report) => (
            <div key={report._id}>{report._id}</div>
          ))}
        </div>
        {/*  */}
      </div>
      <div>footer</div>
    </main>
  );
}
