## Example Plugin

To create a plugin you need to add two foldes, a folder inside the Plugins folder in the frontend and a folder inside the plugins folder in the backend. For the examples below we will use pluginName for both. The name should match the slug in the backend plugin folders index.js.

Once both the front end and the backend are created you will need to go into the backend and type `npm run generate:plugins`.

This updates the admin plugins page to show the plugin to activate or deactivate it and also adds any pages it has to the allowed pages list.
