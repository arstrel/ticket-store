import axios from 'axios';

export function buildServersideClient({ req }) {
  console.log({
    // eslint-disable-next-line no-undef
    baseURL: process?.env?.BASE_URL || 'http://www.useticketing.store/',
    hostHeader: req.headers.host,
  });
  // http://SERVICENAME.NAMESPACE.svc.cluster.local
  return axios.create({
    // eslint-disable-next-line no-undef
    baseURL: process?.env?.BASE_URL || 'http://www.useticketing.store/',
    headers: req.headers,
  });
}
