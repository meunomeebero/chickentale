import Link from 'next/link';
import styles from '../styles/header.module.css';
import { Login, type HandleLoginReturn, SessionStorage } from '@/components/login';
import { Users } from '@prisma/client';
import UserAvatarMenu from './UserAvatarMenu';

interface HeaderProps {
  handleLogin?: (data: HandleLoginReturn) => void;
  user?: Users;
}

export default function Header({ handleLogin, user }: HeaderProps) {
  const handleSignOut = () => {
    if (handleLogin) {
      // Call handleLogin with null values to clear the session
      handleLogin({ user: null as any, token: '' });
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li><Link href="/game">Game</Link></li>
          <li><Link href="/ranking">Ranking</Link></li>
          <li><Link href="/info">Info</Link></li>
          <li><Link target="_blank" href="https://bero.land">Bero</Link></li>
        </ul>
      </nav>
      {handleLogin && (
        <div className={styles.loginContainer}>
          {user ? (
            <UserAvatarMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Login handleLogin={handleLogin} user={user} />
          )}
        </div>
      )}
    </header>
  );
}
