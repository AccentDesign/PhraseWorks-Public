# PhraseWorks

# Phrase Works

To amend the db/R2 bucket, amend the wrangler.jsonc in the backend folder.

You will also need to do an amend to the name (backend) in the wrangler.jsonc after a new worker has been created.

## Deployment

Before doing a commit to live you need to go into the front end and do an npm run build, this will build it all into the dist folder in the backend.

so front end folder `npm run build`

then in back end folder `npm run deploy`

## Development

for dev in the backend folder `npm run dev`
this will run the frontend by default from what is built in the dist folder, you can run a live update front end from in a second terminal in the frontend folder doing `npm run dev`

the live action frontend will run on http://localhost:5173
