# Groove-node-vue
A project, can play songs, store and sort song in playlists, like a local version of common online music player, mainly inspired from Groove in win10, focuses on music play and playlist.

This is a two-in-one project.

Backend is a node server based on koa, program koa middlewares to handle requests, communicate between frontend and database.

Frontend is a vite project based on vue3. Highly use of EventBus. Successfully use of ATC(asynchronous task component) based on promise, helps avoid callback hell, makes middle component no need to handle tasks in async process.

It's highly recommended to separate and use two different ports in development, ie. koa listens port 3000 and vite listens port 8000.


## Project setup
Requires node, npm, sqlite3 installed.
```
sqlite3 mp.db < mp.sql
cd groove
npm install
vite build
cd ..
npm install
```

## Run project
In project folder
```
npm run start
```
or
```
node app.js
```
App will run at port 8080, open your browser and go to localhost:8080,if everything goes right, you will see this SPA(single page app) running.But wait! Where are my songs?
Don't worry, go to settings, the cog in sidemenu, and tell app folders where you store your downloaded songs, then you will see them.


## Bugs

Sqls and js are not fully tested, bugs may emerge especially you add one song to a playlist twice.

## Further

Setup and run really sucks, call for an electron version.
