"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Buttons = ({
  reservationId,
  token,
}: {
  reservationId: string;
  token: string;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: deleteReservation, isLoading: deleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reservations/${reservationId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    },
    onSuccess: () => {
      setOpen(false);
      router.push("/");
      toast({
        title: "Success",
        description: "Reservation deleted.",
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
  });
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteReservation}
        loading={deleteLoading}
      />
      <Button
        variant="destructive"
        className="w-32"
        onClick={() => setOpen(true)}
      >
        예매 취소
      </Button>
      <Button className="w-32" onClick={() => router.push("/")}>
        홈으로
      </Button>
    </>
  );
};

export default Buttons;
