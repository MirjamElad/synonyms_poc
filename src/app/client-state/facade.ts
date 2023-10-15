import { addRule, trigger } from 'adax';
import { data } from './data';
import { SynonymsPerWord } from '../api/synonyms/[wordList]/route';
import { POST, GET } from '../lib/apiClient';

export const getAllData = (_: any = null, stores = { data }) => data;

export const searchWord = ({word}: {word: string}, stores = { data }) => {
    data.word = word;
    data.status = 'searching';
    GET(
        word, 
        (synonymsPerWord: SynonymsPerWord) => trigger(setSynonyms, synonymsPerWord), 
        (message: string) => trigger(setError, {message})
    ).catch((message: string) => trigger(setError, {message}));
}

const setSynonyms = (synonymsPerWord: SynonymsPerWord, stores = { data }) => {
    data.status = 'ready';
    data.serverSynonyms = (synonymsPerWord.$values as string[][])[(synonymsPerWord[data.word] as number)];
}

export const addSynonym = ({word}: {word: string}, stores = { data }) => {
    if (!(data.serverSynonyms?.includes(word) || data.addedSynonyms?.includes(word))) {
        data.status = 'edited';
        if (data.deletedSynonyms?.includes(word)) {
            data.deletedSynonyms = data.deletedSynonyms.filter((w) => w !== word);
            data.serverSynonyms.push(word); 
        } else {
            data.addedSynonyms.push(word);
        }      
    }
}
export const removeSynonym = ({word}: {word: string}, stores = { data }) => {
    if(data.serverSynonyms?.includes(word)) {
        data.status = 'edited';
        data.serverSynonyms = data.serverSynonyms.filter((w) => w !== word);
        data.deletedSynonyms.push(word);
    } else if (data.addedSynonyms?.includes(word)) {
        data.addedSynonyms = data.addedSynonyms.filter((w) => w !== word);
        if (data.addedSynonyms.length || data.deletedSynonyms.length) {
            data.status = 'edited';
        } else {
            data.status = 'ready';
        }
    }
}

export const saveSynonym = (_:any, stores = { data }) => {
    const listToSave =  data.addedSynonyms.filter((w) => !data.serverSynonyms?.includes(w)) || [];
    const listToDelete =  data.deletedSynonyms?.filter((w) => !(data.serverSynonyms?.includes(w) || data.addedSynonyms?.includes(w))) || [];
    if (listToSave?.length || listToDelete.length) {
        data.status = 'posting';
        POST(
            {
                synonyms: [data.word, ...listToSave].join(','),
                deleteSynonyms: listToDelete.join(',')
            }, 
            (synonymsPerWord: SynonymsPerWord) => trigger(setSynonyms, synonymsPerWord) , 
            (message: string) => trigger(setError, {message})
        ).catch((message: string) => trigger(setError, {message}));;
    }
}

export const discard = (_:any, stores = { data }) => {
    data.deletedSynonyms?.forEach((dw) => {
        data.serverSynonyms.push(dw);
    })
    data.status = 'ready';
}

export const setError = ({message}: {message: string}, stores = { data }) => {
    data.errorMessage = message;
    data.status = 'error';
}

export const hideError = (_:any, stores = { data }) => {
    data.revertStatus();
}



const loadRules = () => {
    // In this sample case we have a single read function getAllData that is re-run on every one of the below mutators!
    // any view "subscribing" to getAllData will automatically re-render (in our case the "main" widget!)removeSynonym
    addRule({writeFn: setSynonyms, queryFn: getAllData});    
    addRule({writeFn: addSynonym, queryFn: getAllData});   
    addRule({writeFn: removeSynonym, queryFn: getAllData});    
    addRule({writeFn: saveSynonym, queryFn: getAllData});    
    addRule({writeFn: discard, queryFn: getAllData});    
    addRule({writeFn: setError, queryFn: getAllData});    
    addRule({writeFn: hideError, queryFn: getAllData});    
};
  
loadRules();
  