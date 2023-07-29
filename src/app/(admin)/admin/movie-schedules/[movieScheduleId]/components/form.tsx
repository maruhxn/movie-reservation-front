"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { useToast } from "@/hooks/use-toast";
import { IMovie } from "@/types/movie";
import {
  CreateMovieSchedule,
  CreateMovieScheduleSchema,
  MovieSchedule,
} from "@/types/movieSchedule";
import { Screen } from "@/types/screen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { parseISO } from "date-fns";

interface MovieScheduleFormProps {
  initialData: MovieSchedule | null;
}

type CreateAndUpdateMovieScheduleResponse = {
  ok: boolean;
  status: number;
  msg: string;
  data: { movieSchedule: MovieSchedule };
};

export const MovieScheduleForm: React.FC<MovieScheduleFormProps> = ({
  initialData,
}) => {
  const token = getCookie("token");
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const {
    isLoading: movieQueryLoading,
    error: movieError,
    data: movieData,
  } = useQuery({
    queryKey: ["movieData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/movies`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return data.data as IMovie[];
    },
  });

  const {
    isLoading: screenQueryLoading,
    error: screenError,
    data: screenData,
  } = useQuery({
    queryKey: ["screenData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/screens`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return data.data as Screen[];
    },
  });

  const title = initialData ? "Edit MovieSchedule" : "Create MovieSchedule";
  const description = initialData
    ? "Edit a MovieSchedule."
    : "Add a new MovieSchedule";
  const toastMessage = initialData
    ? "MovieSchedule updated."
    : "MovieSchedule created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CreateMovieSchedule>({
    resolver: zodResolver(CreateMovieScheduleSchema),
    defaultValues: {
      ...initialData,
      startTm: initialData?.startTm + "",
      endTm: initialData?.endTm + "",
    } || {
      movieId: "",
      screenId: "",
      startTm: "",
      endTm: "",
    },
  });

  const { mutate: createAndUpdateMovieSchedule, isLoading } = useMutation({
    mutationFn: async (formData: CreateMovieSchedule) => {
      const payload = {
        ...formData,
        startTm: parseISO(formData.startTm),
        endTm: parseISO(formData.endTm),
      };
      if (initialData) {
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/movie-schedules/${params.movieScheduleId}`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        toast({
          title: "Success",
          description: toastMessage,
          variant: "default",
        });
        return data as CreateAndUpdateMovieScheduleResponse;
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/movie-schedules`,
          payload,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        toast({
          title: "Success",
          description: toastMessage,
          variant: "default",
        });
        return data as CreateAndUpdateMovieScheduleResponse;
      }
    },
    onSuccess: () => {
      router.refresh();
      return router.push("/admin/movie-schedules");
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

  const { mutate: deleteMovieSchedule, isLoading: deleteLoading } = useMutation(
    {
      mutationFn: async () => {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/movie-schedules/${params.movieScheduleId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      },
      onSuccess: () => {
        setOpen(false);
        router.refresh();
        router.push("/admin/movie-schedules");
        toast({
          title: "Success",
          description: "MovieSchedule deleted.",
          variant: "default",
        });
      },
      onError: (err) => {
        setOpen(false);
        if (err instanceof AxiosError) {
          if (
            err.response?.status === 422 ||
            err.response?.status === 404 ||
            err.response?.status === 401
          ) {
            return toast({
              title: "Error",
              description: err.message,
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
    }
  );

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteMovieSchedule}
        loading={deleteLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            createAndUpdateMovieSchedule(data)
          )}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="movieId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>영화</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="영화를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {movieData?.map((movie: IMovie) => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="screenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상영관</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="상영관을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {screenData?.map((screen: Screen) => (
                      <SelectItem key={screen.id} value={screen.id}>
                        {screen.screenNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select End Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
