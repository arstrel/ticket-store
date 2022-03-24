import { buildServersideClient } from 'api/build-client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAppContext } from 'context/state';
import Image from 'next/image';
import logoPic from 'content/images/logo.svg';
import styles from 'styles/header.module.css';

export default function Header({ currentUser }) {
  const { user, setUser } = useAppContext();

  const handleSignout = async () => {
    await axios.post('/api/users/signout');
    setUser(null);
  };

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  return (
    <div className={`d-flex justify-content-between p-3 ${styles.header}`}>
      <Link href="/">
        <div
          className={`d-flex justiry-content-between align-items-center ${styles.logo}`}
        >
          <Image src={logoPic} width={100} height={100} />
          <div>
            <h3>GitTix store</h3>
          </div>
        </div>
      </Link>
      {user ? (
        <a
          onClick={handleSignout}
          href="#"
          className="mx-3 d-flex align-items-center"
        >
          Sign out
        </a>
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

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return { props: data };
}
