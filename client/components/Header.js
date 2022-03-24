import { buildServersideClient } from 'api/build-client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAppContext } from 'context/state';

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
    <div className="d-flex justify-content-between p-3">
      <div>
        <Link href="/">Ticketing</Link>
      </div>
      {user ? (
        <a onClick={handleSignout} href="#" className="mx-3">
          Sign out
        </a>
      ) : (
        <div className="d-flex">
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
