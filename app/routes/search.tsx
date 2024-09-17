import { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderFunctionArgs) {
  invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID is missing");
  invariant(
    process.env.SPOTIFY_CLIENT_SECRET,
    "SPOTIFY_CLIENT_SECRET is missing",
  );
  const api = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET,
  );
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  if (query === null) {
    throw new Response("need query text", { status: 400 });
  }
  const items = await api.search(query, ["artist", "album"], "ES", 5);
  return json({
    artists: items.artists.items.map((artist) => {
      return { name: artist.name, id: artist.id };
    }),
    albums: items.albums.items.map((album) => {
      return { name: album.name, id: album.id };
    }),
  });
}
