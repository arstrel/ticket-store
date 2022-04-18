import { useRouter } from 'next/router';

export default function SingleTicket() {
  const router = useRouter();

  const { ticketId } = router.query;

  return (
    <div className="container p-4">
      <h1>Single Ticket</h1>
      <p>id: {ticketId}</p>
    </div>
  );
}
