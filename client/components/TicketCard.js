import styles from '../styles/ticket.module.scss';
import Image from 'next/image';
import cardDefaultPic from '../content/images/sale.jpg';
import Link from 'next/link';

export default function TicketCard({ ticket }) {
  return (
    <div className={`card ${styles.ticketCard}`}>
      <div className={`card-header ${styles.ticketCardHeader}`}>Ticket</div>
      <Image src={cardDefaultPic} className="card-img-top" alt="sale" />
      <div className="card-body d-flex flex-column w-100">
        <div>
          <h5 className="card-title">{ticket.title}</h5>
          <p className="card-text">Price: ${ticket.price}</p>
        </div>
        <div className="my-3 align-self-end">
          <Link href={`/tickets/${ticket.id}`} passHref>
            <a className="btn btn-primary">Details</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
