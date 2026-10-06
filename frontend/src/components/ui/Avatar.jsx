import React from 'react';

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base font-semibold',
  xl: 'w-16 h-16 text-xl font-bold',
};

export const Avatar = ({ name = 'User', src, size = 'md', className = '' }) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-slate-200 dark:border-slate-800 ${
          sizeMap[size] || sizeMap.md
        } ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-medium shadow-sm shrink-0 select-none ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
