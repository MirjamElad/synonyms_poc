import { SearchBox } from './components/SearchBox';
import { Guide } from './components/Guide';
import { WordList } from './components/WordList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-4 lg:p-24">      
      <div
        className="w-full my-8 p-8 items-center bg-white rounded-2xl shadow-xl overflow-hidden sm:max-w-4xl hover:shadow-xl">
        <h1 className="mr-2 text-2xl text-gray-800 font-bold sm:text-4xl">Synonyms</h1>
        <SearchBox />  
        <Guide />
        <WordList />
      </div>
    </main>
  )
}
