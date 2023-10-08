import synonymManager from "../../../lib/synonymsManager";

export type SynonymsPerWord = { [key: string]: number | string[][] };

export async function GET(request: Request, { params }: { params: { wordList: string } }) {
    const wordList: string[] = params?.wordList?.split(',');
    const synonymsPerWord: SynonymsPerWord = synonymManager.getSynonymsPerWord(wordList);
    return Response.json(synonymsPerWord);
}
