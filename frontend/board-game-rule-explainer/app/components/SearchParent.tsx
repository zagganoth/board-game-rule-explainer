'use client';
import React, { createContext } from 'react';
import { Searchbar } from './SearchbarHome';
import { BackgroundBeams } from '@/components/ui/background-beams';

interface SearchContextType {
  searchResults: { [key: string]: string };
}
const SearchContext = createContext<SearchContextType>({
  searchResults: {},
});
export default function SearchParent() {
  return (
    <div className="h-screen w-screen m-0 p-0 bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div>
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Search the internet
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to Board Game Wizard, the best board game teacher on the web.
          We provide reliable ways for you to get setup learning board games.
          Whether you&apos;re setting up for the first time or just need a
          refresher on the rules, or finer details, we've got you covered.
        </p>
        <Searchbar />
        <br />
      </div>
      <BackgroundBeams />
    </div>
  );
}
