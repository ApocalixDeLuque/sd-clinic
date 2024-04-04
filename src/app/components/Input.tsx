'use client';

import React, { useState } from 'react';

interface InputProps {
  placeholder: string;
  onInputChange: (input: string) => void;
  error?: boolean;
  isClicked?: boolean; // Añade esta línea
  setIsClicked?: (clicked: boolean) => void; // Añade esta línea
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
}

const Input: React.FC<InputProps> = ({ type, placeholder, onInputChange, error, isClicked, setIsClicked }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onInputChange(event.target.value);
  };

  const handleClick = () => {
    if (setIsClicked) {
      setIsClicked(true);
    } else {
      console.error('setIsClicked is undefined');
    }
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onClick={handleClick}
      className={`w-full font-medium border-2 rounded-md p-2 lg:p-4 ${
        error && !isClicked ? 'border-red-500' : 'border-gray-400'
      } placeholder:text-gray-400 lg:text-xl`}
    />
  );
};

export default Input;
