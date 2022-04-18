import TicketCard from './TicketCard';
import styles from 'styles/ticket.module.scss';

export default function TicketList({ tickets }) {
  if (!tickets?.length) {
    return <div className="my-3">No tickets to display ...</div>;
  }

  return (
    <div className={`my-3 ${styles.ticketSection}`}>
      {tickets?.map((ticket) => (
        <TicketCard ticket={ticket} key={ticket.id} />
      ))}
    </div>
  );
}
