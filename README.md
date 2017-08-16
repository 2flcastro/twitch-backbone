# Twitch Streaming Channels

![Build Status][travis-img]

This is a Backbone SPA that uses the Twitch.tv API to obtain information of a list
of channels and displays this information for the viewer. You will be able to see
basic information about each Twitch channel as well as whether or not each
channel is currently streaming live. If the channel is streaming, an addition
preview of the stream will be presented with links to open the stream over at
Twitch.

Additional features include the ability to filter through the list of channels
based on streaming status, search for a specific channel from the list, and
add or remove new channels from the list.


### Building Client Assets
First step is to build the app files.
Run the following command to build the CSS and JS files for the app:
```
gulp
```
This will build all client asssets into the `dist` directory.

For development purposes you can use:
```
gulp dev
```
This watches for changes to any of your `src` files and automatically builds
them into the `dist` directory.


### Running the Server
Start the app by running:
```
node index.js
```
App should now be running on `localhost:3000`. Default port is 3000, can be
changed via process.env.PORT environment variable.


### Running Tests
There are client and server tests that can be ran through gulp tasks.
#### Client tests
To run the client tests use:
```
gulp client-tests:run:headless
```
Which will bundle all client tests files and feed them to an instance of
PhantomJS for headless browser testing in the CL.
#### Server Tests
To run server tests use:
```
gulp server-tests:run
```
#### Running Both Client and Server Tests (Preferred Method)
Additionally, you can run both client and server tests in one go using:
```
gulp run-tests
```
There are other gulp testing tasks available, like watching for test file changes.
See `gulpfile.js` for more.

[travis-img]: https://travis-ci.org/2flcastro/twitch-backbone.svg?branch=master
