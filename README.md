# ticket-store

Ticket store made with microservices and typescript

## Services

1. Client: React app
2. Auth: Node express server
3. Ticket: Node express server
4. Order: Node express server

## 3. Ticket service

Presense of `orderId` on a Ticket indicates that the Ticket is locked because someone is trying to purchase it

## Technologies used:

1. NATS Streaming server
2. Kubernetes with Ingress-nginx load balancer
3. MongoDB with Mongoose, one for each of the backend services

Common code and type definitions are separated into npm library that can be seen [here](https://github.com/arstrel/sbsoftworks-gittix-common)

## How to start the project on local

Each service connects to a separate database and runs in a separate container. All the containers are orchestrated by kubernetes.
Skaffold is used to run all the parts on local and enable rebuild/restart on code changes.
Run `skaffold dev` to start the app on local

## Optimistic concurrence control

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
Orders service is storing only a partial information about a Ticket. Tickets has the same id in both places. In Orders service, upon creating a new Ticket, we use the id provided by Ticket service
