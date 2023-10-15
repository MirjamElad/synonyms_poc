'use client';
import { useSync } from 'adax-react';
import { DataType } from './client-state/data';
import { getAllData } from './client-state/facade';
import { SearchBox } from './components/SearchBox';
import { SynonymCmp } from './components/SynonymEditor/SynonymCmp';
import { Guide } from './components/Guide';
import { Spinner } from './components/Spinner';

export default function Home() {
  const { data : { word, status, previousStatus, serverSynonyms, addedSynonyms, deletedSynonyms, errorMessage, revertStatus }}
    : { data : DataType} = useSync(getAllData);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-4 lg:p-24">      
      <div
        className="w-full my-8 p-8 items-center bg-white rounded-2xl shadow-xl overflow-hidden sm:max-w-4xl hover:shadow-xl">
        <h1 className="mr-2 text-2xl text-gray-800 font-bold sm:text-4xl">Synonyms</h1>
        <SearchBox previousStatus={previousStatus} status={status} />
        <Guide status={status} errorMessage={errorMessage} />
        <Spinner status={status} />
        <SynonymCmp
          word={word}
          status={status}
          previousStatus={previousStatus}
          revertStatus={revertStatus}
          serverSynonyms={serverSynonyms}
          addedSynonyms={addedSynonyms}
          deletedSynonyms={deletedSynonyms}
        />        
      </div>
    </main>
  )
}
