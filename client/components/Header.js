import Link from 'next/link';
import Image from 'next/image';
import logoPic from 'content/images/logo.svg';
import styles from 'styles/header.module.css';
import { useAppContext } from 'context/state';
import { useEffect } from 'react';

export default function Header({ currentUser }) {
  const { user, setUser } = useAppContext();

  useEffect(() => {
    if (!user && currentUser) {
      setUser(currentUser);
    }
  }, [user, currentUser]);

  return (
    <div className={`d-flex justify-content-between p-3 ${styles.header}`}>
      <Link href="/">
        <div
          className={`d-flex justiry-content-between align-items-center ${styles.logo}`}
        >
          <Image src={logoPic} width={100} height={100} alt="logo" />
          <div>
            <h3>GitTix store</h3>
          </div>
        </div>
      </Link>
      {user ? (
        <div className="d-flex align-items-center">
          <Link href="/orders">
            <a className="mx-3">My Orders</a>
          </Link>
          <Link href="/tickets/new">
            <a className="mx-3">New Ticket</a>
          </Link>
          <Link href="/auth/signout">
            <a className="mx-3">Sign out</a>
          </Link>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <Link href="/auth/signup">
            <a className="mx-3">Sign up</a>
          </Link>
          <Link href="/auth/signin">
            <a className="mx-3">Sign in</a>
          </Link>
        </div>
      )}
    </div>
  );
}
