import React from 'react';

const ProgressLoader: React.FC = () => {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 w-40 h-2.5 bg-[rgba(236,236,238,0.253)] rounded-lg overflow-hidden">
      {/* Adjust width here for 60% */}
      <div className="w-3/5 h-2.5 bg-white rounded-lg"></div>
    </div>
  );
};

export default ProgressLoader;
