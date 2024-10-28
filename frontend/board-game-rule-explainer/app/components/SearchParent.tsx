'use client';
import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Searchbar, SearchResults } from './Searchbar';
import BoardGameCard from './BoardGameCard';
import BoardGameCardGrid from './BoardGameCardGrid';

interface SearchContextType {
  searchResults: string[];
}
const SearchContext = createContext<SearchContextType>({
  searchResults: [],
});
export default function SearchParent(props: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleSearchResults = (results: string[]) => {
    setSearchResults(results);
  };
  const searchParams = props.searchParams;
  const query = searchParams?.query;
  const currentPage = searchParams?.page;
  return (
    <SearchContext.Provider value={{ searchResults }}>
      <Searchbar onResultsChange={handleSearchResults} />
      <BoardGameCardGrid games={searchResults} />
    </SearchContext.Provider>
  );
}
