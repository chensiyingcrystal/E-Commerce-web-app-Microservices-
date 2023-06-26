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

## Tickets Service
  <div>
    <img src="../diagrams/design05/17-tickets.png" width=50% height=50% >
  </div>

  * Generate ticket create and ticket update events, and notify order service
  
  * Use Nats Streaming Server to implement the event bus
    * Run the official 'nats-streaming' docker image in kubernetes.  Need to read the image's docs
   



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