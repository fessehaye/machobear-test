import { useEffect, useState } from "react";
import { FavoriteArtists } from "./types";

type FavProps = {
  id: string;
  name: string;
};

export default function AddToFavorite({ id, name }: FavProps) {
  const [favorites, setFavorites] = useState<FavoriteArtists>([]);
  const isFavorite = favorites.some((fav) => fav.id === id);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const parsedFavorites: FavoriteArtists = JSON.parse(storedFavorites);
      setFavorites(parsedFavorites);
    }
  }, []);

  const toggleFavorite = () => {
    let updatedFavorites: FavoriteArtists;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id !== id);
    } else {
      updatedFavorites = [...favorites, { name, id }];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <button
      onClick={() => toggleFavorite()}
      className={`flex gap-2 ${isFavorite ? "text-red-500" : "text-black"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>

      {isFavorite ? "Remove as Favorite" : "Add as Favorite"}
    </button>
  );
}
