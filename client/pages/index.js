import axios from 'axios';

function LandingPage({ currentUser }) {
  return <h1>Landing page: {currentUser.email}</h1>;
}

export async function getServerSideProps({ req }) {
  try {
    // http://SERVICENAME.NAMESPACE.svc.cluster.local
    const currentUser = await axios
      .get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        {
          headers: {
            Host: req.headers.host, // 'ticketing.dev',
            cookie: req.headers.cookie,
          },
        }
      )
      .then((res) => res.data);

    return { props: currentUser };
  } catch (err) {
    console.log(err);
    return { props: { email: 'Not good' } };
  }
}

export default LandingPage;
