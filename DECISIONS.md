# TruthLens: Architectural Decision Records (DECISIONS.md)

**Track 2: Real-World AI Products**  
**Hackathon ID**: `AZIS-R4MD3W`  
**Product**: TruthLens (Civic Tech — Misinformation Triage Platform)  
*"Neutral by design: it checks information, not ideologies."*

---

### DP1 · Feed Order
**Decision**: We implemented an **Urgency-Weighted Risk Rank** as the default feed ordering (High-Risk Unverified claims surfaced first, sorted by recency, followed by unreviewed claims, and finally resolved claims), coupled with dynamic sorting toggles for Newsroom operators (Newest First, Total Flags, and Review Status).

**Why**:  
Viral misinformation exhibits an exponential damage curve where social, democratic, and financial harm peaks within the first 1–3 hours of circulation. A strictly chronological feed buries dangerous viral rumors under high volumes of benign announcements, whereas sorting purely by status ignores imminent viral velocity. By elevating high-risk unverified submissions to the top of the triage stream, TruthLens directs journalistic and citizen attention directly toward the highest-velocity threats before they inflict irreparable public harm.

---

### DP2 · Visibility
**Decision**: We implemented **Quarantined Public Transparency** — unverified claims are publicly visible across the feed, but are wrapped in a prominent high-contrast amber advisory banner (*"UNVERIFIED CLAIM · UNDER ACTIVE REVIEW"*), visually segregated from verified conclusions.

**Why**:  
Holding back unverified claims creates a dangerous verification vacuum where viral falsehoods spread unchecked on closed networks like WhatsApp while multiple citizen monitors duplicate review efforts in darkness. Conversely, displaying raw unverified claims as ordinary news risks weaponizing the platform as an amplification loudspeaker for bad actors. Quarantined transparency solves both problems by surfacing viral narratives with clear editorial friction, informing the public that the rumor is already under investigation while crowdsourcing verification leads.

---

### DP3 · Editing
**Decision**: Claims **can be edited after submission**, but every modification creates an **immutable append-only revision record** in the audit log; moreover, **all automated risk flags are immediately re-computed from scratch** and any prior review status is flagged with a mandatory *"Re-Review Required"* advisory.

**Why**:  
Citizen monitors frequently submit viral claims from mobile devices with OCR scanning artifacts, truncated URLs, or transcription typos that distort automated flag heuristics. However, allowing silent or unmonitored text edits would create a severe vulnerability where bad actors sanitize malicious claims after obtaining a "Verified True" badge or escalate sensationalism post-approval. Preserving full revision history and enforcing instantaneous automated re-flagging maintains strict cryptographic-grade auditability without punishing honest typographical corrections.
