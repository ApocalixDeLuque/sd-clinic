'use client';

import { useAuthenticated } from '../hooks/useAuthenticated';
import { useClient } from '@/api/context';
import ProfileLayout from '../components/ProfileLayout';
import UltrasoundCard from '../components/UltrasoundCard';

export default function ProfilePage() {
  const { client } = useClient('user');

  useAuthenticated();

  const { data } = client.reports.useSwr((f) => f.all())();

  return (
    <ProfileLayout title={'Mis Ultrasonidos'}>
      {data?.map((report) => (
        <UltrasoundCard
          key={report._id}
          id={report._id}
          date={new Date(report.createdAt).toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
          comments={report.observations ? report.observations.slice(0, 3) : []}
        />
      ))}
    </ProfileLayout>
  );
}
