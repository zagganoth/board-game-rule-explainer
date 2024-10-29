'use client';

import { useState } from 'react';
import Form from 'next/form';

export interface SearchResults {
  message: { [key: string]: string };
}

export interface SearchbarProps {
  onResultsChange: (results: {}) => void;
}

interface FormType extends HTMLFormElement {
  inputValue: HTMLInputElement;
}

export function Searchbar() {
  const [searchValue, setSearchValue] = useState('');


  return (
    <Form action="/search">
      <input
        className="rounded-lg border-2 w-full p-2 border-neutral-800 focus:ring text-neutral-700 focus:ring-teal-500 relative z-10 mt-4  bg-neutral-950 placeholder:text-neutral-700"
        value={searchValue}
        name="query"
        onChange={(value) => {
          console.log(value);
          setSearchValue(value.target.value);
        }}
        placeholder="Search for a boardgame..."
      ></input>
    </Form>
  );
}
