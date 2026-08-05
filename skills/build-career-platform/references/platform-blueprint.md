# Bundled platform blueprint

This installed-skill reference mirrors the canonical design at:

`docs/career-ai-platform-design.md`

Canonical version: 1.3 (2026-08-04).

If the canonical file is unavailable, use the following product contract:

- Build a local-first, evidence-based career and job-application platform.
- Store approved projects, contributions, claims, evidence, companies, postings, research signals, applications, document versions, interview questions, source policies, and audit events.
- Let AI ask targeted questions for missing purpose, cause, alternatives, rationale, contribution, result, measurement, and visibility; never let AI overwrite approved facts.
- Connect each user's own GitHub, portfolio URL/repository, documents, and job sources through replaceable adapters. Never hardcode Kim Jihee's URLs or data.
- Verify every external source before use; assign a source ID, timestamp, content hash, access state, and usage policy. Never accept AI-invented URLs.
- Separate observed fact, calculation, analysis, inference, and unverified content. Separate direct contribution, collaboration, learning, and insufficient evidence.
- Generate tailored resume, detailed career description, tailored portfolio view, company research, and interview preparation only from eligible approved claims.
- Block submission/export on missing evidence, broken required links, conflicts, private-data leakage, unlabeled inference, or pending review.
- Keep public portfolio, private personal application, synthetic public demo, and later tenant-isolated SaaS separate.
- Open-source application code, schemas, adapters, templates, tests, and synthetic examples. Keep real databases, resumes, photos, private source snapshots, attachments, credentials, and generated documents outside Git.
- Treat source originals as private verification material. Commercial outputs must center on permitted original taxonomy, normalization, deduplication, calculations, trends, confidence, matching, and analysis; re-check current source terms before commercial use.
- Deliver milestones in this order: safety contract; local career knowledge base; AI interview; GitHub/portfolio adapters; verified job inbox; company research; explainable matching; document generation; application CRM; public demo/open-source release; thin Claude/Codex `/apply` adapters; SaaS beta.
- Do not push, deploy, enable billing, publish private data, or submit applications without explicit user authorization.
- Treat the blueprint as living documentation. Move the canonical blueprint and skill source into the new product repository when it is created; publish the sanitized product/architecture contract, but keep real paths, data, credentials, source snapshots, application records, and confidential business operations outside Git.
- Before real personal data is used, pass the local-first security gate: loopback-only binding, session/origin/CSRF protection, SSRF and redirect revalidation, hostile-file isolation, untrusted-content/prompt-injection boundaries, current-user secret protection, AI outbound preview and minimization, complete SQLite/WAL/index/backup handling, and synthetic backup/restore tests.
- Treat even official web pages, repositories, documents, images, and metadata as untrusted instructions. Keep the extractor unable to mutate state or use tools; make a deterministic policy/action layer re-check user intent, evidence, visibility, and approvals.
- Cover local filesystem links/junctions, export formula injection and active links, cloud OCR and embeddings, token revocation, dependency/update supply chain, log minimization, retention, and cache/index deletion before personal-use approval.
- Distinguish design review, implementation review, executable security tests, personal-use approval, public-demo approval, and SaaS review; never infer one from another.

When the canonical design is available, read it in full because it contains the entity fields, UI map, architecture, validation gates, and milestone completion criteria omitted here.
