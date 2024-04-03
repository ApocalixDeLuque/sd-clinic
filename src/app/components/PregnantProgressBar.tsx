import React from 'react';

interface PregnantProgressBarProps {
  currentWeeks: number;
  currentDays: number;
  remainingWeeks: number;
  remainingDays: number;
  estimatedDueDate: string;
}

const PregnantProgressBar: React.FC<PregnantProgressBarProps> = ({
  currentWeeks,
  currentDays,
  remainingWeeks,
  remainingDays,
  estimatedDueDate,
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
      <p className="font-bold text-lg">Progreso</p>
      <div className="flex flex-col w-full items-center gap-2">
        <p className="font-bold">
          {currentWeeks} semanas y {currentDays} día
        </p>
        <div className="w-full h-2.5 bg-gray-100 rounded-lg overflow-hidden">
          <div className="w-3/5 h-2.5 bg-pink-400 rounded-lg"></div>
        </div>
        <p>
          {remainingWeeks} semanas y {remainingDays} días restantes
        </p>
      </div>
      <div className="flex flex-col items-center w-full gap-2">
        <p className="font-bold">Fecha estimada de parto</p>
        <p>{estimatedDueDate}</p>
      </div>
    </div>
  );
};

export default PregnantProgressBar;
