import Router, { useRouter } from 'next/router';
import { buildServersideClient } from 'api/build-client';
import useRequest from 'hooks/use-request';

export default function SingleTicket({ ticket, currentUser }) {
  const router = useRouter();
  const { ticketId } = router.query;

  const { doRequest: purchaseRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      Router.push(`/orders/${order.id}`);
    },
  });

  return (
    <div className="container p-4">
      <h1>Single Ticket</h1>
      <p>id: {ticketId}</p>
      <p>Title: {ticket.title}</p>
      <h4>Price: {ticket.price}</h4>
      <p>isOwner?: {currentUser?.id === ticket.userId ? 'Yes' : 'No'}</p>
      <div>{errors}</div>
      <button className="btn btn-primary" onClick={purchaseRequest}>
        Purchase
      </button>
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
