'use client';
import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  text: string;
  color?: 'pink' | 'blue' | 'green';
  link?: string;
  onClick?: () => void;
  selected?: boolean;
  submit?: boolean;
}

const Button: React.FC<ButtonProps> = ({ submit, text, color = 'green', link, onClick, selected }) => {
  const ButtonContent = () => (
    <button
      type={submit ? 'submit' : 'button'}
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
            ? 'bg-verde-salud border-verde-salud text-white'
            : 'border-verde-salud text-verde-salud'
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
