import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  text: string;
  color?: 'pink' | 'blue';
  link?: string;
  onClick?: () => void;
  selected?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, color = 'pink', link, onClick, selected }) => {
  const ButtonContent = () => (
    <button
      className={`w-full text-center font-semibold ${
        color === 'pink'
          ? selected
            ? 'bg-pink-400 border-pink-400 text-white'
            : 'selected:bg-pink-400 border-pink-400 text-pink-400'
          : selected
          ? 'bg-blue-400 border-blue-400 text-white'
          : 'selected:bg-blue-400 border-blue-400 text-blue-400'
      } border-2 rounded-lg py-1`}
      onClick={onClick}
    >
      {text}
    </button>
  );

  return link ? (
    <Link href={link}>
      <ButtonContent />
    </Link>
  ) : (
    <ButtonContent />
  );
};

export default Button;
