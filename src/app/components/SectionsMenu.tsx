'use client';
import React, { useState } from 'react';
import Button from './Button';
import { useSession } from '@/api/session';

const SectionsMenu = () => {
  const { user } = useSession();
  const [selectedButton, setSelectedButton] = useState(user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos');

  const handleButtonClick = (buttonText: string) => {
    setSelectedButton(buttonText);
  };

  return (
    <div className="flex flex-col w-full gap-[10px]">
      <Button
        text={user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos'}
        selected={selectedButton === (user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos')}
        onClick={() => handleButtonClick(user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos')}
      />
      <Button
        text="Próximas citas"
        selected={selectedButton === 'Próximas citas'}
        onClick={() => handleButtonClick('Próximas citas')}
      />
    </div>
  );
};

export default SectionsMenu;
