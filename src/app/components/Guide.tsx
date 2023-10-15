import { Status } from '../client-state/data';
import { trigger } from 'adax';
import { hideError } from '../client-state/facade';

const perStatusProps = (status: Status, errorMessage?: string) => {
  switch(status) {
    case 'ready':
      return {
        bgColor: 'bg-gray-100',
        message: <>
            You may add a synonym by typing it in the 
              <span className="mx-1 p-1 bg-blue-200 text-sm font-medium rounded-xl border-2 border-gray-500">blue</span> 
            input field below <i>(validate by pressing enter or a comma )</i>
          </>
      };
      break;
      case 'edited':
        return {
          bgColor: 'bg-blue-100',
          message: <>When done editing, click save. Alternatively, click discard to undo your editions</>
        };
        break;
      case 'error':
        return {
          bgColor: 'bg-red-200',
          message: (
            <div className="flex justify-between px-4 "><div>Unexpected Error: <span className="text-xs">{""+errorMessage}</span></div>
              <button className='bg-red-500 text-white p-2 px-4 rounded'
              onClick={() => trigger(hideError, {})}>OK</button>
            </div>
          )
        };
        break;
    default: 
      return {
        bgColor: undefined,
        message: undefined
      };
  }
}


export const Guide = ({status, errorMessage}: {status: Status, errorMessage?: string}) => {
  const { bgColor, message } = perStatusProps(status, errorMessage);
  return bgColor && message ? (
      <p key={status} className={`p-2 mt-2 ${bgColor} animate-rotate-x animate-delay-400 animate-once`}>
        {message}
      </p> 
  ) : null;
}