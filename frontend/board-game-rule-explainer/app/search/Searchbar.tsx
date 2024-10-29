'use client';
import {
  CommandInput,
  CommandList,
  Command,
} from '@/components/ui/command';
import { useEffect, useState } from 'react';



export interface SearchbarProps {
  onResultsChange: (searchValue: string) => void;
}

export function Searchbar({ onResultsChange }: Readonly<SearchbarProps>) {

  const [searchValue, setSearchValue] = useState('');
  //const pathname = usePathname();
  //const { replace } = useRouter();

  useEffect(() => {
    onResultsChange(searchValue);
  }, [searchValue]);

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