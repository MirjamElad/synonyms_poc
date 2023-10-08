export async function GET(request: Request, { params }: { params: { [key: string]: string } }) {
    return Response.json({ "example": "/api/synonyms/clean" });
}