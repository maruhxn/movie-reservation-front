import Link from "next/link";
import UserSignInForm from "./UserSignInForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
        <p className="text-sm max-w-xs mx-auto">이메일로 로그인</p>

        <UserSignInForm />

        <p className="px-8 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            href="/sign-up"
            className="hover:text-brand text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
