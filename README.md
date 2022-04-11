# ticket-store

Ticket store made with microservices and typescript

## Services

1. Client: React app
2. Auth: Node express server
3. Ticket: Node express server
4. Order: Node express server

## Technologies used:

1. NATS Streaming server
2. Kubernetes with Ingress-nginx load balancer
3. MongoDB with Mongoose, one for each of the backend services

Common code and type definitions are separated into npm library that can be seen [here](https://github.com/arstrel/sbsoftworks-gittix-common)

## How to start the project on local

Each service connects to a separate database and runs in a separate container. All the containers are orchestrated by kubernetes.
Skaffold is used to run all the parts on local and enable rebuild/restart on code changes.
Run `skaffold dev` to start the app on local
