import { useState } from 'react';
import useRequest from 'hooks/use-request';
import Router from 'next/router';

export default function Signup() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email: formValues.email, password: formValues.password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  const handleInput = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="m-4">
      <h1>Sign Up</h1>
      <div className="mb-3">
        <label className="form-label" htmlFor="input-email">
          Email Address
        </label>
        <input
          id="input-email"
          className="form-control"
          value={formValues.email}
          name="email"
          onChange={handleInput}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="input-password">
          Password
        </label>
        <input
          id="input-password"
          type="password"
          name="password"
          className="form-control"
          value={formValues.password}
          onChange={handleInput}
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Sign up
      </button>
    </form>
  );
}
