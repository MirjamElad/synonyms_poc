'use client';
import * as React from "react";
import { KeyboardEvent, useState } from 'react';
import { trigger } from 'adax';
import { searchWord } from '../client-state/facade';

export const SearchBox = () => {
    const [word, setWord] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWord(e.target.value);
        e.preventDefault();
    };
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e?.key === 'Enter' || e?.code === 'Enter') {
        onSearchHit();
      }
    };
    const onSearchHit = () => {
      if (!word?.trim()) return;
      trigger(searchWord, {word: word?.trim().toLowerCase()});
      setWord('');
    };
    return (
        <>
            <p className="my-2 text-gray-600">Write down below the word you want to get or set synonyms for, then hit enter</p>
            <div className="relative ">
                <span className="absolute inset-y-0 left-1 flex items-center">
                    <button onClick={onSearchHit}  className="p-1 focus:outline-none focus:shadow-outline">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                            className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </span>
                <input
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    value={word}
                    name="Synonyms"
                    type="search" 
                    className="h-10 w-5/6 px-2 rounded-md border-2 border-slate-300 pl-8 pr-2 py-3"
                    placeholder="Write your word then hit enter"
                    aria-label="Write your word then hit enter"
                    autoComplete="off" 
                />
            </div>
        </>  
    );
}