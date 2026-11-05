from __future__ import annotations

from bugdiag.cleaning import DefectChunk, chunk_defect

MAX_QUERY_CHUNKS = 8


def query_chunks(title: str, description: str) -> list[DefectChunk]:
    """Bound embedding/search work while sampling across long logs and stack traces."""
    chunks = chunk_defect(title, description, max_chars=1200, overlap=180)
    if len(chunks) <= MAX_QUERY_CHUNKS:
        return chunks
    summary = [chunk for chunk in chunks if chunk.section == "summary"][:1]
    body = [chunk for chunk in chunks if chunk.section != "summary"]
    slots = MAX_QUERY_CHUNKS - len(summary)
    if slots <= 0 or not body:
        return summary or chunks[:MAX_QUERY_CHUNKS]
    if slots == 1:
        sampled = [body[len(body) // 2]]
    else:
        indices = [round(index * (len(body) - 1) / (slots - 1)) for index in range(slots)]
        sampled = [body[index] for index in dict.fromkeys(indices)]
    return summary + sampled


def retrieve_similar(index, vectors: list[list[float]], top_k: int) -> list[dict]:
    """Merge chunk-level nearest neighbors by the best observed issue similarity."""
    candidates: dict[tuple[str, str], dict] = {}
    for vector in vectors:
        for result in index.search(vector, top_k):
            key = (result["source"], result["external_id"])
            current = candidates.get(key)
            if current is None or result["cosine_similarity"] > current["cosine_similarity"]:
                candidates[key] = result
    return sorted(candidates.values(), key=lambda item: item["cosine_similarity"], reverse=True)[:top_k]
