# Machobear Test

Before running create a `.env` file and add these variables

```
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
```

You can get the client tokens from https://developer.spotify.com/ and creating an app.

You can run the project via

`npm run dev`

and run tests via 

`npm run test`

This application was built using:
* Remix
* React
* Typescript
* TailwindCSS
* Spotify TS SDK
* Playwright for tests

There are four routes on this application:
* `/` - Home Page featuring your favorite artists
* `/details/artist/<ID>` - Artist detail page including Albums and Adding an artist in your favorites
* `/details/album/<ID>` - Album detail page including Track Listing
* `/search` - API Only, fetches spotify search results based on `q` text

Favorite artists are saved via `localstorage`
