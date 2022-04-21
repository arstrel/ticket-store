import { buildServersideClient } from 'api/build-client';
import TicketList from 'components/TicketList';
import { useState } from 'react';
import TicketTable from 'components/TicketTable';

function LandingPage({ tickets }) {
  const [tableMode, setTableMode] = useState(false);

  const handleToggle = (e) => {
    setTableMode(e.target.checked);
  };

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Available Tickets</h2>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            onChange={handleToggle}
            checked={tableMode}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            View in Table mode
          </label>
        </div>
      </div>
      {tableMode ? (
        <TicketTable tickets={tickets} />
      ) : (
        <TicketList tickets={tickets} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = buildServersideClient(context);
  const { data: user } = await client.get('/api/users/currentuser');
  const { data: tickets } = await client.get('/api/tickets');

  return { props: { currentUser: user.currentUser, tickets } };
}

export default LandingPage;
