export type Status = 'initial' | 'searching' | 'ready' | 'edited'  | 'posting' | 'error';
export type DataType = {
    word: string;
    status: Status;
    previousStatus?: Status | undefined;
    _currentStatus?: Status;
    revertStatus: () => void;
    errorMessage?: string | undefined;
    serverSynonyms: string[];
    addedSynonyms: string[];
    deletedSynonyms: string[];
}
export const data: DataType = {
    word: '',
    _currentStatus: 'initial',
    previousStatus: undefined,
    get status() {
        return this._currentStatus || 'initial';
    },
    set status(value: Status) {
        if (value === this._currentStatus) return;
        switch (value) {
            case 'initial':
                this.serverSynonyms = [];
                this.addedSynonyms= [];
                this.deletedSynonyms = [];
                this.word = '';
                break;
            case 'searching':
                this.serverSynonyms = [];
                this.addedSynonyms= [];
                this.deletedSynonyms = [];
                break;
            case 'ready':
                this.addedSynonyms= [];
                this.deletedSynonyms = [];
                break;
        }
        this.previousStatus = this._currentStatus;
        this._currentStatus = value;
    },
    revertStatus: () => {
        if (data.previousStatus) {
            const tmp = data.previousStatus;
            data.previousStatus = undefined;
            switch (tmp) {
                case 'searching':
                    data.serverSynonyms.length ? data.status = 'ready' : data.status = 'initial';
                    break;
                case 'posting':
                    data.status = 'edited';
                    break;
                default:
                    data.status = tmp;
            }
        } 
    },
    errorMessage: undefined,
    serverSynonyms: [],
    addedSynonyms: [],
    deletedSynonyms: []
};