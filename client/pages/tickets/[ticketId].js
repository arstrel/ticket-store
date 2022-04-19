import { useRouter } from 'next/router';
import { buildServersideClient } from 'api/build-client';
import { useAppContext } from 'context/state';

export default function SingleTicket({ ticket, currentUser }) {
  const { user } = useAppContext();
  const router = useRouter();

  const { ticketId } = router.query;
  console.log(user);
  return (
    <div className="container p-4">
      <h1>Single Ticket</h1>
      <p>id: {ticketId}</p>
      <p>Title: {ticket.title}</p>
      <p>Price: {ticket.price}</p>
      <p>isOwner?: {currentUser.id === ticket.userId ? 'Yes' : 'No'}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);

  const { data: user } = await client.get('/api/users/currentuser');
  const { data: ticket } = await client.get(
    `/api/tickets/${context.params.ticketId}`
  );

  return { props: { ticket, currentUser: user.currentUser } };
}
