import React from 'react';
import styles from '../styles/header.module.css';
import { Users } from '@prisma/client';

interface UserAvatarProps {
  user: Users;
  onClick?: () => void;
}

export default function UserAvatar({ user, onClick }: UserAvatarProps) {
  // Get user initials from their name
  const getInitials = (name: string): string => {
    if (!name) return '?';

    // Split the name by spaces and get the first character of each part
    const parts = name.split(' ');

    if (parts.length === 1) {
      // If only one part, return the first character
      return parts[0].charAt(0).toUpperCase();
    } else {
      // If multiple parts, return first character of first and last parts
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
  };

  return (
    <div
      className={styles.userAvatar}
      onClick={onClick}
    >
      {user.image ? (
        <img src={user.image} alt={user.name} />
      ) : (
        <div className={styles.userInitials}>
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}
