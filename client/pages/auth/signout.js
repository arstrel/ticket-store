import useRequest from 'hooks/use-request';
import { useEffect } from 'react';
import Router from 'next/router';
import { useAppContext } from 'context/state';

export default function Signout() {
  const { setUser } = useAppContext();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      setUser(null);
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div className="container">Signing you out...</div>;
}
