"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const passwordRegex = new RegExp(/^[a-zA-Z0-9]*$/);
const SignInValidator = z.object({
  email: z.string().email({
    message: "이메일 형식에 맞지 않습니다.",
  }),
  password: z
    .string()
    .min(4, { message: "최소 4글자입니다." })
    .max(20, { message: "최대 20글자입니다." })
    .regex(passwordRegex, {
      message: "비밀번호는 영어 혹은 숫자만 허용됩니다.",
    }),
});

type SignInCredentials = z.infer<typeof SignInValidator>;

type SignInResponse = {
  ok: boolean;
  status: number;
  msg: string;
  data: { accessToken: string };
};

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignInCredentials>({
    resolver: zodResolver(SignInValidator),
  });

  const { mutate: signInHandler, isLoading } = useMutation({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      const payload: SignInCredentials = {
        email,
        password,
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        payload
      );

      return data as SignInResponse;
    },
    onSuccess: (data) => {
      setCookie("token", data.data.accessToken);
      return router.push("/");
    },
    onError: (err) => {
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

  const loginWithGoogle = async () => {
    // try {
    //   await signIn("google");
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "There was an error logging in with Google",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <>
      <form
        className={cn("flex mb-3 flex-col space-y-5 w-full", className)}
        onSubmit={handleSubmit((data) => signInHandler(data))}
        {...props}
      >
        <Label className="text-left font-bold" htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          placeholder="이메일"
          className="pl-6"
          size={32}
          {...register("email")}
        />
        {errors?.email && (
          <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
        )}

        <Label className="text-left font-bold" htmlFor="password">
          비밀번호
        </Label>
        <Input
          id="password"
          placeholder="비밀번호"
          className="pl-6"
          size={32}
          {...register("password")}
        />
        {errors?.password && (
          <p className="px-1 text-xs text-red-600">{errors.password.message}</p>
        )}

        <Button isLoading={isLoading} type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>

      <p className="text-sm max-w-xs mx-auto my-3">또는</p>
      <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        variant="outline"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.kakao className="h-4 w-4 mr-2" />}
        카카오 로그인
      </Button>
    </>
  );
};

export default UserAuthForm;
