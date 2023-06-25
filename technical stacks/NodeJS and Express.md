# NodeJS

### What is NodeJs, what is it used for
* what: Javascript runtime environment
* mainly used for: create a web server

### Advantages
* Node.js operates on a single-thread event loop, using non-blocking I/O calls, allowing it to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.

* Write JavaScript for the server-side code in addition to the client-side code without the need to learn a completely different language.

### Async programming in JavaScript
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing

### NPM
* npm is the standard package manager for Node.js.
* npm manages downloads of dependencies of your project.
* Installing all dependencies
If a project has a package.json file, by running
```
npm install
```
it will install everything the project needs, in the node_modules folder, creating it if it's not existing already.
* Installing a single package
You can also install a specific package by running
```
npm install <package-name>
```
Furthermore, since npm 5, this command adds <package-name> to the package.json file dependencies.
* update packages
* publish packages and specify version

# Express
* What it is
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* feature
Express extends NodeJS specificall to make developer easier to code for a web server, by adding the concept of middleware, a simplified way of managing different routes, automated integration with several templating engines and a bunch more.
* implementation
1. how to create and run a server
https://expressjs.com/en/starter/hello-world.html
2. routing
https://expressjs.com/en/guide/routing.html
3. middleware
https://expressjs.com/en/guide/writing-middleware.html