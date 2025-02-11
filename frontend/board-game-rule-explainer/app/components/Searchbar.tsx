"use client";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export interface SearchResults {
  message: string[];
}

export interface SearchbarProps {
  onResultsChange: (results: string[]) => void;
}

export function Searchbar({ onResultsChange }: SearchbarProps) {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    message: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    onResultsChange(searchResults.message);
  }, [searchResults, onResultsChange]);
  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue]);
  const handleSearch = useDebouncedCallback(async (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);

      try {
        const response = await fetch(
          `http://192.168.2.35:8000/list/${encodeURIComponent(value)}`
        );
        const data: SearchResults = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput
        value={searchValue}
        onValueChange={setSearchValue}
        placeholder="Type a command or search..."
      />
      <CommandList></CommandList>
    </Command>
  );
}
