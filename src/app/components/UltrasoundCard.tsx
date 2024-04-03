import React from 'react';
import Button from './Button';

interface UltrasoundCardProps {
  date: string;
  images: string[];
  comments: string;
  gestation: string;
  weight: string;
  health: string;
  nextAppointment: string;
  onClick?: () => void;
}

const UltrasoundCard: React.FC<UltrasoundCardProps> = ({
  date,
  comments,
  gestation,
  weight,
  health,
  nextAppointment,
  onClick,
}) => {
  return (
    <div className="flex flex-col w-full items-center gap-4">
      <p className="font-bold text-sm self-start">{date}</p>
      <img src="/images/ultrasonido.jpeg" alt="Ultrasonidos" className="rounded-lg" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/comment.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Comentarios del médico:</p>
            <p>{comments}</p>
          </div>
        </div>
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/fetus.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Gestación Actual</p>
            <p>{gestation}</p>
          </div>
        </div>
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/weight.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Peso Estimado</p>
            <p>{weight}</p>
          </div>
        </div>
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/health.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Salud Fetal</p>
            <p>{health}</p>
          </div>
        </div>
        <div className="flex w-full gap-2 px-1">
          <img src="/icons/calendar.svg" className="aspect-square w-6 self-start my-2" />
          <div className="text-sm">
            <p className="font-bold">Próxima Cita</p>
            <p>{nextAppointment}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <Button color="blue" text="Más información" />
        <Button color="blue" text="Compartir resultado" />
      </div>
    </div>
  );
};

export default UltrasoundCard;
