export type status = 'initial' | 'searching' | 'searchingDone' | 'editingSynonyms'  | 'adding' | 'addingDone' | 'error';
export type DataType = {
    word: string;
    currentStatus: status;
    synonyms: string[];
    unsavedSynonyms: string[];
}
export const data: DataType = {
    word: '',
    currentStatus: 'initial',
    synonyms: [],
    unsavedSynonyms: [],
};