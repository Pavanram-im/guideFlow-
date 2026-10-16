import type { ExtractedDocument } from '../types/index.ts';

export function analyzeRawText(text: string, title?: string): ExtractedDocument {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Extract candidate title from first line or provided title
  let docTitle = title?.trim() || '';
  if (!docTitle && lines.length > 0) {
    docTitle = lines[0].replace(/^#+\s*/, '').slice(0, 80);
  }
  if (!docTitle) docTitle = 'Untitled Document';

  // Detect warnings (look for alert keywords)
  const warningRegex = /(warning|caution|danger|note|critical|important|do not|never|alert|హెచ్చరిక|జాగ్రత్త|चेतावनी|सावधानी|எச்சரிக்கை)/i;
  const warnings: string[] = [];
  lines.forEach((l) => {
    if (warningRegex.test(l)) {
      warnings.push(l.replace(/^[-*•>]\s*/, '').slice(0, 150));
    }
  });

  // Extract key points from bullet lists or strong markers
  const keyPoints: string[] = [];
  lines.forEach((l) => {
    if (/^[-*•\d+\.]\s+/.test(l) && !warningRegex.test(l)) {
      keyPoints.push(l.replace(/^[-*•\d+\.]\s*/, '').slice(0, 160));
    }
  });

  // If few bullet points, take leading sentences
  if (keyPoints.length === 0) {
    const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);
    keyPoints.push(...sentences.slice(0, 4));
  }

  // Detect language hint (Telugu, Devanagari, Tamil, etc.)
  let detectedLanguage = 'English (Detected)';
  if (/[\u0C00-\u0C7F]/.test(clean)) {
    detectedLanguage = 'Telugu (Detected)';
  } else if (/[\u0900-\u097F]/.test(clean)) {
    detectedLanguage = 'Hindi / Devanagari (Detected)';
  } else if (/[\u0B80-\u0BFF]/.test(clean)) {
    detectedLanguage = 'Tamil (Detected)';
  } else if (/[\u0C80-\u0CFF]/.test(clean)) {
    detectedLanguage = 'Kannada (Detected)';
  } else if (/[\u0D00-\u0D7F]/.test(clean)) {
    detectedLanguage = 'Malayalam (Detected)';
  } else if (/[\u0980-\u09FF]/.test(clean)) {
    detectedLanguage = 'Bengali (Detected)';
  } else if (/[\u0600-\u06FF]/.test(clean)) {
    detectedLanguage = 'Arabic / Urdu (Detected)';
  } else if (/[áéíóúñ¿¡]/i.test(clean)) {
    detectedLanguage = 'Spanish (Detected)';
  } else if (/[àâçéèêëîïôûùüÿ]/i.test(clean)) {
    detectedLanguage = 'French (Detected)';
  } else if (/[äöüß]/i.test(clean)) {
    detectedLanguage = 'German (Detected)';
  }

  // Estimate topic from title
  const topic = docTitle;

  return {
    id: `doc-${Date.now()}`,
    title: docTitle,
    rawText: clean,
    detectedLanguage,
    wordCount,
    topic,
    keyPoints: keyPoints.slice(0, 5),
    warnings: warnings.slice(0, 3),
    prerequisites: ['Carefully read instructions', 'Ensure required access or tools are ready'],
    suggestedSteps: Math.max(3, Math.min(8, Math.ceil(wordCount / 60)))
  };
}

export const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-software-deployment',
    title: 'Cloud Production Deployment & Rollback Protocol',
    category: 'Engineering & DevOps',
    snippet: 'Step-by-step procedure for safely deploying microservices to Kubernetes clusters with canary health checks and zero-downtime rollback.',
    fullText: `# Cloud Production Deployment & Rollback Protocol

## 1. Pre-Deployment Verification
Before triggering deployment, ensure that unit test coverage exceeds 85% and that all integration tests have passed on the staging cluster. Verify that database migrations are backward compatible.

## 2. Canary Release Strategy
Deploy the container image to 10% of traffic pods using the traffic routing ingress controller. Monitor Prometheus latency histograms (p95 < 200ms) and HTTP 5xx error rates for 5 minutes.

## 3. Full Fleet Promotion
If canary metrics remain stable, promote the image across all availability zones in batches of 25%. Maintain persistent connection draining for at least 60 seconds per pod.

## 4. Emergency Rollback Criteria
CRITICAL WARNING: If HTTP 5xx errors exceed 0.5% or CPU throttling triggers pod restart loops, immediately initiate automated rollback to the previous SHA tag using 'kubectl rollout undo'. Never attempt manual schema rollbacks during an active traffic spike without database lead supervision.`
  },
  {
    id: 'sample-first-aid',
    title: 'Workplace Emergency CPR & AED Action Guide',
    category: 'Health & Safety SOP',
    snippet: 'Essential life-saving instructions for responding to sudden cardiac arrest in corporate or industrial facilities.',
    fullText: `# Workplace Emergency CPR & AED Action Guide

## Step 1: Scene Safety & Response Check
Check the scene for danger (loose electrical wires, toxic fumes). Tap the patient firmly on both shoulders and shout: "Are you okay?". If there is no response and no normal breathing, declare a medical emergency.

## Step 2: Call Emergency Services & Retrieve AED
Direct a specific bystander: "You in the blue shirt, call emergency services (112 or 911) immediately and bring the automated external defibrillator (AED) from the lobby."

## Step 3: High-Quality Chest Compressions
Place the heel of your hand in the center of the chest. Interlock your other hand over it. Push hard and fast at a rate of 100 to 120 compressions per minute, depressing the chest at least 5 centimeters (2 inches). Allow full chest recoil between compressions.

## Step 4: AED Operation
Turn on the AED as soon as it arrives. Follow the voice prompts: attach pads to bare dry chest as pictured. CAUTION: Stand clear while the AED analyzes rhythm and before delivering any advised shock. Immediately resume chest compressions after shock delivery.`
  },
  {
    id: 'sample-cybersecurity',
    title: 'Enterprise Cyber Security & Phishing Defense Policy',
    category: 'Information Security',
    snippet: 'Mandatory protocols for identifying spear phishing, handling suspicious links, and reporting compromised corporate credentials.',
    fullText: `# Enterprise Cyber Security & Phishing Defense Policy

## 1. Identifying Social Engineering Signals
Attackers frequently impersonate executive leaders requesting urgent wire transfers, gift card purchases, or immediate password resets. Inspect sender email headers for domain spoofing (e.g., support@corp-security-login.com instead of corporate domain).

## 2. Safe Link and Attachment Handling
Never click on unsolicited links or download attachments such as .zip, .iso, or macro-enabled Excel sheets. Hover over embedded links to inspect the true destination URL before clicking.

## 3. Multi-Factor Authentication (MFA) Verification
WARNING: Never approve unexpected MFA push notifications on your authenticator device. MFA fatigue attacks occur when attackers repeatedly spam approval requests to force accidental taps.

## 4. Incident Escalation
If you suspect your credentials have been entered into a phishing portal, immediately disconnect your workstation from Wi-Fi and report the event to the Security Operations Center via the incident hotline.`
  }
];
