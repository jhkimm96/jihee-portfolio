---
name: build-career-platform
description: Design, implement, audit, or extend the evidence-based Career AI Platform discussed with Kim Jihee: a local-first career/project knowledge base, AI interview workflow, GitHub and portfolio evidence ingestion, verified job/company research, job-to-experience matching, tailored resume/career-description/portfolio generation, PDF validation, private personal operation, public demo, open-source release, and later multi-tenant SaaS. Use when Codex or Claude is asked to build this product, plan its next milestone, change its architecture or schema, implement a feature, prepare its demo/deployment/GitHub release, or create the future /apply workflow. Do not use for ordinary edits to Jihee's existing portfolio unless they are specifically part of this platform integration.
---

# Build Career AI Platform

Build from evidence, not from the conversation alone. Treat the platform blueprint as the product contract.

## Start every task

1. Locate and read the full blueprint:
   - Prefer `docs/career-ai-platform-design.md` in the active product repository.
   - Otherwise read `references/platform-blueprint.md` bundled with this skill.
2. Read repository instructions and inspect the current code, schema, tests, git status, and existing documentation.
3. State the requested outcome, current milestone, assumptions, and files likely to change.
4. Preserve unrelated user changes. Never reset or overwrite a dirty worktree.
5. If the task changes product scope, privacy boundaries, commercial behavior, or source-use policy, update the blueprint first and call out the decision.

## Implementation discipline

- Implement the smallest end-to-end slice that leaves a usable, tested state.
- Do not scaffold the entire roadmap in one pass or claim unimplemented stages.
- Keep the open-source code independent of Jihee's portfolio URL, GitHub account, private data paths, and AI provider.
- Keep personal data outside the public repository. Use synthetic fixtures in tests, screenshots, demos, and README material.
- Model local single-user ownership now while retaining explicit owner boundaries for later multi-tenancy.
- Keep domain logic independent from Next.js pages, SQLite, a specific AI vendor, and deployment provider.
- Require migrations for persisted-schema changes and deterministic tests for security gates.
- Prefer replaceable adapters for sources, GitHub, portfolio formats, AI providers, storage, PDF rendering, and deployment.

## Non-negotiable trust contract

Enforce these rules in code rather than prompt text alone:

1. AI may not invent a URL, citation, project, role, metric, date, contribution, or company fact.
2. A source must be fetched or user-supplied, fingerprinted, timestamped, and assigned a source ID before it can support a claim.
3. Every generated factual claim must link to approved career evidence or verified external evidence.
4. Separate `observed fact`, `calculation`, `analysis`, `inference`, and `unverified` in storage and UI.
5. Never place `unverified` content in submission documents. Clearly label inference in research views.
6. Separate `direct contribution`, `collaboration`, `learning`, and `insufficient evidence`.
7. Enforce visibility: `private`, `anonymized`, `application-only`, or `public`.
8. AI proposals never overwrite approved source-of-truth records. Require explicit user approval.
9. Block export when claims lack evidence, links fail, private data leaks, facts conflict, or review remains required.
10. Never automatically submit an application or publish private material.

## AI workflow

Implement AI as bounded stages with structured inputs and outputs:

1. Ingest: accept URL, file, text, GitHub, portfolio URL/repository, or manual entry.
2. Verify: validate access, identity, timestamps, license/usage metadata, content hash, and source relevance.
3. Normalize: map content to canonical company, posting, project, evidence, claim, and application records.
4. Interview: ask one to three high-value questions only for missing rationale, contribution, result, measurement, or visibility.
5. Approve: show extracted facts and proposed changes before updating approved career records.
6. Match: connect each job requirement to the strongest eligible evidence and expose gaps without fabrication.
7. Generate: produce resume, detailed career description, tailored portfolio view, research brief, and interview preparation from approved claims.
8. Validate: use deterministic checks plus a separate semantic review; render documents and inspect layout.
9. Freeze: version approved submission artifacts so later edits do not alter what was submitted.

Do not use a single prompt to perform all stages. Persist stage results and make retries idempotent.

## Delivery boundaries

Maintain three modes:

| Mode | Data | Access | Purpose |
|---|---|---|---|
| Personal local | Real user data | Device owner | First production-quality implementation |
| Public demo | Synthetic data only | Public | Portfolio, README, and product demonstration |
| Hosted SaaS | Tenant-isolated real data | Authenticated owner | Later validated commercial product |

Keep the existing public portfolio separate from the private career application. A tailored portfolio view may reference approved public content or a revocable, expiring share; it must not expose the private management UI.

## Source and commercial boundaries

- Treat collected source originals as private verification material, not a resale dataset.
- Store source-specific terms: commercial use, redistribution, full-text retention, attribution, and expiration.
- Expose or sell only permitted derived outputs such as original taxonomy, normalized signals, calculations, trends, confidence, matching, and analysis.
- Never assume summarization removes copyright, database, privacy, contract, or API restrictions.
- Before implementing a connector or commercial export, verify current official API documentation and source terms. Record the verification date.
- Keep personal application notes, private career evidence, credentials, cookies, and source originals out of public datasets.

## Quality gates

Before completing a milestone:

1. Run relevant unit, integration, migration, security, and end-to-end tests.
2. Run type checking, linting, and production build where configured.
3. Test with synthetic data and at least one denied path: private export, unsupported source, missing evidence, or broken URL.
4. For PDFs, render every page and inspect overflow, page breaks, fonts, selectable text, links, images, and metadata.
5. For UI work, inspect responsive states, empty/error/loading states, keyboard access, and privacy labels.
6. Confirm no real DB, resume, photo, attachment, cookie, secret, source snapshot, or generated private document is tracked by Git.
7. Report exact tests, residual risks, and the next recommended milestone. Do not call a stage complete merely because scaffolding exists.

## GitHub and deployment

- Publish one open-source application repository containing full-stack UI/server code, schemas, adapters, templates, tests, documentation, and synthetic examples.
- Keep real user data in an external local data directory or approved private infrastructure, never in a second data repository.
- Provide a first-run onboarding flow so every developer connects their own GitHub, portfolio, files, AI provider, and sources.
- Deploy the public demo with synthetic, resettable, non-persistent data and disabled external side effects.
- Add automated pre-push checks for secrets, personal data patterns, forbidden paths, tests, and build.
- Document the real user journey with screenshots and a short demo video after UI stabilization.
- Do not push, deploy, purchase services, change production data, or enable billing without explicit user authorization.

## Runtime skill boundary

Create the operational `/apply` skill only after the canonical schema, approval workflow, source verification, matching contract, and export gates are implemented. That skill must call platform commands or APIs and share the platform database; it must not reimplement business rules in prose. Provide thin Claude and Codex adapters over the same versioned contract.

## Task handoff

End with:

- milestone and user-visible outcome;
- files and migrations changed;
- trust/privacy decisions enforced;
- tests and visual verification performed;
- any claim or source still awaiting approval;
- next smallest end-to-end milestone.

