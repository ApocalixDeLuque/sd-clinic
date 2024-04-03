'use client';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div onClick={handleClickOutside} className="flex w-full items-center justify-between border-b p-4">
      <div className="aspect-[120/25]">
        <img src="/images/logo.png" alt="logo" />
      </div>
      <button
        disabled={isSidebarOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsSidebarOpen(!isSidebarOpen);
        }}
      >
        <FontAwesomeIcon icon={faBars} className="aspect-square w-8" />
      </button>

      {isSidebarOpen && (
        <div ref={sidebarRef} className="flex flex-col w-full fixed top-0 bottom-0 right-0 z-50 bg-gray-400 p-4 gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="aspect-[120/25]">
              <img src="/images/logo.png" alt="logo" />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="w-8 self-end">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {/* Resto del contenido de la barra lateral */}
          </div>
          <Button
            text="Mis Ultrasonidos"
            onClick={() => {
              console.log('Mis Ultrasonidos');
            }}
          />
          <Button
            text="Mis Ultrasonidos"
            onClick={() => {
              console.log('Mis Ultrasonidos');
            }}
          />
          <Button
            text="Mis Ultrasonidos"
            onClick={() => {
              console.log('Mis Ultrasonidos');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
