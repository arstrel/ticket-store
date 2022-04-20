import { buildServersideClient } from 'api/build-client';
import Link from 'next/link';
import clsx from 'clsx';
import styles from 'styles/orders.module.scss';

export default function OrderDetails({ order }) {
  const statusClasses = clsx(styles.status, {
    [styles.complete]: order.status === 'complete',
    [styles.cancel]: order.status === 'cancelled',
  });

  return (
    <div className="container p-4">
      <div className="card">
        <h5 className={`card-header ${statusClasses}`}>{order.status}</h5>
        <div className="card-body">
          <h5 className="card-title">{order.ticket.title}</h5>
          <p className="card-text">Price: ${order.ticket.price}</p>
          <p className="card-text">OrderId: ${order.id}</p>
          <p className="card-text">TicketId: ${order.ticket.id}</p>
          <Link href="/orders" passHref>
            <a className="btn btn-primary">Back</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);

  const { data: order } = await client.get(
    `/api/orders/${context.params.orderId}`
  );

  return {
    props: {
      order,
    },
  };
}
