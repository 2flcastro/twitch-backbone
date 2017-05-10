Twitch API - Backbone SPA
=========================

This is an SPA that uses the Twitch.tv API to obtain information for a list
of channels and display this information for the viewer. You will be able to see
basic information about each Twitch channel as well as whether or not each
channel is currently streaming live. If the channel is streaming, an addition
preview of the stream will be presented with links to open the stream over at
Twitch.

Additional features include the ability to filter through the list of channels
based on streaming status, search for a specific channel from the list, and
add or remove new channels from the list.


Gulp Build:
----------
First step is to build the app files.
Run the following command to build the CSS and JS files for the app:
```
gulp build
```
This should add two files `app.js` and `styles.css` to the `dist` directory
containing all bundled and compressed JavaScript and CSS files respectively.

For development purposes you can use:
```
gulp build:watch
```
This watches for changes to any of your files and automatically updates them in
the `dist` directory.


Running the Server
------------------
To run the Node/Express server:
```
node index.js
```
App should now be running on `localhost:3000`. Default port is 3000. 
