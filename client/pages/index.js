import { buildServersideClient } from 'api/build-client';
import { useAppContext } from 'context/state';
import useRequest from 'hooks/use-request';
import { useEffect } from 'react';

function LandingPage() {
  const { user } = useAppContext();
  const { doRequest } = useRequest({
    url: '/api/users/currentuser',
    method: 'get',
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="container p-4">
      <h1>{user ? 'You are signed in' : 'You are not signed in yet'}</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return { props: data };
}

export default LandingPage;
