import { useState } from 'react';
import useRequest from 'hooks/use-request';

export default function CreateTicket() {
  const initialFormState = { title: '', price: '' };
  const [formValues, setFormValues] = useState({ ...initialFormState });

  const { doRequest, errors, success, reset } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title: formValues.title, price: Number(formValues.price) },
    onSuccess: () => {
      setFormValues({ ...initialFormState });
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  const handleInput = ({ target: { name, value } }) => {
    if (errors || success) {
      reset();
    }
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="container p-4">
      <h1>Create Ticket</h1>
      <div className="row">
        <div className="col-sm-12 col-lg-6">
          <form onSubmit={onSubmit} className="m-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="input-title">
                Title
              </label>
              <input
                id="input-title"
                className="form-control"
                value={formValues.title}
                name="title"
                onChange={handleInput}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="input-price">
                Price
              </label>
              <input
                id="input-price"
                type="number"
                name="price"
                className="form-control"
                value={formValues.price}
                onChange={handleInput}
              />
            </div>
            {errors}
            {success}
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
