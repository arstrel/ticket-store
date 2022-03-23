import axios from 'axios';
import { useState } from 'react';

export default function useRequest({
  url,
  method,
  body,
  onSuccess = () => {},
}) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body).then((res) => res.data);
      onSuccess(response);
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

  return { doRequest, errors };
}
