# TruthLens — Misinformation Triage Platform
### Hackathon ID: `AZIS-R4MD3W`

> **Track 2: Real-World AI Products**  
> **Brief**: TruthLens (Civic Tech — A Misinformation Triage Platform)  
> *"Social media moves faster than fact-checkers can. Build the tool a newsroom or citizen group would use to triage viral claims, neutral by design: it checks information, not ideologies."*

---

## 🌟 Overview & Core Highlights

TruthLens is an automated, real-time misinformation triage platform designed for newsrooms, civic watchdog organizations, and citizen fact-checking groups. It operates with strict **editorial neutrality**, analyzing incoming viral posts based entirely on content signals and provenance rather than political or ideological stances.

### 5 Required Features Implemented
1. **Submit a Claim**:
   - Viral post text input with live typing counter.
   - Source platform selector: `WhatsApp`, `X`, `Instagram`, `Other` (with custom name input).
   - Source link URL input with format validation.
   - Category selector: `Politics`, `Health`, `Finance`, `Other`.
   - **Real-Time Client Preview**: Automatically renders detected risk flags as the user types before submission.
2. **Deterministic Risk Flags Engine**:
   - `Sensational`: Case-insensitive detection of triggers (`"breaking"`, `"shocking"`, `"share before deleted"`).
   - `Shouting`: Algorithmic detection of posts with `> 50% CAPS` across alphabetic characters.
   - `Unsourced`: Triggered whenever a valid source URL is omitted or empty.
   - `High Risk`: Distinctive alert badge automatically activated when **2 or more flags** are present.
3. **Review Workflow**:
   - One-click status transitions: `Unverified` $\rightarrow$ `Verified True` | `Verified False` | `Verified Misleading`.
   - Mandatory **Reviewer Note** field capturing fact-check evidence neutrally.
   - Records reviewer desk identity and timestamped audit logs.
4. **Public Feed**:
   - Real-time claims stream displaying status badges, category pills, platform icons, and risk tags.
   - Dynamic **Category Filtering**: `All`, `Politics`, `Health`, `Finance`, `Other`.
   - Dynamic **Status Filtering**: `All`, `Unverified`, `Verified True`, `Verified False`, `Verified Misleading`.
   - Instant search bar and "High Risk Only" quick filter.
5. **Detail View**:
   - Expanded modal/drawer containing full original text, platform metadata, direct outbound source link, category, and submission timestamp.
   - Comprehensive risk breakdown explaining the exact reason each flag triggered.
   - Review history with reviewer notes and editorial verification stamps.
   - In-app claim revision interface (supporting Decision Point 3).

---

## 🏛️ Decision Points (Summary from `DECISIONS.md`)

- **DP1 · Feed Order**: **Urgency-Weighted Risk Rank**  
  High-risk unverified rumors are surfaced to the top of the feed to intercept fast-moving viral harm in its critical first hours, with quick toggles for *Newest First*, *Total Flags*, and *Status*.
- **DP2 · Visibility**: **Quarantined Public Transparency**  
  Unverified claims remain publicly visible to facilitate collaborative citizen triage and avoid submission duplication, but are isolated with high-visibility amber advisory banners (*"UNVERIFIED CLAIM · UNDER ACTIVE REVIEW"*).
- **DP3 · Editing**: **Append-Only Revision History with Instant Re-Evaluation**  
  Claims can be revised to correct transcription/OCR errors, but original text is preserved in an immutable audit trail; editing instantaneously re-calculates all risk flags and flags prior reviews for mandatory re-verification.

---

## 🔑 Test Credentials & Zero-Auth Notice

> **Zero Authentication Required**: Per hackathon rules, no login or signup wall exists. Graders and evaluation bots have unrestricted access to all features, feeds, submission forms, review transitions, and API endpoints immediately.

---

## 🚀 Quickstart & Run Steps

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or yarn or pnpm

### 2. Installation
```bash
# Navigate to project directory
cd scratch/truthlens

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Verification Tests
TruthLens includes a zero-dependency automated verification test suite:
```bash
node test-engine.js
```
Expected output:
```
====================================================
🧪 RUNNING TRUTHLENS AUTOMATED VERIFICATION SUITE
====================================================
✅ PASS: Feature 2: "breaking" triggers Sensational flag
✅ PASS: Feature 2: "shocking" triggers Sensational flag
✅ PASS: Feature 2: "share before deleted" triggers Sensational flag
✅ PASS: Feature 2: >50% CAPS triggers Shouting flag
✅ PASS: Feature 2: <=50% CAPS does NOT trigger Shouting flag
✅ PASS: Feature 2: Missing source link triggers Unsourced flag
✅ PASS: Feature 2: Valid source link does NOT trigger Unsourced flag
✅ PASS: Feature 2: 1 flag results in isHighRisk = false
✅ PASS: Feature 2: 2 flags (Sensational + Unsourced) triggers High Risk
✅ PASS: Feature 2: 3 flags (Sensational + Shouting + Unsourced) triggers High Risk
✅ PASS: DP3: Initial claim is High Risk
✅ PASS: DP3: Editing claim recalculates flags to 0 and removes High Risk
----------------------------------------------------
Summary: 12 passed, 0 failed
----------------------------------------------------
🎉 ALL RISK ENGINE AND CIVIC LOGIC TESTS PASSED!
```

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📡 Standard REST API Documentation

TruthLens implements the full standard REST API for Track 2. Graders can run automated curl/fetch scripts against the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/claims` | List claims with query filters (`?category=Health&status=Unverified&sort=risk_priority&highRiskOnly=true`) |
| `POST` | `/api/claims` | Submit a new viral claim; returns analyzed flags & High Risk calculation |
| `GET` | `/api/claims/:id` | Get complete details of a single claim, flags, and review note |
| `PATCH` | `/api/claims/:id` | Edit claim text; creates audit revision and re-evaluates risk flags (DP3) |
| `POST` | `/api/claims/:id/review` | Submit review verdict (`Verified True`, `Verified False`, `Verified Misleading`) + required note |
| `GET` | `/api/stats` | Aggregate dashboard statistics (total claims, unverified count, high risk count) |
| `GET` | `/api/openapi` | Full OpenAPI 3.0.3 specification JSON |

### Example cURL Request: Submit a Claim
```bash
curl -X POST http://localhost:3000/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "content": "SHOCKING BREAKING NEWS! Government shutting down electricity grid at midnight. SHARE BEFORE DELETED!",
    "platform": "WhatsApp",
    "category": "Politics",
    "sourceUrl": ""
  }'
```

### Example cURL Request: Review a Claim
```bash
curl -X POST http://localhost:3000/api/claims/claim-101/review \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Verified False",
    "reviewerNote": "Energy ministry confirmed nationwide grid operations are standard and normal maintenance schedules apply.",
    "reviewerName": "Lead Fact-Checker"
  }'
```

---

## 🌐 Public Deployment Guide

This repository is pre-configured for instant zero-configuration deployment on **Vercel**:
1. Push this project to a public GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep default settings (`Next.js` framework preset).
4. Click **Deploy**. Your public URL will be live in under 60 seconds (e.g. `https://truthlens-triage.vercel.app`).

Alternatively, deploy to **Netlify** or **Render** with `npm run build` and `npm start`.

---

## 🎬 3–4 Minute Demo Recording Script

Use this step-by-step checklist to record the required 3-4 minute walkthrough:

| Timestamp | Feature / Topic | On-Screen Action & Script Talking Points |
|---|---|---|
| **0:00 – 0:35** | **Intro & Hackathon ID** | Show Hackathon ID `AZIS-R4MD3W` at the top header and in README. State brief: *Track 2: TruthLens Civic Misinformation Triage Platform*. Highlight zero-auth design. |
| **0:35 – 1:15** | **Feature 1 & 2: Submit a Claim & Risk Flags** | Click **"+ Submit Claim"**. Paste a sensational all-caps rumor: *"SHOCKING BREAKING NEWS! Emergency decree issued. SHARE BEFORE DELETED!"*. Show live flag preview detecting: `Sensational`, `Shouting`, and `Unsourced`. Highlight the `High Risk` badge triggering (2+ flags). Submit the claim. |
| **1:15 – 1:55** | **Feature 4: Public Feed & DP1 / DP2** | Show the newly created claim appearing at the top of the feed due to **DP1 (Urgency-Weighted Risk Rank)**. Explain **DP2 (Quarantined Transparency)**: show the amber *"UNVERIFIED CLAIM · UNDER REVIEW"* banner preventing false amplification while enabling open citizen triage. Demonstrate category filters (`Health`, `Finance`, `Politics`) and status filters. |
| **1:55 – 2:40** | **Feature 5 & 3: Detail View & Review Workflow** | Click on an unverified claim card to open the **Detail View**. Review the full text, platform origin, timestamp, and flag explanations. Move the claim from `Unverified` to `Verified False` by adding a factual reviewer note. Show the status badge dynamically update to Rose/Emerald across the app. |
| **2:40 – 3:15** | **DP3: Claim Editing & Flag Re-Evaluation** | Click **"Edit Claim"** on a claim. Clarify the text into normal casing and add a legitimate government URL. Demonstrate how the risk flags immediately re-evaluate from `High Risk` down to 0 flags, while creating an immutable audit trail and resetting review status. |
| **3:15 – 3:45** | **Standard REST API & Wrap-up** | Open the **API Docs** modal or visit `/api/claims` in browser. Show standard JSON schema and OpenAPI endpoint. Conclude walkthrough. |
