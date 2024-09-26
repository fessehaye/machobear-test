import { json, LoaderFunctionArgs } from "@remix-run/node";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackButton from "~/backButton";

function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID is missing");
  invariant(
    process.env.SPOTIFY_CLIENT_SECRET,
    "SPOTIFY_CLIENT_SECRET is missing",
  );
  invariant(params.albumId, "albumId is missing");

  const api = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID,
    process.env.SPOTIFY_CLIENT_SECRET,
  );

  try {
    const album = await api.albums.get(params.albumId);

    return json({
      name: album.name,
      images: album.images,
      releaseDate: album.release_date,
      artist: album.artists.map((artist) => artist.name),
      tracks: album.tracks.items,
      label: album.label,
    });
  } catch (error) {
    throw new Response("not found", { status: 404 });
  }
};

export default function AlbumPage() {
  const { name, images, releaseDate, artist, tracks, label } =
    useLoaderData<typeof loader>();
  const dateFormatter = new Intl.DateTimeFormat("en-US");
  const listFormatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  });
  const released = new Date(releaseDate);
  return (
    <div>
      <div className="w-full flex mb-16">
        <BackButton />
      </div>
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        <img src={images[0].url} alt="album cover" className="size-52" />
        <div>
          <h1 className="font-bold text-2xl mb-4" data-testid="album-name">
            {name}
          </h1>
          <p className="text-gray-500 mb-2">
            {label} - {listFormatter.format(artist)}
          </p>
          <p>
            {name} was released {dateFormatter.format(released)}
          </p>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Tracks</h2>
        <ul className="space-y-2" data-testid="track-list">
          {tracks.map((track) => {
            return (
              <li
                key={track.id}
                className="w-full flex gap-2 text-[#686868] text-base"
              >
                <div>{track.track_number} -</div>
                <div className="max-w-56 md:max-w-none truncate">
                  {track.name}
                </div>
                <div className="ml-auto">
                  {msToMinutesAndSeconds(track.duration_ms)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="text-red-brand text-center">
      <BackButton />
      <div className="mt-8 text-base font-bold" data-testid="page-error">
        Album not found
      </div>
      <div className="px-2 text-base">There was a problem. Sorry.</div>
    </div>
  );
}
