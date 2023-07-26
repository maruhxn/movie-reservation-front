import { MovieSchedule } from "@/types/movieSchedule";
import axios, { AxiosError } from "axios";
import { MovieScheduleForm } from "./components/form";

const MovieSchedulePage = async ({
  params,
}: {
  params: { movieScheduleId: string };
}) => {
  let movieSchedule: MovieSchedule | null = null;
  try {
    const { data } = await axios.get(
      `${process.env.SERVER_URL}/movie-schedules/${params.movieScheduleId}`
    );
    movieSchedule = data.data as MovieSchedule;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.status === 404) movieSchedule = null;
    }
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MovieScheduleForm initialData={movieSchedule} />
      </div>
    </div>
  );
};

export default MovieSchedulePage;
