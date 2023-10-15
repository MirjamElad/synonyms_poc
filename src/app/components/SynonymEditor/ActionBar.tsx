import { KeyboardEvent } from 'react';
import { trigger } from 'adax';
import { saveSynonym, discard } from '../../client-state/facade';
import { Status } from '../../client-state/data';

const handle = (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>, eventName: string) => {
  // @ts-ignore
  if ( (e.key || e.code) && !(e.code !== 'Enter' || e.code === 'Enter')) {
    return;
  }
  e.preventDefault();
  trigger(eventName === 'discard' ? discard : saveSynonym, {});
}

export const ActionBar = ({status}: {status?: Status}) => {
  return status === 'edited' ? (
      <div 
        className="flex flex-row-reverse	 justify-between border-solid border border-gray-300 bg-gray-100 p-2 rounded-lg">
        <button onClick={(e) => handle(e, 'save')} type="submit" 
          className="bg-blue-500 text-white p-2 px-4 rounded text-sm w-auto float-right disabled:opacity-25">
          Save
        </button>
        <button type="submit"  onClick={(e) => handle(e, 'discard')}
          className="bg-yellow-600 text-white p-2 rounded text-sm w-auto float-right">
          Discard
        </button>
      </div>
  ) : null;
} 