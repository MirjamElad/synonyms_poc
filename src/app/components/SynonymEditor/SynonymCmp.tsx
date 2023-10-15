import { DataType } from '../../client-state/data';
import { Word } from './Word';
import { InputWord } from './InputWord';
import { ActionBar } from './ActionBar';
import { trigger } from 'adax';
import { removeSynonym, addSynonym } from '../../client-state/facade';

const deleteIcon = (word: string) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 hover:text-gray-300" viewBox="0 0 20 20" fill="currentColor"
    onClick={() => trigger(removeSynonym, {word})}>
    <path fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd" />
  </svg>
  );

const ServerSynonyms = ({mainSynonym, synonymsList}:{mainSynonym: string, synonymsList: string[]}) => (
  synonymsList?.map((synonym, index) => (
    synonym !== mainSynonym ? <Word icon={deleteIcon} key={synonym} word={synonym} index={index} /> : null
  ))
);

const AddedSynonyms = ({addedSynonyms}:{addedSynonyms: string[]}) => (
  addedSynonyms?.map((synonym) => (
    <Word icon={deleteIcon} key={synonym} word={synonym} isNewWord={true} />
  ))
);

const undoIcon = (word: string) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 hover:text-gray-300" viewBox="0 0 20 20" fill="currentColor"
    onClick={() => trigger(addSynonym, {word})}>
    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
  </svg>
);

const DeletedSynonyms = ({deletedSynonyms}:{deletedSynonyms: string[]}) => deletedSynonyms.length ? (
  <>
    <div className="mt-3 px-1 ">Synonyms to delete:</div>
      <div className="pb-11 mb-1 flex flex-wrap  rounded-lg bg-slate-100 border border-solid border-red-300 p-3">
        <br />
        {deletedSynonyms?.map((synonym, index) => (
          <Word icon={undoIcon} key={synonym} word={synonym} />
        ))}
    </div>
  </>
): null;


const legendStyle = "animate-fade-down animate-duration-200 animate-once text-xl capitalize px-2 bg-slate-100 border border-solid border-gray-300 rounded-lg font-bold text-gray-700 sm:text-2xl";

export const SynonymCmp = ({word, status, previousStatus, serverSynonyms, addedSynonyms, deletedSynonyms}: DataType) => {
  return word && status !== 'error' ? (
  <>
    <fieldset tabIndex={0} className="px-6 mt-3 pt-2 pb-11 mb-1 flex flex-wrap rounded-lg bg-slate-100 border border-solid border-gray-300 p-3">
      <legend  key={word}  className={word?.length ? `${legendStyle}` : ''}>{word}</legend>
      <ServerSynonyms mainSynonym={word} synonymsList={serverSynonyms} />
      <AddedSynonyms addedSynonyms={addedSynonyms} />
      <InputWord previousStatus={previousStatus} status={status}/>      
    </fieldset>
    <DeletedSynonyms deletedSynonyms={deletedSynonyms} />
    <ActionBar status={status} />
  </>
  ) : null;
}