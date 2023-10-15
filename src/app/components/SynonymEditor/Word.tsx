'use client';


const baseStyle = "flex flex-wrap pl-4 pr-2 py-2 m-1 justify-between items-center text-sm font-medium rounded-xl cursor-pointer text-gray-200 hover:text-gray-100"
const computeStyles = (index:number | undefined, isNewWord?:boolean) => {
  const bg = isNewWord ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-500 hover:bg-slate-600';
  if (index === undefined) {
    return `${baseStyle} ${bg}`;
  }
  const duration = Math.max(500, (index+1) * 100);
  return  `animate-jump-in animate-duration-${duration} animate-once ${baseStyle} ${bg}`;
}

export const Word = ({icon, word, index, isNewWord}: {icon: (word: string) => JSX.Element, word: string, index?:number, isNewWord?:boolean}) => {
  return (
    <span
      tabIndex={0}
      key={word}
      className={computeStyles(index, isNewWord)}>
      {word}
      {icon(word)}
    </span>
  );
}
