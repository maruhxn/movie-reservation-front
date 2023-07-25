"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { IMovie, MovieSchema } from "@/types/movie";

export function MovieAddForm() {
  const form = useForm<IMovie>({
    resolver: zodResolver(MovieSchema),
    mode: "onChange",
  });

  function onSubmit(data: IMovie) {
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="제목" {...field} />
              </FormControl>
              <FormDescription>영화 제목을 입력하세요.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adult"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={() => field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>만 19세 이상 등급</FormLabel>
                <FormDescription>성인물 여부 확인</FormDescription>
              </div>
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="original_language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>오리지널 언어</FormLabel>
              <FormControl>
                <Input placeholder="오리지널 언어" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="original_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>오리지널 제목</FormLabel>
              <FormControl>
                <Input placeholder="오리지널 제목" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>줄거리</FormLabel>
              <FormControl>
                <Input placeholder="줄거리" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="popularity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>인기도</FormLabel>
              <FormControl>
                <Input placeholder="인기도" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
