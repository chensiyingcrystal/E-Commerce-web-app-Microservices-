# Design(services and events)
* Services and their responsibility
  * auth	sign-up/in/out
  * tickets	Ticket creation/editing
  * orders	Order creation/editing
  * expiration	Watched for order to be created. Cancels them after 15 minutes
  * payments	Handles credit card payments. Cancels orders if payment fails, completes if payment succeeds.
  * NATS Streaming Server	"event bus"
<div>
    <img src="../diagrams/design05/1-services.png" width=50% height=50% >
</div>
* Events with Services
<div>
    <img src="../diagrams/design05/2-events.png" width=50% height=50% >
</div>
* Data with Services
<div>
    <img src="../diagrams/design05/3-data.png" width=50% height=50% >
</div>

## Auth Service
* Auth service route handler
<div>
    <img src="../diagrams/design05/4-auth.png" width=50% height=50% >
</div>

* build a express-validator middleware with Express Validator to validate user data([reference-express-validator])

  * 1. set up validate rules([validation-rule]): username must be an email, password should be no empty
  * 2. validate request([validate-request]), if not valid throw an error
<div>
    <img src="../diagrams/design05/5-validator.png" width=50% height=50% >
</div>

* Handling Errors
  * Goal: fix issues in:
    * output structured error messages
    * add various potential errors

  * Solution: 
    * Give erros a consistent structure by OOP design
    <div>
      <img src="../diagrams/design05/7-errors.png" width=50% height=50% >
    </div>
    * Create an error handling middleware that will interpret errors of any type, then turn the error into an identically-structured response.
    <div>
      <img src="../diagrams/design05/6-errorhandler.png" width=40% height=40% >
    </div>

    * Usage:
      * In tickets, auth, order, payments services, app.js file claims to use this middleware
      * Any process throwing an error will be handled gracefully by this middleware

* Sign up workflow
<div>
  <img src="../diagrams/design05/8-signup.png" width=80% height=80% >
</div>

* Use JWT to authenticate users for their follow-up requests
  * JWT payload contains user data encrypted with a JWT key(advantage over session: make server stateless)
  <div>
    <img src="../diagrams/design05/10-jwt.png" width=40% height=40% >
  </div>


* Subsequent authentication strategy
  * option 1: other service communicates with auth service either in sync or async way
  * option 2: each service hold authentication logic
  * result: choose option2 because we want other services can independently developed
  without relying on auth service.
  * implementation: Extract this part of auth logic into building a require-auth middleware[require-auth] with [current-user] middleware that decodes and parse payload information in the JWT to see whether the user is signed in.
  <div>
    <img src="../diagrams/design05/9-otherservices-auth.png" width=80% height=80% >
  </div>
  * require-auth and current-user logic:
  <div>
    <img src="../diagrams/design05/12-requireauth.png" width=50% height=50% >
  </div>

  * MongoDB
    * define User model and store user data with Mongoose

## Build frontend with React and Next.js
* server side rendering
  <div>
    <img src="../diagrams/design05/13-ssr.png" width=50% height=50% >
  </div>


  <div>
    <img src="../diagrams/design05/16-nextjs.png" width=50% height=50% >
  </div>
  
* implementation
  * how to handle a request
  <div>
    <img src="../diagrams/design05/15-reqflow.png" width=50% height=50% >
  </div>
  
  * build a use request hook to send HTTP request to backend services
  <div>
    <img src="../diagrams/design05/14-hooks.png" width=50% height=50% >
  </div>

  * Next.js
    * Next.js is a popular and lightweight framework for static and server‑rendered applications built with React. It includes styling and routing solutions out of the box, and assumes that you’re using Node.js as the server environment.

    * app.js([app-js])
      * The code in App.js creates a component. In React, a component is a piece of reusable code that represents a part of a user interface. Components are used to render, manage, and update the UI elements in your application.

    * index.js([index-js])
      * the bridge between the component you created in the App.js file and the web browser. The browser looks for index.js and render it in HTML

    * pages
      * this module contains different pages that contains logic to interact with backend.
      * this page will automatically set as handling requests tthat end with the same path name as the file name.(if it's "signin", then the path would be "/signin")

    * pass props(currentuser, etc.) across components/pages
    <div>
      <img src="../diagrams/design05/20-props.png" width=50% height=50% >
    </div>

## Tickets Service
  <div>
    <img src="../diagrams/design05/17-tickets.png" width=50% height=50% >
  </div>

  * Generate ticket create and ticket update events, and notify order service
  
  * Use Nats Streaming Server to implement the event bus
    * Run the official 'nats-streaming' docker image in kubernetes.  Need to read the image's [docs]
    * To communicate with NATS, we will use a client library called **[node-nats-streaming]**([github-link])
    <div>
      <img src="../diagrams/design05/18-nats.png" width=50% height=50% >
    </div>
    * NATS Streaming stores all events in memory (default), flat files or in a MySQL/Postgres DB
    * publisher and listener
    <div>
      <img src="../diagrams/design05/19-pubsub.png" width=50% height=50% >
    </div>

## Design Events interaction between services
  * Goal: Deciding on what events to publish and what data they should contain; what other services should listen to this event
  * Rule #1 - Make one service in charge of all aspects of a Resource.  Emit events whenever changing that data
  * Rule #2 - If you don't know how the event will be used, publish all available data about the resource
  * Rule #3 - If you do know how the event will be consumed (and don't expect it to change soon), publish only the required info
  * Event design
    <div>
      <img src="../diagrams/design06/1-events.png" width=50% height=50% >
    </div>

    * Events published by Ticket service
    <div>
      <img src="../diagrams/design06/2-ticketevents.png" width=50% height=50% >
    </div>
    
    * Events published by Order service
      <div>
        <img src="../diagrams/design06/3-orderevents1.png" width=50% height=50% >
      </div>

      <div>
        <img src="../diagrams/design06/4-orderevents2.png" width=50% height=50% >
      </div>

    * Events published by Payment service
    <div>
      <img src="../diagrams/design06/5-paymentevents.png" width=50% height=50% >
    </div>

    * Events published by Expiration service
    <div>
      <img src="../diagrams/design06/6-expirationevents.png" width=50% height=50% >
    </div>


## Concurrency Issue
* For any similar application, even for those scaling to some scope, we cannot avoid concurrency issue. For example, there might have a race condition for buyer and seller, one of them want to buy this order and another updates the ticket at almost the same time.
    <div>
      <img src="../diagrams/design06/7-race.png" width=30% height=30% >
    </div>
* How to solve it?
  * Used optimistic concurrency control: Increment the 'version' number whenever the primary service responsible for a record emits an event to describe a create/update/destroy to a record
  * Solve concurrency issue by keeping an order of events
    <div>
      <img src="../diagrams/design06/8-order.png" width=80% height=80% >
    </div>

  * Implementation: used **mongoose-update-if-current** to assist in (1) automatically updating version number before data is saved (2) Customizes the find-and-update operation (save) to look for the correct version and update the version
    <div>
      <img src="../diagrams/design06/9-mongoose.png" width=50% height=50% >
    </div>
  

## Expiration Service
* implementation: expiration service listens to order-created-events; when the event happens, it enqueues a job with Bull JS option(setting delay for the order expiration duration) and store it into Redis. It will dequeue after that duration of delay.
    <div>
      <img src="../diagrams/design06/10-expiration.png" width=50% height=50% >
    </div>

## Payment Service
* 
    <div>
      <img src="../diagrams/design06/11-payment.png" width=50% height=50% >
    </div>

## CI/CD
[to-do]   




## About Test
* we use Jest to test and write our test set up codes and a set of test codes for each features inside each service module
<div>
  <img src="../diagrams/design05/11-test.png" width=50% height=50% >
</div>











<!-- MARKDOWN LINKS & IMAGES -->
[reference-express-validator]: https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
[validation-rule]: ticketing/auth/src/routes/signin.ts
[validate-request]: ticketing/common/src/middlewares/validate-request.ts
[require-auth]:ticketing/common/src/middlewares/require-auth.ts
[current-user]:ticketing/common/src/middlewares/current-user.ts
[app-js]: https://react.dev/learn/tutorial-tic-tac-toe
[index-js]: https://react.dev/learn/tutorial-tic-tac-toe
[node-nats-streaming]: https://www.npmjs.com/package/node-nats-streaming?activeTab=readme
[docs]: https://hub.docker.com/_/nats-streaming
[github-link]: https://github.com/nats-io/stan.js