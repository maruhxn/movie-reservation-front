"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const phoneRegex = new RegExp(/^\d{3}\d{3,4}\d{4}$/);
const passwordRegex = new RegExp(/^[a-zA-Z0-9]*$/);
const SignUpValidator = z.object({
  email: z.string().email({
    message: "이메일 형식에 맞지 않습니다.",
  }),
  name: z
    .string()
    .min(3, { message: "최소 3글자입니다." })
    .max(15, { message: "최대 15글자입니다." }),
  phone: z
    .string()
    .regex(phoneRegex, { message: "유효하지 않은 전화번호입니다." }),
  password: z
    .string()
    .min(4, { message: "최소 4글자입니다." })
    .max(20, { message: "최대 20글자입니다." })
    .regex(passwordRegex, {
      message: "비밀번호는 영어 혹은 숫자만 허용됩니다.",
    }),
});

type SignUpCredentials = z.infer<typeof SignUpValidator>;

type SignUpResponse = {
  ok: boolean;
  status: number;
  msg: string;
};

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignUpCredentials>({
    resolver: zodResolver(SignUpValidator),
  });

  const { mutate: signUpHandler, isLoading } = useMutation({
    mutationFn: async ({ email, name, password, phone }: SignUpCredentials) => {
      const payload = {
        email,
        name,
        password,
        phone,
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth`,
        payload
      );

      return data as SignUpResponse;
    },
    onSuccess: (data) => {
      return router.push("/sign-in");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 422) {
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
    <div>
      <form
        className={cn("flex mb-3 flex-col space-y-5 w-full", className)}
        onSubmit={handleSubmit((data) => signUpHandler(data))}
      >
        <Label className="text-left font-bold" htmlFor="name">
          이름
        </Label>
        <Input
          id="name"
          placeholder="이름"
          className="pl-6"
          size={32}
          {...register("name")}
        />
        {errors?.name && (
          <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
        )}

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

        <Label className="text-left font-bold" htmlFor="phone">
          전화번호
        </Label>
        <Input
          id="phone"
          placeholder="전화번호"
          className="pl-6"
          size={32}
          {...register("phone")}
        />
        {errors?.phone && (
          <p className="px-1 text-xs text-red-600">{errors.phone.message}</p>
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

        <Button type="submit">Submit</Button>
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
    </div>
  );
};

export default UserAuthForm;
