'use client';
import React from 'react';
import Button from './Button';
import { useRouter } from 'next/navigation';
import { useClient } from '@/api/context';

interface UltrasoundCardProps {
  id: string;
  date: string;
  images?: string[];
  comments: string[];
}

const UltrasoundCard: React.FC<UltrasoundCardProps> = ({ id, date, comments }) => {
  const { client } = useClient();

  const router = useRouter();
  const handleButtonClick = () => {
    router.push(`/reports/${id}`);
  };

  return (
    <div className="flex flex-col w-full items-center gap-4">
      <p className="font-bold text-sm self-start">{date}</p>
      <img src={client.reports.buildMediaURL(id, 'collage', true)} alt="Ultrasonidos" className="rounded-lg" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/comment.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Comentarios del médico:</p>
            <ul className="list-disc pl-5">
              {Array.isArray(comments)
                ? comments.map((it) => {
                    return <li key={it}>{it}</li>;
                  })
                : null}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <Button color="blue" text="Más información" onClick={handleButtonClick} selected />
        <Button color="blue" text="Compartir resultado" selected />
      </div>
    </div>
  );
};

export default UltrasoundCard;
