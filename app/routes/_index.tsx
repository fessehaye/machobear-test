import type { MetaFunction } from "@remix-run/node";
import FavoriteArtistsComponent from "~/favoriteArtist";
import SearchInput from "~/searchInput";

export const meta: MetaFunction = () => {
  return [
    { title: "Spotify Search" },
    { name: "description", content: "Machobear Test" },
  ];
};

export default function Index() {
  return (
    <main>
      <div className="bg-black py-20 px-4 w-full">
        <h1 className="font-bold text-white text-center w-full text-xl lg:text-4xl mb-8">
          Music Search
        </h1>
        <SearchInput />
      </div>
      <div className="py-20 px-4 w-full max-w-[800px] mx-auto">
        <FavoriteArtistsComponent />
      </div>
    </main>
  );
}
