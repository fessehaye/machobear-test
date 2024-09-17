import { useState, useEffect } from "react";
import { FavoriteArtists } from "./addToFavorites";
import { Link } from "@remix-run/react";

export default function FavoriteArtistsComponent() {
  const [favorites, setFavorites] = useState<FavoriteArtists>([]);
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const parsedFavorites: FavoriteArtists = JSON.parse(storedFavorites);
      setFavorites(parsedFavorites);
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="border border-[#D9D9D9] border-solid p-8">
      <h2 className="font-bold text-2xl leading-7 mb-8">My Favorite Artists</h2>
      {favorites.length > 0 ? (
        <div className="divide-y-2">
          {favorites.map((fav) => {
            return (
              <div key={fav.id} className="w-full flex py-2 pr-2 ">
                <Link
                  prefetch="intent"
                  unstable_viewTransition
                  to={`/details/artist/${fav.id}`}
                  className="max-w-28 md:max-w-none truncate"
                >
                  {fav.name}
                </Link>
                <button
                  className="ml-auto flex items-center text-red-700"
                  onClick={() => removeFavorite(fav.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 mr-1"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No Favorites added yet.</p>
      )}
    </div>
  );
}
