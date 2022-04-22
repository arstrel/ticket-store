import AuthForm from 'components/AuthForm';
// import { AUTH_FORM_TYPE } from 'appConstants';

const AUTH_FORM_TYPE = {
  signup: {
    url: '/api/users/signup',
    title: 'Sign Up',
    actionLabel: 'Sign Up',
  },
  signin: {
    url: '/api/users/signin',
    title: 'Sign In',
    actionLabel: 'Sign In',
  },
};

export default function Signin() {
  return (
    <div className="container">
      <h1>Signin</h1>
      <AuthForm type={AUTH_FORM_TYPE.signin} />
    </div>
  );
}
