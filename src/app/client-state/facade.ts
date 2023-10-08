import { addRule, trigger } from 'adax';
import { data } from './data';
import { SynonymsPerWord } from '../api/synonyms/[wordList]/route';
import { POST, GET } from '../lib/apiClient';

export const getAllData = (_: any = null, stores = { data }) => data;

export const searchWord = ({word}: {word: string}, stores = { data }) => {
    data.word = word;
    data.currentStatus = 'searching';
    data.synonyms = [];
    data.unsavedSynonyms= [];
    GET(word, (synonymsPerWord: SynonymsPerWord) => trigger(setSynonyms, synonymsPerWord), console.error);
}

export const addTempSynonym = ({word}: {word: string}, stores = { data }) => {
    console.info(`'addTempSynonym::stores [${stores}]'`, stores);
    if (!(data.synonyms?.includes(word) || data.unsavedSynonyms?.includes(word))) {
        data.unsavedSynonyms.push(word);        
    } else {
        console.info(`NNNNOOOO addTempSynonym::stores [${stores}]'`, stores);
    }
}

export const saveSynonym = (_:any, stores = { data }) => {
    console.info(`'saveSynonym::stores [${stores}]'`, stores);
    const listToSave =  data.unsavedSynonyms.filter((w) => !data.synonyms?.includes(w));
    if (listToSave?.length) {
        const initalWord = data.word;
        data.word = '';
        data.currentStatus = 'searching';
        data.synonyms = [];
        data.unsavedSynonyms= [];
        POST({setSynonyms: [initalWord, ...listToSave].join(',')}, console.log, console.error);
    } else {
        console.info(`NNNNOOOO saveSynonym::stores::listToSave [${listToSave}]'`, listToSave);
    }
}

export const setSynonyms = (synonymsPerWord: SynonymsPerWord, stores = { data }) => {
    data.currentStatus = 'searchingDone';
    data.synonyms = (synonymsPerWord.$values as string[][])[(synonymsPerWord[data.word] as number)];
    data.unsavedSynonyms= [];
}


const loadRules = () => {
    //Whenever we setSynonyms any component subscribing to getData re-renders without exception!
    addRule({writeFn: setSynonyms, queryFn: getAllData});    
    addRule({writeFn: addTempSynonym, queryFn: getAllData});    
    addRule({writeFn: saveSynonym, queryFn: getAllData});    
};
  
loadRules();
  