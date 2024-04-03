import React from 'react';

export const SelectedButtonContext = React.createContext({
  selectedButton: 'Mis Ultrasonidos',
  setSelectedButton: (value: string) => {},
});
