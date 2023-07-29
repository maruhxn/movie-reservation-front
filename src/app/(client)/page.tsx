import { buttonVariants } from "@/components/ui/Button";
import { cn, getImagePath } from "@/lib/utils";
import { IMovie } from "@/types/movie";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const movies: IMovie[] = (await axios.get(`${process.env.SERVER_URL}/movies`))
    .data.data;
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* <MovieBannerSlider movies={movies.slice(0, 5)} /> */}
      {movies.map((movie, idx) => (
        <div key={movie.id} className="flex space-x-2">
          <div className="relative w-36 min-h-[210px]" key={movie.id}>
            <Image
              loading="lazy"
              src={getImagePath(movie.poster_path ?? "/logo.png")}
              fill
              className="object-contain"
              alt="포스터"
            />
          </div>
          <div className="flex flex-col space-y-1 justify-center flex-1">
            <span className="font-bold">순위: {idx + 1}</span>
            <span className="font-bold text-xl">{movie.title}</span>
            <p>{movie.overview.slice(0, 80) + "..."}</p>
            <Link
              href={`/${movie.id}`}
              className={cn(buttonVariants({ size: "sm" }), "w-24")}
            >
              예매하기
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
