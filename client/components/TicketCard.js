import styles from 'styles/ticket.module.scss';

export default function TicketCard({ ticket }) {
  return (
    <div
      className={`d-flex flex-column justiry-content-between align-items-center p-3 ${styles.ticketCard}`}
    >
      <div>
        <p>{ticket.title}</p>
      </div>
      <div>
        <p>Price: ${ticket.price}</p>
      </div>
    </div>
  );
}
