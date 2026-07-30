#!/usr/bin/env node

/**
 * XPRIZE Evidence Generator
 * Exercises all three Gemini models (Pro, Flash, Embeddings) on Vertex AI
 * to produce clearly-dated observability + billing activity, and logs
 * per-call metadata for supporting evidence.
 */

import geminiClient from '../src/integrations/gemini/client.js';
import config from '../src/config/index.js';

const stamp = () => new Date().toISOString();
const line = (s) => console.log(`[${stamp()}] ${s}`);

async function run() {
  console.log('==============================================');
  console.log(' PivotConnect — Gemini Usage Evidence Run');
  console.log(` Project:  ${config.vertexAI.projectId}`);
  console.log(` Location: ${config.vertexAI.location}`);
  console.log(` Models:   ${JSON.stringify(config.vertexAI.models)}`);
  console.log(` Started:  ${stamp()}`);
  console.log('==============================================\n');

  let proCalls = 0, flashCalls = 0, embedCalls = 0, errors = 0;

  const coachingPrompts = [
    'I want to start a sustainable fashion business selling eco-friendly basics online. Where do I begin?',
    'How do I validate demand for a new product with only $15K in startup capital?',
    'What should a first-time founder look for in a business mentor?'
  ];

  const mentorBios = [
    'Former CEO of a $50M sustainable textile company; expert in ethical supply chains and bootstrapped scaling.',
    'Retired CFO in the fashion industry; led fundraising for three startups past $10M revenue.',
    'Former VP Marketing at a major outdoor brand; specialist in sustainability marketing and DTC community building.',
    'Serial entrepreneur with four e-commerce exits; lean startup and fashion retail operations.'
  ];

  // 1) Gemini 2.5 Pro — coaching / reasoning
  for (const p of coachingPrompts) {
    try {
      const r = await geminiClient.generateWithPro({
        systemInstruction: 'You are Phoenix, a warm, pragmatic business coach for aspiring entrepreneurs.',
        userMessage: p,
        maxOutputTokens: 256
      });
      proCalls++;
      line(`PRO   ok   model=${r.metadata?.model} finish=${r.metadata?.finishReason} chars=${(r.text||'').length}`);
    } catch (e) { errors++; line(`PRO   ERR  ${e.message}`); }
  }

  // 2) Gemini 2.5 Flash — fast responses
  for (const p of coachingPrompts) {
    try {
      const r = await geminiClient.generateWithFlash({
        systemInstruction: 'You are Compass, an AI mentor-matching assistant. Be concise.',
        userMessage: `In one sentence, why is mentorship valuable for: "${p}"`,
        maxOutputTokens: 128
      });
      flashCalls++;
      line(`FLASH ok   model=${r.metadata?.model} finish=${r.metadata?.finishReason} chars=${(r.text||'').length}`);
    } catch (e) { errors++; line(`FLASH ERR  ${e.message}`); }
  }

  // 3) Embeddings — semantic mentor matching
  for (const bio of mentorBios) {
    try {
      const r = await geminiClient.generateEmbedding(bio);
      embedCalls++;
      line(`EMBED ok   model=${r.metadata?.model} dim=${r.metadata?.dimension}`);
    } catch (e) { errors++; line(`EMBED ERR  ${e.message}`); }
  }

  console.log('\n==============================================');
  console.log(' Summary');
  console.log(`  Gemini 2.5 Pro calls:   ${proCalls}`);
  console.log(`  Gemini 2.5 Flash calls: ${flashCalls}`);
  console.log(`  Embedding calls:        ${embedCalls}`);
  console.log(`  Errors:                 ${errors}`);
  console.log(`  Finished: ${stamp()}`);
  console.log('==============================================');
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
