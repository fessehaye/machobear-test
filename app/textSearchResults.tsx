import { Link } from "@remix-run/react";
import { DataResult } from "./types";
type TextSearchProps = {
  results: DataResult | null;
};
export default function TextSearchResults({ results }: TextSearchProps) {
  if (results === null) {
    return null;
  }
  const { artists, albums } = results;
  return (
    <div
      className="bg-white absolute translate-y-2 rounded-sm w-full p-3 space-y-1 "
      data-testid="search-results"
    >
      {artists.length > 0 ? (
        <>
          <div className="text-gray-400 font-bold mb-2">Artists</div>
          {artists.map((artist) => {
            return (
              <Link
                key={artist.id}
                prefetch="intent"
                to={`/details/artist/${artist.id}`}
                className="block hover:text-green-500"
              >
                {artist.name}
              </Link>
            );
          })}
        </>
      ) : null}
      {albums.length > 0 ? (
        <>
          <div className="text-gray-400 font-bold my-2">Albums</div>
          {albums.map((album) => {
            return (
              <Link
                key={album.id}
                prefetch="intent"
                to={`/details/album/${album.id}`}
                className="block hover:text-green-500"
              >
                {album.name}
              </Link>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
