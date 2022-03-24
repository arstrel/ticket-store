import AuthForm from 'components/authForm';
import { AUTH_FORM_TYPE } from 'appConstants';

export default function Signup() {
  return (
    <div className="container">
      <AuthForm type={AUTH_FORM_TYPE.signup} />
    </div>
  );
}
