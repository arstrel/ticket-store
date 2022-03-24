import { buildServersideClient } from 'api/build-client';
import { useAppContext } from 'context/state';

function LandingPage() {
  const { user } = useAppContext();
  return <h1>{user ? 'You are signed in' : 'You are not signed in yet'}</h1>;
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return { props: data };
}

export default LandingPage;
