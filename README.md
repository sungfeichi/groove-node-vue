# Groove-node-vue
A project, can play songs, store and sort song in playlists, like a local version of common online music player, mainly inspired from Groove in win10, focuses on music play and playlist.

This is a two-in-one project, backend is a node server based on koa and fontend base on vue. So it's recommended to separate it and use different ports in development, ie. backend uses port 3000 and vite listens port 8000.


## Project setup
Require node, npm, sqlite3 installed.
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

sqls and js are not fully tested, bugs may emerge especially you add one song to a playlist twice.

## Further

Setup and run really sucks, calling for a electron version  
