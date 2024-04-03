'use client';
import { DOM } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  text: string;
  color?: 'pink' | 'blue' | 'green';
  link?: string;
  onClick?: () => void;
  selected?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, color = 'pink', link, onClick, selected }) => {
  const ButtonContent = () => (
    <button
      className={`w-full text-center font-medium ${
        color === 'pink'
          ? selected
            ? 'bg-pink-400 border-pink-400 text-white'
            : 'border-pink-400 text-pink-400'
          : color === 'blue'
          ? selected
            ? 'bg-blue-400 border-blue-400 text-white'
            : 'border-blue-400 text-blue-400'
          : color === 'green'
          ? selected
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-green-600 text-green-600'
          : ''
      } border-2 rounded-lg py-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );

  return link ? (
    <Link href={link} className="w-full">
      <ButtonContent />
    </Link>
  ) : (
    <ButtonContent />
  );
};

export default Button;
