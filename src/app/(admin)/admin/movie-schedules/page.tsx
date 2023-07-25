import { DataTable } from "@/components/data-table";
import axios from "axios";
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
  const { data } = await axios.get(`${process.env.SERVER_URL}/movieschedules`);
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
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              영화 스케줄 관리
            </h2>
          </div>
        </div>
        <DataTable data={columnData} columns={columns} />
      </div>
    </>
  );
};

export default MovieScheduleManage;
