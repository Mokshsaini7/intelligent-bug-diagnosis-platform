# Defect analysis and retrieval research

## Problem framing

Issue reports mix a short summary, natural-language symptoms, environment details and often stack traces. Similarity is useful for finding prior context but is not enough to label two reports as duplicates: reports may describe the same defect with very different wording, and similar symptoms may have different causes. Milestone 1 therefore presents ranked historical precedents and their evidence, leaving diagnosis to the developer.

## Evidence and design choices

* Research on duplicate bug report detection identifies retrieval as a useful triage task and compares lexical, semantic and structured signals. A peer-reviewed empirical study reports that lexical similarity remained an important signal while semantic representations contributed complementary information; this supports treating embeddings as a retrieval mechanism rather than a correctness score ([Jiang et al., *Does Deep Learning improve the performance of duplicate bug report detection? An empirical study*, 2023](https://doi.org/10.1016/j.jss.2023.111607)).
* A comparative sentence-embedding study of bug reports evaluates semantic text-similarity models for bug report retrieval and motivates checking domain fit before claiming quality from a general-purpose model ([A Comparative Study of Text Embedding Models for Semantic Text Similarity in Bug Reports, 2023](https://arxiv.org/abs/2308.09193)).
* Research on report quality describes expected behavior, observed behavior and reproduction steps as useful structured content, and notes that missing or ambiguous details can weaken retrieval ([Chaparro, ICSE 2017 doctoral symposium](https://doi.org/10.1109/ICSE-C.2017.27)).
* Sentence embeddings can retrieve semantically similar bug reports, but published results use task-specific tuning and evaluation. The baseline here uses a general sentence-transformer model and does not claim the paper's performance ([Isotani et al., 2023](https://doi.org/10.3389/fcomp.2022.1032452)).

## Milestone 1 retrieval method

1. Keep source fields separate in PostgreSQL and create 1,200-character chunks from summary and description. Repeating the summary in description chunks gives each excerpt issue context. For long incoming reports, sample up to eight chunks across the report before retrieval.
2. Apply lightweight cleaning: normalize line endings and spaces, remove HTML markup, preserve stack trace/code text, and redact email-shaped strings. Avoid stemming or deleting identifiers because exception names, paths and symbols can be diagnostic clues.
3. Embed each chunk and each incoming report using the same pinned model. Normalize vectors and rank with cosine similarity in pgvector.
4. Return the closest chunk per historical issue, with original source link, project/component and status/resolution where available. Treat scores as an ordering aid only.

Comments, reporter names, attachments, patches and private records are excluded in this milestone. This reduces data collection and avoids implying that the system has analyzed code changes or authorship.

## Evaluation plan and current limits

No performance number is reported because no real corpus has been fetched or judged in this environment. An evidence-based evaluation should record the exact fetch timestamp, source query, API result counts, model revision and pgvector settings; construct query cases from public duplicate links or independently adjudicated pairs; and report Recall@k, MRR and nDCG with a time-based split to limit leakage. Randomly sampled near neighbors should be manually checked for false positives, and a lexical baseline should be included. Until this is done, retrieval relevance is unvalidated.

Known limitations include tracker field variation, changing/deleted public records, API pagination/rate limits, language and project skew, incomplete reports, general-model vocabulary mismatch, and approximate HNSW recall. Current ingestion is intentionally capped per source per run and the Apache project set is configurable. See [dataset provenance and licensing](datasets.md).
