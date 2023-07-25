import MovieBannerSlider from "@/components/MovieBannerSlider";
import { IMovie } from "@/types/movie";
import axios from "axios";

export default async function Home() {
  const movies: IMovie[] = (await axios.get(`${process.env.SERVER_URL}/movies`))
    .data.data;
  return (
    <>
      <MovieBannerSlider movies={movies.slice(0, 5)} />
    </>
  );
}
