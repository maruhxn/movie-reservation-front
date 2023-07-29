import { DataTable } from "@/components/data-table";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { z } from "zod";
import { columns } from "./components/columns";

export interface MovieScheduleColumn {
  id: string;
  movie: string;
  screen: number;
  startTm: string;
  endTm: string;
}

export const MovieScheduleColumnSchema = z.object({
  id: z.string(),
  movie: z.string(),
  screen: z.number(),
  startTm: z.string(),
  endTm: z.string(),
});

async function getMovieSchedules() {
  const { data } = await axios.get(`${process.env.SERVER_URL}/movie-schedules`);
  const movieSchedules = data.data.map((movieSchedule: any) => ({
    id: movieSchedule.id,
    movie: movieSchedule?.movie.title,
    screen: movieSchedule?.screen.screenNum,
    startTm: movieSchedule.startTm,
    endTm: movieSchedule.endTm,
  }));

  return z.array(MovieScheduleColumnSchema).parse(movieSchedules);
}

const MovieScheduleManage = async () => {
  const movieSchedules = await getMovieSchedules();
  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {`영화 스케줄 관리(${movieSchedules.length})`}
            </h2>
          </div>
          <Link
            href="/admin/movie-schedules/create"
            className={cn(
              buttonVariants({
                variant: "default",
              })
            )}
          >
            Create
          </Link>
        </div>
        <DataTable searchKey="movie" data={movieSchedules} columns={columns} />
      </div>
    </>
  );
};

export default MovieScheduleManage;
