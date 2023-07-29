"use client";

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Separator } from "@/components/ui/Separator";
import { cn, getReservedSeatsInfo } from "@/lib/utils";
import { FullMovieSchedule } from "@/types/movieSchedule";
import {
  CreateReservation,
  CreateReservationSchema,
  Reservation,
} from "@/types/reservation";
import { ReservedSeatsInfo } from "@/types/reservedSeatsInfo";
import { FullScreen } from "@/types/screen";
import { Seat } from "@/types/seat";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";

const Page = () => {
  const movieId = useParams().movieId;
  const token = getCookie("token");
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [movieSchedules, setMovieSchedules] = useState<FullMovieSchedule[]>([]);
  const [selectedMS, setSelectedMS] = useState<FullMovieSchedule | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<FullScreen | null>(null);
  const [personAmt, setPersonAmt] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<Omit<Seat, "screenId">[]>(
    []
  );

  const [reservedInfo, setReservedInfo] = useState<ReservedSeatsInfo | null>(
    null
  );
  useEffect(() => {
    if (!selectedMS) return;
    setReservedInfo(getReservedSeatsInfo(selectedMS));
  }, [selectedMS]);

  const { toast } = useToast();

  async function getMovieScheduleByDate(date: Date) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/movie-schedules?startTm=${date}&movieId=${movieId}`
    );
    data.ok && setMovieSchedules(data.data as FullMovieSchedule[]);
  }

  const { mutate: reserve, isLoading } = useMutation({
    mutationFn: async () => {
      const dto: CreateReservation = {
        movieScheduleId: selectedMS!.id,
        personAmt,
        seatIds: selectedSeats.map((seat) => seat.id),
        seatNames: selectedSeats.map((seat) => seat.name),
      };
      const payload = CreateReservationSchema.parse(dto);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reservations/`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return data.data as Reservation;
    },
    onSuccess: (reservation) => {
      router.refresh();
      router.push(`/success-reservation/${reservation.id}`);
      toast({
        title: "예매 완료",
        description: `예매 완료`,
        variant: "default",
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 422 ||
          err.response?.status === 404 ||
          err.response?.status === 401 ||
          err.response?.status === 400
        ) {
          return toast({
            title: "Error",
            description: err.response.data.message,
            variant: "destructive",
          });
        }
      }
      toast({
        title: "Server error",
        description: "서버 오류입니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-3">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "yyyy-MM-dd")
                ) : (
                  <span>날짜를 선택하세요</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  date && getMovieScheduleByDate(date);
                }}
                disabled={(date) => date < subDays(new Date(), 1)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-3">
          {movieSchedules?.length > 0 ? (
            movieSchedules.map((movieSchedule) => (
              <div
                key={movieSchedule.id}
                onClick={() => {
                  setSelectedMS(movieSchedule);
                  setSelectedScreen(movieSchedule.screen);
                }}
                className="flex flex-col gap-1 border-2 rounded-lg p-3 cursor-pointer"
              >
                <span>{`상영관: ${movieSchedule.screen.screenNum}`}</span>
                <span>{`남은 좌석: ${
                  getReservedSeatsInfo(movieSchedule).restSeatAmt
                }`}</span>
                <span>{`시간: ${format(
                  new Date(movieSchedule.startTm),
                  "h:mm a"
                )}`}</span>
              </div>
            ))
          ) : (
            <span>결과가 없습니다.</span>
          )}
        </div>

        {selectedMS && selectedScreen && reservedInfo && (
          <div className="flex-1 flex flex-col gap-3">
            <span>인원을 선택하세요</span>
            <Input
              type="number"
              value={personAmt}
              pattern={"[0-9]*"}
              onChange={(e) => {
                const value = +e.target.value;
                if (value >= 0 && value <= reservedInfo.restSeatAmt)
                  setPersonAmt(value);
              }}
            />
            <span>좌석을 선택하세요</span>
            <div className="flex gap-1">
              {selectedScreen.seats.map((seat) => {
                const isSelected = selectedSeats.find(
                  (selectedSeat) => selectedSeat.id === seat.id
                );
                return (
                  <Button
                    className={cn("flex-1", isSelected && "bg-green-500")}
                    disabled={reservedInfo.reservedSeatIds.includes(seat.id)}
                    onClick={() => {
                      isSelected
                        ? setSelectedSeats((prev) =>
                            prev.filter(
                              (selectedSeat) => selectedSeat.id !== seat.id
                            )
                          )
                        : setSelectedSeats((prev) => [
                            ...prev,
                            { id: seat.id, name: seat.name },
                          ]);
                    }}
                    key={seat.id}
                  >
                    {seat.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Separator className="h-[2px]" />
      <Button
        className="w-1/3 mx-auto block"
        onClick={() => reserve()}
        isLoading={isLoading}
      >
        예매하기
      </Button>
    </div>
  );
};

export default Page;
