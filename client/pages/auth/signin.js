import AuthForm from '../../components/AuthForm';
import { AUTH_FORM_TYPE } from '../../appConstants';

export default function Signin() {
  return (
    <div className="container">
      <AuthForm type={AUTH_FORM_TYPE.signin} />
    </div>
  );
}
