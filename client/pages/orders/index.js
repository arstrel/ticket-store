import { buildServersideClient } from 'api/build-client';
import OrderTable from 'components/OrderTable';

export default function OrdersList({ orders }) {
  return (
    <div className="container p-4">
      <h4>Order index</h4>
      <OrderTable orders={orders} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data: orders } = await client.get('/api/orders');

  return { props: { orders } };
}
