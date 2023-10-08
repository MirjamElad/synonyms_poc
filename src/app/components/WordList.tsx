'use client';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { trigger } from 'adax';
import { useSync } from 'adax-react';
import { getAllData } from '../client-state/facade';
import { status, DataType } from '../client-state/data';
import { addTempSynonym, saveSynonym } from '../client-state/facade';

const synonymStyle = "flex flex-wrap pr-2 py-2 m-1 justify-between items-center text-sm font-medium rounded-xl cursor-pointer bg-slate-500 text-gray-200 hover:bg-slate-600 hover:text-gray-100";
const fieldsetStyle = "cleanpx-2 mt-3 pt-2 pb-11 mb-3 flex flex-wrap rounded-lg bg-slate-100 border border-solid border-gray-300 p-3";
const legendStyle = "animate-fade-down animate-delay-200 animate-once text-xl capitalize px-2 bg-slate-100 border border-solid border-gray-300 rounded-lg font-bold text-gray-700 sm:text-2xl";
const inputStyle = "p-2 ml-1 mt-1 h-9 text-sm font-medium rounded-xl";

const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 hover:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd" />
    </svg>
  );

const Synonym = ({word, unsaved = false}: {word: string, unsaved?: boolean}) => {
  const classes = ` ${unsaved ? 'pl-4 ' : 'pl-2'} ${synonymStyle}`;
  return (
    <span tabIndex={unsaved ? 0 : undefined} 
      className={classes}>
      {word}
      {unsaved ? deleteIcon : null}
    </span>
  );
}

const SynonymAdder = ({word, currentStatus}: {word: string, currentStatus: status}) => {
  const spanRef = useRef<HTMLElement>(null);
  const [val, setVal] = useState("");
  const [width, setWidth] = useState(30);

  useEffect(() => {
    if (spanRef?.current?.offsetWidth) {
      setWidth(spanRef?.current?.offsetWidth + 20);
    } else {
      setWidth(30);
    }
  }, [val]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/[^a-zA-Z\s-]/gi, '');
    setVal(result.toLowerCase());
    e.preventDefault();
  }
  
  const onAddTempSynonym = () => {
    if (!val?.trim()) return;
    trigger(addTempSynonym, {word: val?.trim().toLowerCase()});
    setVal('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === ',' || e?.code === ',') {
      onAddTempSynonym();
    } else if (e?.key === 'Enter' || e?.code === 'Enter') {
      addTempSynonym({word: val?.trim().toLowerCase()});
      trigger(saveSynonym, {});
      setVal('');
    }
  };

  if (currentStatus === 'searchingDone' || currentStatus ===  'editingSynonyms') {
    return (
      <span style={{fontSize: '1em'}}>
        <span className="absolute opacity-0 whitespace-pre -z-50" ref={spanRef}>{val}</span>
        <input 
          onKeyPress={handleKeyPress} 
          tabIndex={0} type="text" style={{ width }} maxLength={45} autoFocus
          onChange={handleChange} value={val} className={inputStyle} placeholder="..." />
      </span>
    );
  } else {
    return null;
  }
}

export const WordList = () => {
  const { data : { word, currentStatus, synonyms, unsavedSynonyms }}: { data : DataType} = useSync(getAllData);
  return (
    <fieldset tabIndex={0} className={`${fieldsetStyle}`}>
      <legend  key={word}  className={word?.length ? `${legendStyle}` : ''}>{word}</legend>
      {synonyms?.map((word, index) => (
        <Synonym key={word} word={word} />
      ))}
      {unsavedSynonyms?.map((word, index) => (
        <Synonym key={word} word={word} unsaved={true} />
      ))}
      <SynonymAdder word={word} currentStatus={currentStatus} />
    </fieldset>
  );
}