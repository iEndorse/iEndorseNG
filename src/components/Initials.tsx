import React from 'react';

interface InitialsProps {
  fullName: string;
  className?: string; // Optional prop for styling
}

const Initials: React.FC<InitialsProps> = ({ fullName, className }) => {
  const getInitials = (name: string) => {
    if (name) {
      const names = name.trim().split(' ');
      const initials =
        (names[0] ? names[0][0] : '') + (names.length > 1 ? names[names.length - 1][0] : '');
      return initials.toUpperCase();
    }
    return ''; // Return empty string if name is falsy
  };

  return <span className={className}>{getInitials(fullName)}</span>;
};

export default Initials;
