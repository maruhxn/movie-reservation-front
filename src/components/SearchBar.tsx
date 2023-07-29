"use client";

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { IMovie } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/search?q=${input}`
      );
      return data.data as (IMovie & {
        _count: {
          movieSchedules: number;
        };
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(async () => {
    await refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search movies..."
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 && (
            <CommandGroup heading="영화">
              {
                // @ts-ignore
                queryResults?.map((movie) => (
                  <CommandItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      router.push(`/${movie.id}`);
                      router.refresh();
                    }}
                    key={movie.id}
                    value={movie.title}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <a href={`/${movie.id}`}>{movie.title}</a>
                  </CommandItem>
                ))
              }
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
