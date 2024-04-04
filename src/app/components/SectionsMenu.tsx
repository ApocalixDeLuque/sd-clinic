'use client';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import { useSession } from '@/api/session';

const SectionsMenu = () => {
  const { user } = useSession();
  const [selectedButton, setSelectedButton] = useState(user?.isAdmin ? 'Mis Pacientes' : 'Mis Ultrasonidos');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/perfil') {
      setSelectedButton('Mis Ultrasonidos');
    }
  }, []);
  const handleButtonClick = (buttonText: string) => {
    setSelectedButton(buttonText);
  };

  return (
    <div className="flex flex-col w-full gap-[10px]">
      {user?.isAdmin && (
        <Button
          text={'Mis Pacientes'}
          selected={selectedButton === 'Mis Pacientes'}
          link={'/medico'}
          onClick={() => handleButtonClick('Mis Pacientes')}
        />
      )}
      <Button
        text={'Mis Ultrasonidos'}
        selected={selectedButton === 'Mis Ultrasonidos'}
        link={'/perfil'}
        onClick={() => handleButtonClick('Mis Ultrasonidos')}
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
