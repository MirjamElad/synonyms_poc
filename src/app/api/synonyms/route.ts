import synonymManager from "../../lib/synonymsManager";

//TODO: For persistence, investigate: https://github.com/spencerparkin/ParkinDSF

export async function POST(req: Request) {
    const { synonyms, deleteSynonyms } = await req.json();
    const newSynonyms = synonyms?.split(',');
    const oldSynonyms = deleteSynonyms?.split(',') || [];
    if (synonyms?.length) {
        synonymManager.setSynonyms(newSynonyms, deleteSynonyms?.split(','));
        const res = synonymManager.getSynonymsPerWord([newSynonyms[0]]);
        return Response.json(res);
    }
    return Response.json({ nothing: true });
}