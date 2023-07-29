"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { MovieScheduleColumn } from "../page";

interface CellActionsProps {
  data: MovieScheduleColumn;
}

const CellActions: FC<CellActionsProps> = ({ data }) => {
  const token = getCookie("token");
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const { mutate: deleteMovieSchedule, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/movie-schedules/${data.id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    },
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Success",
        description: "Movie Schedule Deleted.",
        variant: "default",
      });
      return router.refresh();
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
  });

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Success",
      description: "MovieSchedule Id copied to clipboard.",
      variant: "default",
    });
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteMovieSchedule}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/movie-schedules/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
