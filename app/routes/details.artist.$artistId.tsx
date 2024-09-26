import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import invariant from "tiny-invariant";
import AddToFavorite from "~/addToFavorites";
import BackButton from "~/backButton";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID is missing");
  invariant(
    process.env.SPOTIFY_CLIENT_SECRET,
    "SPOTIFY_CLIENT_SECRET is missing",
  );
  invariant(params.artistId, "ArtistId is missing");

  const api = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET,
  );

  try {
    const artist = await api.artists.get(params.artistId);
    const albums = await api.artists.albums(params.artistId);
    return json({
      name: artist.name,
      artistId: artist.id,
      image: artist.images[0].url,
      followers: artist.followers,
      genres: artist.genres,
      popularity: artist.popularity,
      albums: albums.items.map((album) => {
        return {
          name: album.name,
          id: album.id,
          image: album.images[0].url,
          tracks: album.total_tracks,
          date: album.release_date,
        };
      }),
    });
  } catch (error) {
    throw new Response("not found", { status: 404 });
  }
};

export default function ArtistPage() {
  const { name, image, followers, genres, popularity, albums, artistId } =
    useLoaderData<typeof loader>();

  const dateFormatter = new Intl.DateTimeFormat("en-US");

  const numFormatter = new Intl.NumberFormat();
  return (
    <div>
      <div className="w-full flex mb-16 justify-between">
        <BackButton />
        <AddToFavorite id={artistId} name={name} />
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <img src={image} alt="artist cover" className="size-52" />
        <div>
          <h1 className="font-bold text-2xl mb-2" data-testid="artist-name">
            {name}
          </h1>
          <p className="text-gray-500 mb-8 flex gap-4">
            <span>{`Popularity(0-100): ${popularity}`}</span>
            <span>{`Followers: ${numFormatter.format(followers.total)}`}</span>
          </p>
          <div className="flex gap-3 items-center flex-wrap">
            {genres.map((genre) => (
              <span
                key={genre}
                className="bg-green-100 text-green-800 text-xs font-medium  px-2.5 py-0.5 rounded capitalize"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Albums</h2>
        <div
          className="grid lg:grid-cols-2 gap-8 lg:gap-y-5"
          data-testid="album-listing"
        >
          {albums.map((album) => {
            return (
              <Link
                prefetch="intent"
                unstable_viewTransition
                to={`/details/album/${album.id}`}
                key={album.id}
                className="w-full flex gap-4 text-[#686868] text-base group hover:bg-gray-100 p-3 rounded-sm"
              >
                <img
                  src={album.image}
                  className="size-[100px]"
                  alt="album cover"
                />
                <div>
                  <h3 className="font-bold text-base leading-none mb-4 group-hover:text-green-700">
                    {album.name}
                  </h3>
                  <div className="text-gray-400 space-x-2">
                    <span>{dateFormatter.format(new Date(album.date))} -</span>
                    <span>{album.tracks} Total Tracks</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="text-red-brand text-center">
      <BackButton />
      <div className="mt-8 text-base font-bold" data-testid="page-error">
        Artist not found
      </div>
      <div className="px-2 text-base">There was a problem. Sorry.</div>
    </div>
  );
}
