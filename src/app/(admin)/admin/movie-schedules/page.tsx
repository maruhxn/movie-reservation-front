import { DataTable } from "@/components/data-table";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { columns } from "./components/columns";

export interface IMovieScheduleColumn {
  id: string;
  movie: {
    title: string;
  };
  screen: {
    screenNum: number;
  };
  startDate: string;
  startTm: string;
  endTm: string;
}

const MovieScheduleManage = async () => {
  const { data } = await axios.get(`${process.env.SERVER_URL}/movie-schedules`);
  const movieSchedules = data.data;
  const columnData = movieSchedules.map(
    (movieSchedule: IMovieScheduleColumn) => ({
      id: movieSchedule.id,
      movie: movieSchedule?.movie.title,
      screen: movieSchedule?.screen.screenNum,
      startDate: movieSchedule.startDate,
      startTm: movieSchedule.startTm,
      endTm: movieSchedule.endTm,
    })
  );
  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              영화 스케줄 관리
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
        <DataTable searchKey="movie" data={columnData} columns={columns} />
      </div>
    </>
  );
};

export default MovieScheduleManage;
