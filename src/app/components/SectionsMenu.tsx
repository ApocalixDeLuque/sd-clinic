'use client';
import React, { useState } from 'react';
import Button from './Button';

const SectionsMenu = () => {
  const [selectedButton, setSelectedButton] = useState('Mis Ultrasonidos');

  return (
    <div className="flex flex-col w-full gap-[10px]">
      <Button text="Mis Ultrasonidos" link="/mis-ultrasonidos" selected={selectedButton === 'Mis Ultrasonidos'} />
      <Button text="Cronología" link="/cronologia" selected={selectedButton === 'Cronología'} />
      <Button text="Próximas citas" link="/proximas-citas" selected={selectedButton === 'Próximas citas'} />
      <Button text="Contacta con un médico" link="/ayuda" selected={selectedButton === 'Contacta con un médico'} />
    </div>
  );
};

export default SectionsMenu;
