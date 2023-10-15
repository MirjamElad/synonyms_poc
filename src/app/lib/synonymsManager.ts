class SynonymManager {

    private synonyms: Map<String, Set<string>>;

    private formatWord(word: string): string {
        return word.trim().toLowerCase();
    };

    private validWord(word: string): boolean {
        return !!(word.length && word.match(/^[a-z\u00E0-\u024F]+(?:[-\s][a-z\u00E0-\u024F]+)*$/i));
    }
  
    constructor() {
      this.synonyms = new Map(); 
    };

    clear(): void {
        this.synonyms.clear();
    };

    // NB: implemented to be read efficient as opposed to write efficient!
    setSynonyms(wordList: string[], toDeleteList: string[] = []): void {
        toDeleteList = toDeleteList.map(this.formatWord).filter(this.validWord);
        wordList = wordList.map(this.formatWord).filter(this.validWord).filter((w) => !toDeleteList.includes(w));
        if (wordList.length) {
            toDeleteList.forEach((dw) => {
                if (this.synonyms.has(dw)) {
                    //Transivity means removing any existing synonym X from Y is removing it from the whole
                    this.synonyms.delete(dw);
                }
            })
            let largestSet = new Set<string>([]);
            wordList.forEach(word => {
                if (!this.synonyms.has(word)) {
                    this.synonyms.set(word, new Set([word]));
                } else {
                    const currentSet = this.synonyms.get(word)!;
                    for(const w of toDeleteList) {
                        currentSet.delete(w);
                    }
                    if (currentSet.size > largestSet.size) {
                        largestSet = currentSet;
                    }
                }
            });
            largestSet = !!largestSet.size ? largestSet : this.synonyms.get(wordList[0])!;
            wordList.forEach(word => {
                const wordSynonymsSet = this.synonyms.get(word)!;
                if (largestSet !== wordSynonymsSet) {
                    // Merging implemented to be read efficient as opposed to write efficient!
                    wordSynonymsSet.forEach(word => {
                        largestSet.add(word);
                        this.synonyms.set(word, largestSet);
                    });
                    //Cleared to be garbage collected
                    wordSynonymsSet.clear();
                  }
            });
        }      
    };
    
    getSynonymsOfWord(word: string): string[] {
        word = this.formatWord(word);
        return this.synonyms.has(word) ? Array.from(this.synonyms.get(word)!) : [];
    }
    
    getSynonymsPerWord(wordList: string[]): {
        [key: string]: number | string[][]
    } {
        const synPerWord: {
            [key: string]: number | string[][]
        } = {$values: []};
        const visitedSets:Set<string>[] = [];
        wordList?.map(this.formatWord)?.filter((w) => this.synonyms.has(w))?.forEach(word => {
            const wordSynonyms = this.synonyms.get(word)!;
            let idxOfWordSynonyms = visitedSets.indexOf(wordSynonyms);
            if (idxOfWordSynonyms === -1) {
                visitedSets.push(wordSynonyms);
                idxOfWordSynonyms = visitedSets.length - 1;
                (synPerWord!.$values as string[][])!.push(Array.from(wordSynonyms))
            }
            synPerWord[word] = idxOfWordSynonyms;
        });
        return (synPerWord!.$values as string[][]).length ? synPerWord : { $values: []};
    }
  }

//Export as singleton!
const synonymManager = new SynonymManager();

synonymManager.setSynonyms(["clean", "wash"]);
export default synonymManager;
  