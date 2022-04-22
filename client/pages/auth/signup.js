import SignForm from 'components/SignForm';
import { AUTH_FORM_TYPE } from 'appConstants';

export default function Signup() {
  return (
    <div className="container">
      <SignForm type={AUTH_FORM_TYPE.signup} />
    </div>
  );
}
