import Link from 'next/link';
import styles from 'styles/orders.module.scss';
import clsx from 'clsx';

export default function OrderTable({ orders }) {
  if (!orders?.length) {
    return <div className="my-3">No orders yet ...</div>;
  }

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Status</th>
          <th scope="col">Link</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const statusClasses = clsx(styles.status, {
            [styles.complete]: order.status === 'complete',
            [styles.cancel]: order.status === 'cancelled',
          });
          return (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>${order.ticket.price}</td>
              <td className={statusClasses}>{order.status}</td>
              <td>
                <Link href={`/orders/details/${order.id}`} passHref>
                  <a>Details</a>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
