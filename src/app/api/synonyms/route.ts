import synonymManager from "../../lib/synonymsManager";

export async function POST(req: Request) {
    const { setSynonyms } = await req.json();
    const newSynonyms = setSynonyms?.split(',');
    if (setSynonyms?.length) {
        synonymManager.setSynonyms(newSynonyms);
        const res = synonymManager.getSynonymsPerWord([newSynonyms[0]]);
        return Response.json(res);
    }
    return Response.json({ nothing: true });
}