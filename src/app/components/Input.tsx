'use client';

import React, { useState } from 'react';

interface InputProps {
  placeholder: string;
  onInputChange: (input: string) => void;
  error?: boolean;
  isClicked: boolean;
  setIsClicked: (clicked: boolean) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, onInputChange, error, isClicked, setIsClicked }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onInputChange(event.target.value);
  };

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onClick={handleClick}
      className={`w-full font-medium border-2 rounded-md p-2 ${
        error && !isClicked ? 'border-red-500' : 'border-gray-400'
      } placeholder:text-gray-400`}
    />
  );
};

export default Input;
