## Getting started

After pulling the project to your local machine, navigate to the `Health-Forum---Livewell` folder which contains all dev files.

Run `npm install` to install all required dependencies.

Then run `npm run dev` to start the development environment. The app can be accessed at `http://localhost:3000`.

Production app: https://health-forum-livewell.vercel.app/

## Data Models and Technologies used

Framework: Next.js with TypeScript

UI components and color palettes: Material UI

Authentication: Firebase authentication

Cloud storage for images: Cloudinary

Database: Cloud Firestore (NoSQL)

### Data models

2 collections: `users` and `threads`

`users` collection stores users' credentials in the form of documents. Each document is represented by a unique id and has the following fields:

`email: {user's email}` and `role: {patient or doctor}`

`threads` collection stores details of threads and the users who create them. `threads` has the fields:

`createdBy: {user's email}`

`createdByRole: {user's role}`

`threadID: {unique id of each thread}`

`topic: {the topic of a thread that the user creates}`

In each document of a thread contains a sub-collection named `messages` that stores all messages pertaining to that specific thread.

Fields of `messages`:

`createdAt: {timestamp of a thread when it's created}`

`image: {array of strings representing the URLs of images that were uploaded to Cloudinary}`

`role: {role of user who sends this message}`

`sender: {email of the user who sends this message}`

`text: {text content of the message besides the images}`

This sub-collection `messages` in each `threads` document makes it easy to query and update the list of messages pertaining to a thread.
