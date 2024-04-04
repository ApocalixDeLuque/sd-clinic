'use client';
import React, { useRef } from 'react';
import Button from './Button';
import { useRouter } from 'next/navigation';
import { useClient } from '@/api/context';
import {
  FloatingArrow,
  arrow,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import toast from 'react-hot-toast';

interface UltrasoundCardProps {
  id: string;
  date: string;
  images?: string[];
  comments: string[];
}

const ShareTimes = [
  {
    label: 'Una Hora',
    seconds: 3600,
  },
  {
    label: 'Un Día',
    seconds: 86400,
  },
  {
    label: 'Una Semana',
    seconds: 604800,
  },
  {
    label: 'Una Mes',
    seconds: 2592000,
  },
];

const UltrasoundCard: React.FC<UltrasoundCardProps> = ({ id, date, comments }) => {
  const { client } = useClient('user');

  const [openShare, setOpenShare] = React.useState(false);

  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: openShare,
    onOpenChange: setOpenShare,
    middleware: [
      offset(13),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    placement: 'top',
    strategy: 'absolute',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const router = useRouter();
  const handleButtonClick = () => {
    router.push(`/reports/${id}`);
  };

  const handleShare = (time: number) => {
    setOpenShare(false);

    const f = async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + time * 1000);

      const { secret } = await client.reports
        .createSecret(id, {
          expiresAt: expiresAt.toISOString(),
        })
        .submit();

      const url = `${window.location.origin}/reports/${id}?secret=${secret}`;

      await window.navigator.clipboard.writeText(url);
      try {
        await window.navigator.share({
          url,
          title: 'Ultrasonido',
        });
      } catch (err) {}
    };

    void toast
      .promise(f(), {
        loading: 'Generando link de ultrasonido...',
        success: 'Link copiado al portapapeles!',
        error: 'Error al generar link de ultrasonido',
      })
      .then();
  };

  return (
    <div className="flex flex-col w-full items-center gap-4 lg:px-20">
      {openShare && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-black/20 shadow-black/30 shadow text-lg"
        >
          <FloatingArrow ref={arrowRef} context={context} fill="white" strokeWidth={2} stroke="gray" />
          <div className="text-xs text-gray-800 text-center lg:text-xl">
            Cuanto tiempo quieres
            <br />
            compartir este ultrasonido?
          </div>
          <div className="w-full border-t border-t-black/20" />

          {ShareTimes.map((it) => (
            <button
              type="button"
              className="bg-verde-salud text-white px-4 py-1 lg:py-2 pl-5 rounded relative lg:text-xl"
              key={it.seconds}
              onClick={() => {
                handleShare(it.seconds);
              }}
            >
              <div className="w-2 h-full bg-blue-400 absolute top-0 left-0 rounded-l" />
              {it.label}
            </button>
          ))}
        </div>
      )}

      <p className="font-bold self-start lg:text-xl">{date}</p>
      <img src={client.reports.buildMediaURL(id, 'collage', true)} alt="Ultrasonidos" className="rounded-lg" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/comment.svg" className="aspect-square w-6 self-start my-2" />
          <div className="flex flex-col gap-2 lg:text-xl">
            <p className="font-bold">Comentarios del médico:</p>
            <ul className="list-disc pl-5 ">
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
        <button
          {...getReferenceProps()}
          ref={refs.setReference}
          type="submit"
          className="
w-full text-center font-medium
bg-blue-400 border-blue-400 text-white
 border-2 rounded-lg py-1 lg:py-2 lg:text-xl
          "
        >
          Compartir
        </button>
      </div>
    </div>
  );
};

export default UltrasoundCard;
