'use client';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import Link from 'next/link';
import { useSession } from '@/api/session';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isAuth, logout } = useSession();

  const handleClickOutside = (event: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div onClick={handleClickOutside} className="flex w-full items-center justify-between border-b p-4">
      <Link href={'/'} className="aspect-[120/25]">
        <img src="/images/logo.png" alt="logo" />
      </Link>
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
        <div ref={sidebarRef} className="flex flex-col w-full fixed top-0 bottom-0 right-0 z-50 bg-white p-4 gap-8">
          <div className="flex w-full items-center justify-between">
            <Link onClick={() => setIsSidebarOpen(false)} href={'/'} className="aspect-[120/25]">
              <img src="/images/logo.png" alt="logo" />
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="w-8 self-end">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {/* Resto del contenido de la barra lateral */}
          </div>
          <p className="text-lg font-bold self-center">Menu de Navegación</p>

          <div className="flex flex-col gap-4">
            <Button
              text="Inicio"
              link="/"
              onClick={() => {
                console.log('Inicio');
              }}
            />
            {isAuth ? (
              <Button
                text="Cerrar sesión"
                onClick={() => {
                  setIsSidebarOpen(false);
                  logout();
                }}
                selected
              />
            ) : (
              <>
                <Button
                  text="Registrarse"
                  link="/register"
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                />
                <Button
                  text="Iniciar sesión"
                  link="/"
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  selected
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
