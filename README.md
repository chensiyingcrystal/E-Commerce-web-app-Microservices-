# crystalInstacart
An android mobile app implementing part of the instacart driver app features.

## Screenshots

<p float="left">
<img src="screenshots/screenshot1.png" width=50% height=50% />
<img src="screenshots/screenshot2.png" width=50% height=50% />
</p>

<p float="left">
<img src="screenshots/screenshot3.png" width=50% height=50% />
<img src="screenshots/screenshot4.png" width=50% height=50% />
<img src="screenshots/screenshot5.png" width=50% height=50% />
</p>

## Features
Key functionalities include:
* account registration and login
* location update and render it on the map
* location search and autocomplete
* route planning and simulate driver delivery

### App scaffolding

Activity: HomeMapActivity, MainActivity
Fragment: LoginFragment, HomeFragment

## Workflow: 
driver register/login -> automatically locate on the map -> search bar, autocomplete -> route planning

## UI design:
Building UI in activities/fragments using navigation graph, followed material design.

[`MainActivity`][1] is the application's entry point. Each screen is implemented inside a `Fragment`.
The navigation between them uses the [Navigation Graph][2]. The navigation is defined in [`nav_graph.xml`][3].
Using navigation graph can reduce dependencies and latency when switching between screens.

[1]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/MainActivity.kt
[2]: https://developer.android.com/guide/navigation/get-started
[3]: app/src/main/res/navigation/nav_graph.xml

### Sign in/sign up

Implement in [`LoginFragment`][4], uses [`Firebase Realtime Database`][5] to store user auth data

Triggered by 2 buttons:
* Register
* Sign in

To get to the sign up screen, tap on "register" and enter an email, password and driver name.
Then you can tap on "sign in " and enter email and password.

* Login: firebase auth(sign in/register account）
* fragment: check if email or phone is empty, password is empty/length < 6
* firebase connect callback, check if register/login is successful

[4]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/login/LoginFragment.kt
[5]: https://firebase.google.com/docs/database

### Location Realtime Update

Implement in [`HomeMapActivity`][6]

This allows user to fetch and render their realtime location with a marker on the google map when they successfully sign in.
And this location will keep updated within 5s intervals.

* location fetching: GMS Fused location provider
* Start location update/stop update(start listening to location)
* GetLastlocation(update latest location on map activity)

[6]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/home/HomeMapActivity.kt

### Location Search and AutoComplete

Implement in [`HomeMapActivity`][7]

This allows user to search any location in the search bar, and a set of options will be listed automatically.
User can tap on any location in the list, triggering the driver going to this destination.
This feature uses [`Google Place Autocomplete API][8].

[7]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/home/HomeMapActivity.kt
[8]: https://developers.google.com/maps/documentation/places/web-service/autocomplete

### Route planning and motion simulation

Implement in [`HomeMapActivity`][9] and [`location module`][10]

This allows user to plan the route between the current location and the destination.
A moving car will simulate driving along this route to complete delivery.
This module uses [`retrofit`] to implement HTTP request,

* once a place is selected in the last step, it will trigger function: getdirection(implement http request using retrofit) 
* using response(generated path) to draw route and draw moving car

[9]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/home/HomeMapActivity.kt
[10]: app/src/main/java/com/chensiyingcrystal/crystalinstacart/location
[11]: https://square.github.io/retrofit/

### Hilt Dependency Injection
All classes manage dependencies using [`Hilt`][12] to maintain/inject instance in right lifecycle.

[12]: https://developer.android.com/training/dependency-injection/hilt-android#inject-provides

