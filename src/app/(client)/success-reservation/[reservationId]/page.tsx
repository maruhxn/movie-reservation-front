import { MovieSchedule } from "@/types/movieSchedule";
import { Reservation } from "@/types/reservation";
import axios from "axios";
import { format } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Buttons from "./components/buttons";

interface IReservation extends Reservation {
  movieSchedule: MovieSchedule & {
    movie: {
      title: string;
    };
    screen: {
      screenNum: number;
    };
  };
}

const page = async ({
  params: { reservationId },
}: {
  params: { reservationId: string };
}) => {
  const token = cookies().get("token");
  if (!token) {
    redirect("/sign-in");
  }
  const { data } = await axios.get(`${process.env.SERVER_URL}/auth`, {
    withCredentials: true,
    headers: {
      Authorization: "Bearer " + token.value,
    },
  });

  if (!data.data) {
    redirect("/");
  }

  const { data: reservationData } = await axios.get(
    `${process.env.SERVER_URL}/reservations/${reservationId}`,
    {
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + token.value,
      },
    }
  );
  const validReservation = reservationData.data as IReservation;

  return (
    <div className="mt-32 mx-auto w-1/2 border rounded-xl p-4 space-y-3">
      <div className="flex flex-col divide-y-2">
        <span className="p-2">예매 ID: {validReservation.id}</span>
        <span className="p-2">예매 시간: {validReservation.createdAt}</span>
        <span className="p-2">예매 수량: {validReservation.personAmt}</span>
        <div className="flex flex-col border rounded-xl p-4 divide-y-2">
          <span className="p-2">
            영화 제목: {validReservation.movieSchedule.movie.title}
          </span>
          <span className="p-2">
            상영 시작 시간:{" "}
            {format(
              new Date(validReservation.movieSchedule.startTm),
              "yyyy-MM-dd"
            )}
          </span>
          <span className="p-2">
            상영 종료 시간:{" "}
            {format(
              new Date(validReservation.movieSchedule.endTm),
              "yyyy-MM-dd"
            )}
          </span>
          <span className="p-2">
            상영관: {validReservation.movieSchedule.screen.screenNum}
          </span>
          <div className="p-2 flex space-x-2">
            예매한 좌석: {validReservation.seatNames.join(", ")}
          </div>
        </div>
      </div>
      <div className="w-1/2 mx-auto flex justify-between items-center">
        <Buttons reservationId={validReservation.id} token={token.value} />
      </div>
    </div>
  );
};

export default page;
