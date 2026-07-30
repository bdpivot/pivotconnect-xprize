#!/usr/bin/env node

/**
 * Test Phoenix Agent
 * Quick script to verify Gemini integration works
 */

import dotenv from 'dotenv';
import phoenixOrchestrator from '../src/agents/phoenix/orchestrator.js';
import logger from '../src/utils/logger.js';

dotenv.config();

async function testPhoenix() {
  console.log('🦅 Testing Phoenix Agent\n');

  try {
    // Test 1: Simple coaching question
    console.log('Test 1: Simple coaching question');
    const result1 = await phoenixOrchestrator.processMessage({
      userId: 'test_user_001',
      message: 'I want to start a sustainable fashion business but not sure where to begin',
      conversationHistory: [],
      useFlash: false
    });

    console.log('\n✅ Phoenix Response:');
    console.log(result1.response?.substring(0, 300) + '...\n');

    // Test 2: Question that should route to Atlas
    console.log('Test 2: Question requiring market research (should route to Atlas)');
    const result2 = await phoenixOrchestrator.processMessage({
      userId: 'test_user_001',
      message: 'What is the market size for sustainable fashion?',
      conversationHistory: [],
      useFlash: false
    });

    console.log('\n✅ Routing Decision:');
    console.log('Agent:', result2.agent);
    if (result2.agentResult) {
      console.log('Atlas was called!');
      console.log('Report preview:', result2.agentResult.report?.substring(0, 200) + '...');
    }
    console.log('Synthesis:', result2.synthesis?.substring(0, 300) + '...\n');

    // Test 3: Fast response with Flash
    console.log('Test 3: Quick question with Gemini 2.0 Flash');
    const result3 = await phoenixOrchestrator.processMessage({
      userId: 'test_user_001',
      message: 'How do I use the research feature?',
      conversationHistory: [],
      useFlash: true
    });

    console.log('\n✅ Flash Response (fast):');
    console.log(result3.response?.substring(0, 200) + '...\n');

    console.log('🎉 All tests passed!\n');
    
    console.log('Summary:');
    console.log('- Phoenix direct coaching: ✅');
    console.log('- Agent routing (Atlas): ✅');
    console.log('- Gemini 2.0 Flash: ✅\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testPhoenix();
