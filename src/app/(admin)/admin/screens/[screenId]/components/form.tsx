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
import { Separator } from "@/components/ui/Separator";
import { useToast } from "@/hooks/use-toast";
import { CreateScreen, CreateScreenSchema, Screen } from "@/types/screen";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

interface ScreenFormProps {
  initialData: Screen | null;
}

type CreateAndUpdateScreenResponse = {
  ok: boolean;
  status: number;
  msg: string;
  data: { screen: Screen };
};

export const ScreenForm: React.FC<ScreenFormProps> = ({ initialData }) => {
  const token = getCookie("token");
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Screen" : "Create Screen";
  const description = initialData ? "Edit a Screen." : "Add a new Screen";
  const toastMessage = initialData ? "Screen updated." : "Screen created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CreateScreen>({
    resolver: zodResolver(CreateScreenSchema),
    defaultValues: {
      ...initialData,
      screenNum: initialData?.screenNum + "",
      seatAmt: initialData?.seatAmt + "",
    } || {
      screenNum: 0,
      seatAmt: 0,
    },
  });

  const { mutate: createAndUpdateScreen, isLoading } = useMutation({
    mutationFn: async (formData: CreateScreen) => {
      const payload = {
        screenNum: +formData.screenNum,
        seatAmt: +formData.seatAmt,
      };
      if (initialData) {
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/screens/${params.screenId}`,
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
        return data as CreateAndUpdateScreenResponse;
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/screens`,
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
        return data as CreateAndUpdateScreenResponse;
      }
    },
    onSuccess: () => {
      router.refresh();
      return router.push("/admin/screens");
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

  const { mutate: deleteScreen, isLoading: deleteLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/screens/${params.screenId}`,
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
      router.push("/admin/screens");
      toast({
        title: "Success",
        description: "Screen deleted.",
        variant: "default",
      });
    },
    onError: (err) => {
      setOpen(false);
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
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteScreen}
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
          onSubmit={form.handleSubmit((data) => {
            createAndUpdateScreen(data);
          })}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="screenNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상영관 번호</FormLabel>
                <FormControl>
                  <Input type="number" disabled={isLoading} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seatAmt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>좌석 수</FormLabel>
                <FormControl>
                  <Input type="number" disabled={isLoading} {...field} />
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
