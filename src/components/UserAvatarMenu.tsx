import { useState, useRef, useEffect } from 'react';
import { Users } from '@prisma/client';
import Link from 'next/link';
import styles from '../styles/header.module.css';
import { SessionStorage } from './login';
import UserAvatar from './UserAvatar';

interface UserAvatarMenuProps {
  user: Users;
  onSignOut: () => void;
}

export default function UserAvatarMenu({ user, onSignOut }: UserAvatarMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(SessionStorage.USER);
    sessionStorage.removeItem(SessionStorage.TOKEN);
    onSignOut();
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.userAvatarContainer} ref={menuRef}>
      <UserAvatar user={user} onClick={toggleMenu} />

      {isMenuOpen && (
        <div className={styles.avatarMenu}>
          <div className={styles.avatarMenuHeader}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <div className={styles.avatarMenuItems}>
            <Link href="/privacy" className={styles.avatarMenuItem} onClick={() => setIsMenuOpen(false)}>
                Política de Privacidade
            </Link>
            <Link href="/terms" className={styles.avatarMenuItem} onClick={() => setIsMenuOpen(false)}>
              Termos de Uso
            </Link>
            <button className={styles.signOutButton} onClick={handleSignOut}>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
