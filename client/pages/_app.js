import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header';
import { AppWrapper } from '../context/state';

export default function AppComponent({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Header {...pageProps} />
      <Component {...pageProps} />
    </AppWrapper>
  );
}
