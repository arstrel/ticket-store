import axios from 'axios';

export function buildServersideClient({ req }) {
  // http://SERVICENAME.NAMESPACE.svc.cluster.local
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  });
}
