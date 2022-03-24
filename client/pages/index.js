import { buildServersideClient } from 'api/build-client';

function LandingPage({ currentUser }) {
  return (
    <h1>{currentUser ? 'You are signed in' : 'You are not signed in yet'}</h1>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data: currentUser } = await client.get('/api/users/currentuser');

  return { props: currentUser };
}

export default LandingPage;
