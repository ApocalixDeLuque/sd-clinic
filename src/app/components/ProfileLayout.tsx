'use client';
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import ProfileCard from './ProfileCard';
import { useSession } from '@/api/session';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { useClient } from '@/api/context';

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  useAuthenticated();

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}
      <div className="flex flex-col h-full lg:max-w-[1500px] lg:flex-row w-full p-4 self gap-4">
        {/* Profile Card */}
        <ProfileCard />
        {/* Mis ultrasonidos */}
        <div className="flex flex-col w-full h-full items-center justify-between border rounded-lg p-4 gap-16">
          <h2 className="font-bold text-xl text-center">{title}</h2>
          {children}
        </div>
        {/*  */}
      </div>
    </main>
  );
};

export default Layout;
