"use client";

import { getImagePath } from "@/lib/utils";
import { IMovie } from "@/types/movie";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "./ui/Button";

interface MovieBannerSliderProps {
  movies: IMovie[];
}

const MovieBannerSlider: FC<MovieBannerSliderProps> = ({ movies }) => {
  const [curMovie, setCurMovie] = useState<IMovie>(movies[0]);
  const router = useRouter();
  return (
    <div className="relative w-full min-h-[70vh] flex justify-center items-center">
      <div className="w-full h-full bg-black/40 absolute z-10" />
      <Image
        src={getImagePath(curMovie.backdrop_path)}
        fill
        className="object-cover"
        alt="영화 이미지"
      />
      <div className="absolute z-20 text-white flex items-center justify-center flex-col w-1/2">
        <h1 className="text-3xl font-bold">{curMovie.title}</h1>
        <span className="text-zinc-200 mt-1 mb-3">
          {curMovie.genres.join(" • ")}
        </span>
        <div className="flex items-center gap-3">
          {movies.map((movie, idx) => (
            <div className="relative w-36 min-h-[210px]" key={movie.id}>
              <div className="absolute aspect-square w-8 h-8 text-xl bg-black text-white font-bold flex items-center justify-center z-10">
                {idx + 1}
              </div>
              <Image
                src={getImagePath(movie?.poster_path)}
                fill
                className="object-contain"
                alt="포스터"
              />
            </div>
          ))}
        </div>
      </div>

      <ChevronLeftCircle className="absolute w-12 h-12 left-10 text-white z-30 cursor-pointer hover:text-white/80" />
      <ChevronRightCircle className="absolute w-12 h-12 right-10 text-white z-30 cursor-pointer hover:text-white/80" />

      <Button
        className="absolute bottom-5 z-30 bg-transparent text-white"
        variant="outline"
        onClick={() => router.push(`/reservation/${curMovie.id}`)}
      >
        예매하기
      </Button>
    </div>
  );
};

export default MovieBannerSlider;
