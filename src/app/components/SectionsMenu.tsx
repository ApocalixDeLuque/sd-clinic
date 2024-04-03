'use client';
import React, { useState } from 'react';
import Button from './Button';

const SectionsMenu = () => {
  const [selectedButton, setSelectedButton] = useState('Mis Ultrasonidos');

  const handleButtonClick = (buttonText: string) => {
    setSelectedButton(buttonText);
  };

  return (
    <div className="flex flex-col w-full gap-[10px]">
      <Button
        text="Mis Ultrasonidos"
        selected={selectedButton === 'Mis Ultrasonidos'}
        onClick={() => handleButtonClick('Mis Ultrasonidos')}
      />
      <Button
        text="Cronología"
        selected={selectedButton === 'Cronología'}
        onClick={() => handleButtonClick('Cronología')}
      />
      <Button
        text="Próximas citas"
        selected={selectedButton === 'Próximas citas'}
        onClick={() => handleButtonClick('Próximas citas')}
      />
      <Button
        text="Contacta con un médico"
        selected={selectedButton === 'Contacta con un médico'}
        onClick={() => handleButtonClick('Contacta con un médico')}
      />
    </div>
  );
};

export default SectionsMenu;
