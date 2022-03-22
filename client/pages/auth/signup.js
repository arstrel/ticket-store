import { useState } from 'react';

export default function Signup() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });

  const onSubmit = (e) => {
    e.preventDefault();

    console.log(formValues);
  };

  const handleInput = ({ target: { name, value } }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
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
      <button type="submit" className="btn btn-primary">
        Sign up
      </button>
    </form>
  );
}
