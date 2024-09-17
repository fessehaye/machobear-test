export type DataResult = {
  artists: {
    name: string;
    id: string;
  }[];
  albums: {
    name: string;
    id: string;
  }[];
};
export type FavoriteArtists = {
  id: string;
  name: string;
}[];
