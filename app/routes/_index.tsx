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
      <div className=" py-20 lg:py-48 px-4 w-full relative">
        <h1 className="font-bold text-white text-center w-full text-xl lg:text-4xl mb-8">
          Music Search
        </h1>
        <SearchInput />
        <img
          src="music.jpg"
          alt=""
          className="absolute w-full h-full -z-10 top-0 left-0 object-cover"
        />
      </div>
      <div className="py-20 px-4 w-full max-w-[800px] mx-auto">
        <FavoriteArtistsComponent />
      </div>
    </main>
  );
}
