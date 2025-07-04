import React from 'react';
import { useAuthStore } from '../../store/useAuthStore.js'
  

const ProfileIcon = ({ size = 10, showName = false }) => {
  const user = useAuthStore(state => state.user);

  const userName =
    typeof user === 'string'
      ? user
      : user?.username || user?.name || 'User';

  const initial = userName.charAt(0).toUpperCase();

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-green-500', 'bg-teal-500', 'bg-blue-500',
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ];
  const colorIndex = userName.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${bgColor} rounded-full flex items-center justify-center text-white font-bold cursor-pointer `}
        style={{
          width: `${size * 0.20}rem`,
          height: `${size * 0.20}rem`,
          fontSize: `${size * 0.100}rem`,
        }}
        title={userName}
      >
        {initial}
      </div>
      {showName && (
        <span className={`font-medium text-blue-500`}>{userName}</span>
      )}
    </div>
  );
};


export default ProfileIcon;



