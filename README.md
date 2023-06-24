# E-Commerce web app (Microservices): Ticketing application

<!-- TABLE OF CONTENTS -->
## Table of Contents
* [About the App](#about-the-app)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Run the app](#run-the-app)
* [Architecture](#architecture)
  * [Services](#services)
  * [Event-driven](#event-driven)
* [Tech Stacks](#architecture)
  * [Frontend](#services)
  * [Backend](#event-driven)
  * [Database](#architecture)
  * [Build And Deploy](#build-and-deploy)

<!-- ABOUT THE APP -->
## About The App
A ticket exchange and resale application, enabling buyers and resellers to register, log in, purchase tickets using credit cards, and list tickets for resale.

### Built With
Major frameworks/Libraries/Database/Tools that this application uses. 
* [React](https://react.dev/)
* [Next.js](https://nextjs.org/)
* [Express](https://expressjs.com/)
* [Node.js](https://nodejs.org/en)
* [MongoDB](https://www.mongodb.com/)
* [Redis](https://redis.io/)
* [Docker](https://www.docker.com/)
* [Kubernetes](https://kubernetes.io/)
* [Ingress-Nginx](https://docs.nginx.com/nginx-ingress-controller/)
* [NATS Streaming Server](https://nats.io/)
* [Skaffold](https://skaffold.dev/)

<!-- GETTING STARTED -->
## Getting Started
set up locally by running follow steps.

### Prerequisites
Install the following:
* ingress-nginx
* kubectl
* docker
* skaffold

### Run the app
1. Clone the repo
```sh
git clone https://github.com/chensiyingcrystal/E-Commerce-web-app-Microservices-.git
```
2. Create secretes for JWT keys and Stripe Keys(from [stripe.com]) and update them in corresponding files
```sh
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```
```sh
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<STRIPE_SECRET_KEY>
```
3. Install NPM packages
```sh
cd ticketing
```
```sh
skaffold dev
```
4. Open the browser 
* Navigate to "https://ticketing.dev/"
(remember to add local DNS at your local etc/hosts file "127.0.0.1 ticketing.dev")
* type "thisisunsafe" in the browser window with security warning.

<!-- Architecture -->
## Architecture
<div>
    <img src="diagrams/architecture.png" >
</div>
### Services

### Event-driven 

<!-- Tech Stacks -->
## Tech Stacks

### Frontend
Server-side rendering with React and Next.js
### Backend
with Node.js and Express
### Database
MongoDB and Redis
### Build & Deploy
Docker and Kubernetes
Skaffold



<!-- MARKDOWN LINKS & IMAGES -->
[stripe.com]: https://stripe.com/

