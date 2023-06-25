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










<!-- MARKDOWN LINKS & IMAGES -->
[reference-express-validator]: https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
[validation-rule]: ticketing/auth/src/routes/signin.ts
[validate-request]: ticketing/common/src/middlewares/validate-request.ts
