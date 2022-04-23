# ticket-store

Ticket store using Typescript and microservices architecture.

HTTPS certificate is not set so the project is available via http [here](http://www.useticketing.store/)
![deploy manifest](https://github.com/github/docs/actions/workflows/deploy-manifest.yml/badge.svg)
![deploy auth](https://github.com/github/docs/actions/workflows/deploy-auth.yml/badge.svg)
![deploy client](https://github.com/github/docs/actions/workflows/deploy-client.yml/badge.svg)
![deploy expiration](https://github.com/github/docs/actions/workflows/deploy-expiration.yml/badge.svg)
![deploy orders](https://github.com/github/docs/actions/workflows/deploy-orders.yml/badge.svg)
![deploy payments](https://github.com/github/docs/actions/workflows/deploy-payments.yml/badge.svg)
![deploy tickets](https://github.com/github/docs/actions/workflows/deploy-tickets.yml/badge.svg)

![test auth](https://github.com/github/docs/actions/workflows/test-auth.yml/badge.svg)
![test orders](https://github.com/github/docs/actions/workflows/test-orders.yml/badge.svg)
![test payments](https://github.com/github/docs/actions/workflows/test-payments.yml/badge.svg)
![test tickets](https://github.com/github/docs/actions/workflows/test-tickets.yml/badge.svg)

## Deployment

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=c772a2948f16&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

The project is deployed in a kubernetes cluster hosted in [Digital Ocean](https://www.digitalocean.com/products/kubernetes) and available for testing at [www.useticketing.store](http://www.useticketing.store/)

The project relies on GitHub actions for CI/CD.
Three GH Actions secrets are needed for it work DOCKER_USERNAME, DOCKER_PASSWORD, DIGITALOCEAN_ACCESS_TOKEN

On pull request the tests will run automatically for tickets, orders, auth and payments depending on if there were any changes made to these folders.
On merge or push to `main` branch, `deploy-<service>` workflows will be triggered.
Deploy workflows build updated docker image, push it to docker hub and run rollout restart of kubernetes deployment.

There are several steps to seting up this kubernetes cluster:

1. Go to Digital Ocean and create a cluster with 3-4 smallest nodes (1Gb memory and 1vCPU)
2. Follow Digital Ocean steps, install `doctl` and add kubctl context
3. Create two k8s cluster secrets for jwt token and stripe key
   `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your-secret-word`
   `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_LOtSuQS8KJV2ZPMXcz`
4. Create an ingress nginx load balancer by running a command from [the docs](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)
   `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.2.0/deploy/static/provider/do/deploy.yaml`
5. Run `kubectl apply -f infra/k8s && kubectl apply -f infra/k8s-prod` to create all the needed k8s resources

## Services

1. Client: React app
2. Auth: Node express server backed by MongoDB
3. Ticket: Node express server backed by MongoDB
4. Order: Node express server backed by MongoDB
5. Expiration: Persistent timer service backed by Redis
6. Payment service with Stripe

The project uses an npm package that contains shared code and type definitions that can be found [here](https://www.npmjs.com/package/@sbsoftworks/gittix-common)

## Other Technologies used:

1. [NATS Streaming server](https://docs.nats.io/)
2. Kubernetes with [Ingress-nginx load balancer](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)
3. [MongoDB with Mongoose](https://mongoosejs.com/docs/index.html), one for each of the backend services
4. [Redis](https://redis.io/) for expiration service made with [bull js](https://www.npmjs.com/package/bull) queue for Node

Common code and type definitions are separated into npm library that can be seen [here](https://github.com/arstrel/sbsoftworks-gittix-common)

## How to start the project on local

Each service connects to a separate database and runs in a separate container. All the containers are orchestrated by kubernetes.
Skaffold is used to run all the parts on local and enable rebuild/restart on code changes.
Run `skaffold dev` to start all services on local

If unsafe error in browser. type:

`thisisunsafe`
It happens because chrome detects that load balancer proxies the https request and does not trust it.

## Testing

Each backend service has tests that can be run with `npm run test`.
Tests are using InMemory Mongo database and do not issue requests to a real DB

## Events published by each service

1. Ticket service: tickets
2. Orders service: orders, tickets
3. Payments service: charges, orders
4. Expiration service: expiration

## 3. Notes about Tickets service

Emits events about Tickets.

```
ticket:created
ticket:updated
```

Listens to following events

```
order:created
order:cancelled
```

This service increments `Ticket` version number for the purposes of concurrency control.
Presense of `orderId` on a `Ticket` indicates that the Ticket is locked, because someone is trying to purchase it. onOrderCancelled `Ticket.orderId` is set back to undefined to unlock the Ticket.

## 4. Notes about Orders service

Data replication and consistent ids: Orders service is storing only a partial information about a Ticket. In Orders service, upon creating a new Ticket, the id provided by Ticket service is being used. That way same Tickets have same ids across two services.
This service increments `Order` version number for the purposes of concurrency control.

## 5. Notes about Payments service

Listens to

```
order:created
order:cancelled
```

Emits

```
payment:created
```

This service maintains Payments and Orders data collections with Payments being a records of successful stripe charges in relationship to orderIds
and Orders being a replicared orders data.

Always working [test credit cards](https://stripe.com/docs/testing)
example: 4242424242424242 with any 3 digits as code and any future date as expiration date

## Optimistic concurrency control

Upon updating the entity (ticket or order), main service, responsible for managing such entity, increments the `version` property. All the rest of the services, upon receiving an event will check the version of the replicated entity in their own database. These services will only process the event if it is in order, meaning if it has a version of the entity of `-1` compared to the one in it's own database.
This enables us to only process events in order of how they were issued.
This is achieved by the plugin to mongoose schema that comes from `mongoose-update-if-current` package and changes to `onMessage` method implemented on event listeners. TicketUpdatedListener for example.

## Why do we need "mongoose-update-if-current"

This handy mongoose plugin does two things exactly:

1. Updates the version number on records before they are saved. Increments version number by 1 every time
2. Customizes the find-and-update operation (save) to look for the correct version. Instead of "find the record with this id" it becomes "find the record with this id and this version"

## Data replication and consistent ids

Tickets records are replicated between Ticket service and Orders service using NATS Streaming Server to publish and listen to events.
Ticket service is responsible for creating a tickets and updating versions as needed.

## Automatic testing flow with GitHub actions

All the tests will run in parallel for each service on create/update of a pull request

## TODO

- Add Swagger docs and ui
- Add a link to "My orders" to be able to go back to started order `/orders/:id` for orders in a "created" state
