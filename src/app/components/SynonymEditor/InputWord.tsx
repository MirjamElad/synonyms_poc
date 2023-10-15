'use client';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { trigger } from 'adax';
import { addSynonym } from '../../client-state/facade';
import { Status } from '../../client-state/data';

const hasFocus = ({status, previousStatus}: {status?: Status, previousStatus?: Status | undefined}) => {
  return (status === 'ready'  && ( previousStatus == 'searching'))
}

export const InputWord = ({status, previousStatus}: {status: Status, previousStatus: Status | undefined}) => {
  const spanRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [val, setVal] = useState("");
  const [width, setWidth] = useState(30);

  useEffect(() => {
    if (spanRef?.current?.offsetWidth) {
      setWidth(spanRef?.current?.offsetWidth + 20);
    } else {
      setWidth(30);
    }
  }, [val]);

  useEffect(() => {
    if (inputRef?.current && hasFocus({status, previousStatus})) {
        inputRef.current.focus();
    }
}, [status, previousStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(/[^a-zA-Z\s-]/gi, '');
    setVal(result.toLowerCase());
    e.preventDefault();
  }
  
  const onAddSynonym = () => {
    if (!val?.trim()) return;
    trigger(addSynonym, {word: val?.trim().toLowerCase()});
    setVal('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === 'Enter' || e?.code === 'Enter' || e?.key === ',' || e?.code === ',') {
      onAddSynonym();
    }
  };

  return (
    <span style={{fontSize: '1em'}}>
        <span className="absolute opacity-0 whitespace-pre -z-50" ref={spanRef}>{val}</span>
        <input
          ref={inputRef}
          onKeyPress={handleKeyPress} 
          tabIndex={0} type="text" style={{ width }} maxLength={45} autoFocus placeholder="..."
          onChange={handleChange} value={val} 
          className="animate-fade-down animate-duration-200 animate-once p-2 ml-1 mt-1 h-9 text-sm font-medium rounded-xl border-2 border-gray-500 bg-blue-200" />
    </span>
);
}
