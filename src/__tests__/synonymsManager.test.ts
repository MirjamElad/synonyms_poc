import synonymManager from "../app/lib/synonymsManager";

describe("synonymManager test", () => {

  it("Setting a group of words as each other's synonyms works as expected!", () => {
    synonymManager.clear();
    synonymManager.setSynonyms(["clean", "wash", "undirt"]);
    const synList_of_clean = synonymManager.getSynonymsOfWord("clean");
    const synList_of_wash = synonymManager.getSynonymsOfWord("wash");
    const synList_of_undirt = synonymManager.getSynonymsOfWord("undirt");
    expect(synList_of_clean).toEqual(["clean", "wash", "undirt"]);
    expect(synList_of_wash).toEqual(["clean", "wash", "undirt"]);
    expect(synList_of_undirt).toEqual(["clean", "wash", "undirt"]);
  });

  it("Removing a group of words as each other's synonyms works as expected!", () => {
    synonymManager.clear();
    synonymManager.setSynonyms(["clean", "wash", "undirt"]);
    synonymManager.setSynonyms(["clean", "wash-up"], ["undirt"]);
    const synList_of_clean = synonymManager.getSynonymsOfWord("clean");
    const synList_of_wash = synonymManager.getSynonymsOfWord("wash");
    const synList_of_wash_up = synonymManager.getSynonymsOfWord("wash-up");
    const synList_of_undirt = synonymManager.getSynonymsOfWord("undirt");
    expect(synList_of_clean).toEqual(["clean", "wash", "wash-up"]);
    expect(synList_of_wash).toEqual(["clean", "wash", "wash-up"]);
    expect(synList_of_wash_up).toEqual(["clean", "wash", "wash-up"]);
    expect(synList_of_undirt).toEqual([]);
  });

  it("setSynonyms is transitive", () => {
    synonymManager.clear();
    synonymManager.setSynonyms(["clean", "wash"]);
    synonymManager.setSynonyms(["wash", "undirt"]);
    const synList_of_clean = synonymManager.getSynonymsOfWord("clean");
    const synList_of_wash = synonymManager.getSynonymsOfWord("wash");
    const synList_of_undirt = synonymManager.getSynonymsOfWord("undirt");
    expect(synList_of_clean).toEqual(["clean", "wash", "undirt"]);
    expect(synList_of_wash).toEqual(["clean", "wash", "undirt"]);
    expect(synList_of_undirt).toEqual(["clean", "wash", "undirt"]);
  });

  it("synonymManager sets synonyms lower cased and trims any white spaces", () => {
    synonymManager.clear();
    synonymManager.setSynonyms([" cleAn", "WAsH ", " unDirt "]);
    const synList_of_clean = synonymManager.getSynonymsOfWord("clean");
    expect(synList_of_clean).toEqual(["clean", "wash", "undirt"]);
  });
  
  it("synonymManager only sets valid words", () => {
    synonymManager.clear();
    synonymManager.setSynonyms(["clean up", "wash-up",  "x445y", "alpha/beta!"]);
    const synList_of_clean = synonymManager.getSynonymsOfWord("clean up");
    expect(synList_of_clean).toEqual(["clean up", "wash-up"]);
  });

  it("synonymManager's internal structure is as expected! ", () => {
    synonymManager.clear();

    synonymManager.setSynonyms(["clean", "wash"]);
    synonymManager.setSynonyms(["wash", "undirt"]);

    synonymManager.setSynonyms(["dirty", "unwashed"]);
    synonymManager.setSynonyms(["dirty", "uncleaned"]);

    const synonymsPerWord = synonymManager.getSynonymsPerWord([
      //Get all used synonyms
      "clean", "wash", "undirt", "dirty", "unwashed", "uncleaned",
      //Get some unused synonyms to make sure they are not returned!
      "XXX", "YYY"
    ]);

    //We only have 2 sets of synonyms!
    const $values: string[][] = (synonymsPerWord?.$values as string[][]);
    expect($values.length).toEqual(2);

    //All of "clean", "wash", "undirt" points to the same "set"!
    expect($values[0]).toEqual(["clean", "wash", "undirt"]);
    expect(synonymsPerWord?.clean).toEqual(0);
    expect(synonymsPerWord?.wash).toEqual(0);
    expect(synonymsPerWord?.undirt).toEqual(0);

    //All of "dirty", "unwashed", "uncleaned" points to the same "set"!
    expect($values[1]).toEqual(["dirty", "unwashed", "uncleaned"]);
    expect(synonymsPerWord?.dirty).toEqual(1);
    expect(synonymsPerWord?.unwashed).toEqual(1);
    expect(synonymsPerWord?.uncleaned).toEqual(1);
    
    //"XXX", "YYY" are not defined in synonyms at all!
    expect(synonymsPerWord?.XXX).toBeUndefined();
    expect(synonymsPerWord?.YYY).toBeUndefined();
  });

});

