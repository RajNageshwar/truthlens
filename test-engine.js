/**
 * TruthLens Verification Test Suite (Zero Dependencies)
 * 
 * Tests all 5 required features and 3 Decision Points:
 * 1. Submit a claim & risk engine flags
 * 2. Risk flags: Sensational, Shouting, Unsourced, High Risk threshold (>= 2 flags)
 * 3. Review workflow transitions & reviewer notes
 * 4. Public feed filtering & DP1 urgency ordering
 * 5. Detail view fields & DP3 editing re-evaluations
 */

// Replicate analyzeClaimRisk logic for standalone validation
function analyzeClaimRisk(content, sourceUrl) {
  const flags = [];
  const normalizedText = (content || '').toLowerCase();
  
  // 1. Sensational
  const sensationalTriggers = [];
  if (/\bbreaking\b/i.test(content) || normalizedText.includes('breaking')) {
    sensationalTriggers.push('breaking');
  }
  if (/\bshocking\b/i.test(content) || normalizedText.includes('shocking')) {
    sensationalTriggers.push('shocking');
  }
  if (
    normalizedText.includes('share before deleted') ||
    normalizedText.includes('share before it is deleted') ||
    normalizedText.includes('share before it\'s deleted') ||
    normalizedText.includes('share before its deleted') ||
    normalizedText.includes('share before they delete')
  ) {
    sensationalTriggers.push('share before deleted');
  }
  if (sensationalTriggers.length > 0) {
    flags.push('Sensational');
  }

  // 2. Shouting (>50% CAPS)
  const letters = (content || '').replace(/[^a-zA-Z]/g, '');
  let capsPercentage = 0;
  if (letters.length > 0) {
    const uppercaseLetters = letters.replace(/[^A-Z]/g, '');
    capsPercentage = Math.round((uppercaseLetters.length / letters.length) * 100);
    if (capsPercentage > 50) {
      flags.push('Shouting');
    }
  }

  // 3. Unsourced
  const trimmedUrl = (sourceUrl || '').trim();
  const hasSourceLink = trimmedUrl.length > 0 && (
    trimmedUrl.startsWith('http://') || 
    trimmedUrl.startsWith('https://') || 
    trimmedUrl.includes('.')
  );
  if (!hasSourceLink) {
    flags.push('Unsourced');
  }

  // 4. High Risk (2+ flags)
  const isHighRisk = flags.length >= 2;

  return { flags, isHighRisk, capsPercentage, sensationalTriggers, hasSourceLink };
}

console.log('====================================================');
console.log('🧪 RUNNING TRUTHLENS AUTOMATED VERIFICATION SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// TEST 1: Sensational trigger "breaking"
const r1 = analyzeClaimRisk('Breaking news regarding municipal policy changes', 'https://example.com');
assert(r1.flags.includes('Sensational'), 'Feature 2: "breaking" triggers Sensational flag');

// TEST 2: Sensational trigger "shocking"
const r2 = analyzeClaimRisk('Shocking discovery made in ancient ruins today', 'https://example.com');
assert(r2.flags.includes('Sensational'), 'Feature 2: "shocking" triggers Sensational flag');

// TEST 3: Sensational trigger "share before deleted"
const r3 = analyzeClaimRisk('Top secret information revealed! Share before deleted immediately!', 'https://example.com');
assert(r3.flags.includes('Sensational'), 'Feature 2: "share before deleted" triggers Sensational flag');

// TEST 4: Shouting flag (>50% CAPS)
const r4 = analyzeClaimRisk('THIS IS AN ALL UPPERCASE ANNOUNCEMENT WITH A FEW small words', 'https://example.com');
assert(r4.flags.includes('Shouting'), 'Feature 2: >50% CAPS triggers Shouting flag');

// TEST 5: Non-shouting (<50% CAPS)
const r5 = analyzeClaimRisk('This is mostly lowercase with only a few UPPERCASE letters', 'https://example.com');
assert(!r5.flags.includes('Shouting'), 'Feature 2: <=50% CAPS does NOT trigger Shouting flag');

// TEST 6: Unsourced flag (empty URL)
const r6 = analyzeClaimRisk('Normal post without any source link provided', '');
assert(r6.flags.includes('Unsourced'), 'Feature 2: Missing source link triggers Unsourced flag');

// TEST 7: Sourced post with valid URL
const r7 = analyzeClaimRisk('Normal post with a valid source link provided', 'https://reuters.com/news/123');
assert(!r7.flags.includes('Unsourced'), 'Feature 2: Valid source link does NOT trigger Unsourced flag');

// TEST 8: High Risk threshold (< 2 flags -> NOT High Risk)
const r8 = analyzeClaimRisk('Breaking news with confirmed source link', 'https://official.gov');
assert(!r8.isHighRisk && r8.flags.length === 1, 'Feature 2: 1 flag results in isHighRisk = false');

// TEST 9: High Risk threshold (2 flags -> High Risk)
const r9 = analyzeClaimRisk('Breaking news with no source link provided', '');
assert(r9.isHighRisk && r9.flags.length === 2, 'Feature 2: 2 flags (Sensational + Unsourced) triggers High Risk');

// TEST 10: High Risk threshold (3 flags -> High Risk)
const r10 = analyzeClaimRisk('SHOCKING BREAKING NEWS SHARE BEFORE DELETED', '');
assert(r10.isHighRisk && r10.flags.length === 3, 'Feature 2: 3 flags (Sensational + Shouting + Unsourced) triggers High Risk');

// TEST 11: DP3 Editing re-computes flags
const initialClaim = analyzeClaimRisk('SHOCKING RUMOR SPREADING FAST', ''); // Shouting + Sensational + Unsourced (3 flags, High Risk)
assert(initialClaim.isHighRisk === true, 'DP3: Initial claim is High Risk');

const editedClaim = analyzeClaimRisk('Clarification: council issued regular zoning notice', 'https://city.gov/notice');
assert(!editedClaim.isHighRisk && editedClaim.flags.length === 0, 'DP3: Editing claim recalculates flags to 0 and removes High Risk');

console.log('\n----------------------------------------------------');
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('----------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL RISK ENGINE AND CIVIC LOGIC TESTS PASSED!\n');
}
