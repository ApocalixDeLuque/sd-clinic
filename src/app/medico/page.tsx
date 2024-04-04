'use client';

import { useAuthenticated } from '../hooks/useAuthenticated';
import { useClient } from '@/api/context';
import ProfileLayout from '../components/ProfileLayout';
import Button from '../components/Button';

export default function ProfilePage() {
  const { client } = useClient('admin');

  useAuthenticated();

  const { data } = client.patients.useSwr((f) => f.all())();

  return (
    <ProfileLayout title="Mis Pacientes">
      <div className="grid grid-cols-3 gap-4 w-full">
        {data?.map((patient) => (
          <div key={patient._id} className="flex flex-col items-center w-full text-lg gap-4">
            <img src="/images/women.png" className="w-[100px]" alt="logo" />
            <div className="flex flex-col items-center">
              <p className="font-bold">Nombre:</p>
              <p>{patient.name}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">ID:</p> <p>{patient._id}</p>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Button text="Generar expediente" link="/crear-reporte" selected />
            </div>
          </div>
        ))}
      </div>
    </ProfileLayout>
  );
}
