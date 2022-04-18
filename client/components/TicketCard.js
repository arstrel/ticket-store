import styles from 'styles/ticket.module.scss';
import Image from 'next/image';
import cardDefaultPic from 'content/images/sale.jpg';

export default function TicketCard({ ticket }) {
  return (
    <div className={`card ${styles.ticketCard}`}>
      <div className={`card-header ${styles.ticketCardHeader}`}>Ticket</div>
      <Image src={cardDefaultPic} className="card-img-top" alt="sale" />
      <div className="card-body">
        <h5 className="card-title">{ticket.title}</h5>
        <p className="card-text">Price: ${ticket.price}</p>
        <a href="#" className="btn btn-primary">
          Details
        </a>
      </div>
    </div>
  );
}
