import { AUTH_FORM_TYPE } from 'appConstants';
import SignForm from 'components/SignForm';

export default function Signin() {
  return (
    <div className="container">
      <h1>Signin</h1>
      <SignForm type={AUTH_FORM_TYPE.signin} />
    </div>
  );
}
