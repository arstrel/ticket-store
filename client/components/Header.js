import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import logoPic from 'content/images/logo.svg';
import styles from 'styles/header.module.css';
import Router from 'next/router';
import { useAppContext } from 'context/state';
import { useEffect } from 'react';

export default function Header({ currentUser }) {
  const { setUser } = useAppContext();

  const handleSignout = async () => {
    await axios.post('/api/users/signout');
    setUser(null);
    Router.push('/');
  };

  useEffect(() => {
    setUser(currentUser);
  }, []);

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
      {currentUser ? (
        <div className="d-flex align-items-center">
          <Link href="/tickets/new">
            <a className="mx-3">New Ticket</a>
          </Link>
          <a
            onClick={handleSignout}
            href="#"
            className="mx-3 d-flex align-items-center"
          >
            Sign out
          </a>
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
