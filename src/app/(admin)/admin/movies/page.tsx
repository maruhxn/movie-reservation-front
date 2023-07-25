import { Metadata } from "next";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { MovieSchema } from "@/types/movie";
import axios from "axios";
import { columns } from "./components/columns";
import { MovieAddForm } from "./components/movie-add-form";

export const metadata: Metadata = {
  title: "영화 관리",
  description: "영화 관리 페이지",
};

// Simulate a database read for movies.
async function getMovies() {
  const { data } = await axios.get(`${process.env.SERVER_URL}/movies`);
  const movies = data.data;

  return z.array(MovieSchema).parse(movies);
}

export default async function MovieListPage() {
  const movies = await getMovies();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              영화 목록 관리
            </h2>
            <p className="text-muted-foreground">영화 추가</p>
            <MovieAddForm />
          </div>
        </div>
        <DataTable data={movies} columns={columns} />
      </div>
    </>
  );
}
