# PhraseWorks

To amend the db/R2 bucket, amend the wrangler.jsonc in the backend folder.

You will also need to do an amend to the name (backend) in the wrangler.jsonc after a new worker has been created.

## Deployment

Before doing a commit to live you need to go into the front end and do an npm run build, this will build it all into the dist folder in the backend.

So front end folder `npm run build`

Then in back end folder `npm run deploy`

## Development

On initial download, do an `npm run install-all`

After this install you may run `npm run dev` and it will trigger both the frontend and backend `npm run dev` commands

Alternatively:
For dev in the backend folder `npm run dev`
This will run the frontend by default from what is built in the dist folder, you can run a live update front end from in a second terminal in the frontend folder doing `npm run dev`

The live action frontend will run on http://localhost:5173 (Meaning npm run dev on the front-end wordpress side seperate to the backend. The backend runs the react built in its /dist folder by default)
The actual built version will run on http://localhost:8787
