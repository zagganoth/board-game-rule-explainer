"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Searchbar } from "./Searchbar";
import BoardGameCardGrid from "./BoardGameCardGrid";
import { useDebouncedCallback } from "use-debounce";
import { BackgroundBeams } from "@/components/ui/background-beams";

interface SearchResults {
  message: { [key: string]: string };
}

export default function SearchParent() {
  const [searchResults, setSearchResults] = useState<{ [key: string]: string }>(
    {}
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);
  const changeSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const handleSearch = useDebouncedCallback(async (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get("query") && !value) {
      value = params.get("query")!;
    }
    if (value) {
      params.set("query", value);

      try {
        const response = await fetch(
          `http://192.168.2.35:8000/list/${encodeURIComponent(value)}`
        );
        const data: SearchResults = await response.json();
        setSearchResults(data.message);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="h-screen w-screen m-0 p-0 bg-neutral-950 flex-col items-center justify-center antialiased">
      <div className="relative z-10">
        <Searchbar onResultsChange={changeSearchValue} />
        <br />
        <BoardGameCardGrid games={searchResults} />
      </div>
      <BackgroundBeams />
    </div>
  );
}
