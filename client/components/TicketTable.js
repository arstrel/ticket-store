import Link from 'next/link';

export default function TicketTable({ tickets }) {
  if (!tickets?.length) {
    return <div className="my-3">No tickets to display ...</div>;
  }

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Link</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
              <Link href={`/tickets/${ticket.id}`} passHref>
                <a>View</a>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
