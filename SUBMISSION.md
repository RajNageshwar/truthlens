# TruthLens Hackathon Submission Document
**Track 2: Real-World AI Products**  
**Hackathon ID**: `AZIS-R4MD3W`  
**Product Brief**: TruthLens (Civic Tech — Misinformation Triage Platform)

---

## 📋 Hackathon Portal Form Fields (Ready to Copy-Paste)

### 1. Track & Product Brief
- **Track**: Track 2: Real-World AI Products
- **Product Brief**: TruthLens (Civic tech: A misinformation triage platform)
- **Tagline**: *"Social media moves faster than fact-checkers can. Build the tool a newsroom or citizen group would use to triage viral claims, neutral by design: it checks information, not ideologies."*

### 2. Candidate / Team Identification
- **Hackathon ID**: `AZIS-R4MD3W` *(Verified: Placed at root of README.md, in header, and in DECISIONS.md)*
- **Authentication**: **No Authentication (Zero-Auth)**. Complies with grader access rules; evaluation bots and graders can access all features without login/signup.

### 3. Submission URLs
- **Public Deployed URL**: `https://YOUR-APP-NAME.vercel.app` *(Replace with your live Vercel URL)*
- **Public GitHub Repository**: `https://github.com/YOUR-USERNAME/truthlens` *(Replace with your repo URL)*
- **Standard API Implemented**: **YES** *(Implemented with OpenAPI 3.0 at `/api/openapi` and standard endpoints at `/api/claims`)*
- **Demo Recording Video URL**: `https://www.loom.com/share/...` *(Replace with your 3-4 min recording link)*

---

## 🏛️ Decision Points (Direct Copy-Paste for Form / DECISIONS.md)

### DP1 · Feed Order Strategy: Urgency-Weighted Risk Rank
**What was chosen**:  
High-Risk Unverified claims jump to the top of the feed, followed by recency and resolved claims, with user toggles for Newest First, Total Flags, and Status.

**Why (Rationale)**:  
Viral misinformation exhibits an exponential damage curve where social, democratic, and financial harm peaks within the first 1–3 hours of circulation. A strictly chronological feed buries dangerous viral rumors under high volumes of benign announcements, whereas sorting purely by status ignores imminent viral velocity. By elevating high-risk unverified submissions to the top of the triage stream, TruthLens directs journalistic and citizen attention directly toward the highest-velocity threats before they inflict irreparable public harm.

---

### DP2 · Visibility Policy: Quarantined Public Transparency
**What was chosen**:  
Unverified claims remain publicly visible across the triage feed, but are wrapped with prominent amber caution banners (*"UNVERIFIED CLAIM · UNDER ACTIVE NEWSROOM REVIEW"*).

**Why (Rationale)**:  
Holding back unverified claims creates a dangerous verification vacuum where viral falsehoods spread unchecked on closed networks like WhatsApp while multiple citizen monitors duplicate review efforts in darkness. Conversely, displaying raw unverified claims as ordinary news risks weaponizing the platform as an amplification loudspeaker for bad actors. Quarantined transparency solves both problems by surfacing viral narratives with clear editorial friction, informing the public that the rumor is already under investigation while crowdsourcing verification leads.

---

### DP3 · Editing & Flag Re-Evaluation: Append-Only Revision History
**What was chosen**:  
Claims can be edited after submission to fix transcription or OCR errors; however, all automated risk flags are immediately re-computed from scratch, an immutable audit record is preserved, and previous reviews are flagged for mandatory re-verification.

**Why (Rationale)**:  
Citizen monitors frequently submit viral claims from mobile devices with OCR scanning artifacts, truncated URLs, or transcription typos that distort automated flag heuristics. However, allowing silent or unmonitored text edits would create a severe vulnerability where bad actors sanitize malicious claims after obtaining a "Verified True" badge or escalate sensationalism post-approval. Preserving full revision history and enforcing instantaneous automated re-flagging maintains strict cryptographic-grade auditability without punishing honest typographical corrections.

---

## 🛠️ The 5 Required Features Implementation

| Feature | Implementation | How Graders Can Verify |
|---|---|---|
| **1. Submit a claim** | Multi-line text of viral post, source platform (`WhatsApp`, `X`, `Instagram`, `Other`), category (`Politics`, `Health`, `Finance`, `Other`), and source URL. | Click **"+ Submit Claim"** in UI or send `POST /api/claims`. Real-time flag preview calculates triggers as user types. |
| **2. Risk flags** | - `"breaking"` / `"shocking"` / `"share before deleted"` $\rightarrow$ **Sensational**<br>- `>50% CAPS` $\rightarrow$ **Shouting**<br>- No source link $\rightarrow$ **Unsourced**<br>- 2+ flags $\rightarrow$ **High Risk** | Built into `lib/riskEngine.ts` and automated test suite `node test-engine.js`. Evaluated deterministically. |
| **3. Review workflow** | Moves claim from `Unverified` $\rightarrow$ `Verified True` / `Verified False` / `Verified Misleading` with a mandatory neutral **Reviewer Note**. | Open any claim detail view, select review verdict, input note, and click **Submit Verdict** or use `POST /api/claims/:id/review`. |
| **4. Public feed** | Feed displays status badges, category pills, platform tags, and risk tags. | Filter by Category (`Politics`, `Health`, `Finance`, `Other`) and Status (`Unverified`, `Verified True`, `Verified False`, `Verified Misleading`). |
| **5. Detail view** | Complete view showing full text, flags breakdown with explanations, reviewer note, and submission timestamp. | Click **"Details"** on any claim card to inspect full content, source URL, and revision history. |

---

## 📡 Standard REST API Endpoints (For Automated Grading Scripts)

- `GET /api/claims` — List claims with query filters (`?category=Health&status=Unverified&sort=risk_priority`)
- `POST /api/claims` — Create claim and trigger automatic risk flag analysis
- `GET /api/claims/:id` — Retrieve single claim details, risk analysis, and review note
- `POST /api/claims/:id/review` — Transition review state with required reviewer note
- `PATCH /api/claims/:id` — Edit claim text and trigger risk flag re-evaluation (DP3)
- `GET /api/stats` — Aggregate triage statistics
- `GET /api/openapi` — Complete OpenAPI 3.0.3 specification JSON

---

## 🎬 3–4 Minute Demo Video Script (Walking through 5 Features + 3 DPs)

1. **[0:00 - 0:30] Intro**: Show Hackathon ID `AZIS-R4MD3W` in README and app header. Announce *Track 2: TruthLens*. Mention Zero-Auth compliance.
2. **[0:30 - 1:15] Feature 1 & 2 (Submit & Flags)**: Click **"+ Submit Claim"**. Paste sensational rumor: *"SHOCKING BREAKING NEWS! Emergency decree issued. SHARE BEFORE DELETED!"*. Show live flag engine detecting `Sensational`, `Shouting` (>50% CAPS), and `Unsourced`, triggering `High Risk`. Submit.
3. **[1:15 - 1:55] Feature 4 (Feed & DP1/DP2)**: Show claim appearing at the top via **DP1 (Urgency-Weighted Risk Rank)**. Highlight amber banner on unverified claims (**DP2 Quarantined Transparency**). Demonstrate Category and Status filters.
4. **[1:55 - 2:40] Feature 5 & 3 (Detail & Review Workflow)**: Open claim details. Review full text and flags. Move status to **Verified False**, add a factual reviewer note citing official sources, and save.
5. **[2:40 - 3:15] DP3 (Editing & Re-Evaluation)**: Click **"Edit Claim" (DP3)**. Edit text to normal casing and add source link. Show flags instantly re-calculating to 0 and revision audit log being recorded.
6. **[3:15 - 3:45] API & Wrap-up**: Open `/api/claims` or `/api/openapi` to show standard API compliance. Conclude video.
