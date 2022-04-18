import { buildServersideClient } from 'api/build-client';
import { useAppContext } from 'context/state';
import TicketList from 'components/TicketList';

function LandingPage({ currentUser, tickets }) {
  // const { user } = useAppContext();

  return (
    <div className="container p-4">
      <h1>{currentUser ? 'You are signed in' : 'You are not signed in yet'}</h1>
      <TicketList tickets={tickets} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data: user } = await client.get('/api/users/currentuser');
  const { data: tickets } = await client.get('/api/tickets');

  return { props: { currentUser: user.currentUser, tickets } };
}

export default LandingPage;
