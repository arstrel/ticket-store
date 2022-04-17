# ticket-store

Ticket store using Typescript and microservices architecture.

## Services

1. Client: React app
2. Auth: Node express server backed by MongoDB
3. Ticket: Node express server backed by MongoDB
4. Order: Node express server backed by MongoDB
5. Expiration: Persistent timer service backed by Redis
6. Payment service with Stripe

## Other Technologies used:

1. NATS Streaming server
2. Kubernetes with Ingress-nginx load balancer
3. MongoDB with Mongoose, one for each of the backend services

Common code and type definitions are separated into npm library that can be seen [here](https://github.com/arstrel/sbsoftworks-gittix-common)

## How to start the project on local

Each service connects to a separate database and runs in a separate container. All the containers are orchestrated by kubernetes.
Skaffold is used to run all the parts on local and enable rebuild/restart on code changes.
Run `skaffold dev` to start all services on local

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
charge:created
```

This service maintains Charges data and replicates the data from Orders events.
This service increments `Charge` version number for the purposes of concurrency control.

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

## TODO

- Add Swagger docs and ui
