import { useRouter } from 'next/router';
import { buildServersideClient } from 'api/build-client';
import useRequest from 'hooks/use-request';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default function SingleOrder({ order, currentUser, stripePublicKey }) {
  const router = useRouter();
  const { orderId } = router.query;
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors, success } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => {
      router.push('/orders');
    },
  });

  const purchaseRequest = (token) => {
    doRequest({ props: { token: token.id } });
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      const secondsLeft = (new Date(order.expiresAt) - new Date()) / 1000;
      setTimeLeft(Math.round(secondsLeft));
    };

    updateTimeLeft();

    const timerId = setInterval(() => {
      updateTimeLeft();
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div className="container p-4">
        <p>Order expired</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h1>Single Ticket</h1>
      <p>id: {orderId}</p>
      <p>status: {order.status}</p>
      <h4>Time left to pay: {timeLeft} seconds</h4>
      <StripeCheckout
        token={purchaseRequest}
        stripeKey={stripePublicKey}
        email={currentUser.email}
        amount={order.ticket.price * 100}
      />
      <div className="my-3">
        {errors}
        {success}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);

  const { data: user } = await client.get('/api/users/currentuser');
  const { data: order } = await client.get(
    `/api/orders/${context.params.orderId}`
  );

  return {
    props: {
      order,
      currentUser: user.currentUser,
      // eslint-disable-next-line no-undef
      stripePublicKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  };
}
