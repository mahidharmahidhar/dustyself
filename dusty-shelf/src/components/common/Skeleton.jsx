import React from 'react';

export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div
      className={`${width} ${height} bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`}
    />
  );
};
