import axios from 'axios';
import { useState } from 'react';
import styles from 'styles/common.module.scss';

export default function useRequest({
  url,
  method,
  body,
  onSuccess = () => {},
}) {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body).then((res) => res.data);
      onSuccess(response);
      setSuccess(
        <div className="alert alert-success">
          <h4>Success!</h4>
          <ul className={`my-0 ${styles.successList}`}>
            <li className={styles.successItem}>Action comlete</li>
          </ul>
        </div>
      );
      return response;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((singleError) => (
              <li key={singleError.message}>{singleError.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const reset = () => {
    setErrors(null);
    setSuccess(null);
  };

  return { doRequest, reset, errors, success };
}
