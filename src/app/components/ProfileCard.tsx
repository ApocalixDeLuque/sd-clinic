import React from 'react';
import SectionsMenu from './SectionsMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const ProfileCard = () => {
  return (
    <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
      <div className="flex gap-2">
        <img src="/images/pfp.png" alt="logo" />
        <div className="flex flex-col gap-2">
          <p className="font-bold">Maria Fernanda Ramirez Gonzalez</p>
          <div>
            <p className="font-bold">Último ingreso:</p>
            <p>15/mar/2024 3:01:34 PM</p>
          </div>
        </div>
        <FontAwesomeIcon icon={faGear} className="aspect-square w-8 self-start" />
      </div>
      <SectionsMenu />
    </div>
  );
};

export default ProfileCard;
