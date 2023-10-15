import { KeyboardEvent, useState, useRef, useEffect } from 'react';
import { Status } from '../client-state/data';
import { trigger } from 'adax';
import { searchWord } from '../client-state/facade';

const hasFocus = ({status, previousStatus}: {status?: Status, previousStatus?: Status | undefined}) => {
    return (status === 'initial' || (status === 'ready'  && ( previousStatus == 'posting' ||  previousStatus == 'edited')))
}
const enterWordMessage = "Write your word then hit enter";
const finishEditingMessage = "You need to first save or discard your changes before entring a new word";

export const SearchBox = ({status, previousStatus}: {status?: Status, previousStatus?: Status | undefined}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [word, setWord] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWord(e.target.value.replace(/[^a-zA-Z\s-]/gi, ''));
        e.preventDefault();
    };
    
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e?.key === 'Enter' || e?.code === 'Enter') {
            e.preventDefault();
            onSearchHit(undefined);
        }
    };
    
    const onSearchHit = (e: React.MouseEvent<HTMLElement> | undefined) => {
        if (e) e?.preventDefault();
        if (!word?.trim()) return;
        trigger(searchWord, {word: word?.trim().toLowerCase()});
        setWord('');
    };
    
    useEffect(() => {
        if (inputRef?.current && !word && hasFocus({status, previousStatus})) {
            inputRef.current.focus();
        }
    }, [status, previousStatus]);
    
    const inputPlaceholderMessage = (status === 'edited') ? finishEditingMessage : enterWordMessage;

    return (
        <>
            <p className="my-2 text-gray-600">Pick a word to get or set synonyms for</p>
            <div className="relative ">
                <span className="absolute inset-y-0 left-1 flex items-center">
                    <button onClick={onSearchHit}  className="p-1 focus:outline-none focus:shadow-outline">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                            className="w-6 h-6"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </span>
                <input
                    ref={inputRef}
                    disabled={(status === 'edited' || status === 'error')}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    value={word}
                    autoFocus
                    name="Synonyms"
                    type="search" 
                    className="h-10 w-5/6 px-2 rounded-md border-2 border-slate-300 pl-8 pr-2 py-3"
                    placeholder={inputPlaceholderMessage}
                    aria-label={inputPlaceholderMessage}
                    autoComplete="off" 
                />
            </div>
        </>  
    );
}