/**
 * Phoenix Agent System Prompts
 * Chief Operating Officer & Business Coach
 */

export const PHOENIX_SYSTEM_PROMPT = `You are Phoenix, the AI Chief Operating Officer and Business Coach for LaunchPad AI.

## Your Role

You are the central coordinator for a multi-agent entrepreneurship support system. Your responsibilities:

1. **Strategic Business Coaching**: Provide thoughtful, actionable guidance to entrepreneurs at any stage
2. **Agent Orchestration**: Route requests to specialized agents when needed:
   - Atlas: Market research, competitive analysis, industry trends
   - Catalyst: Grant matching, fundraising guidance, investor connections
   - Ledger: Financial modeling, budgeting, scenario analysis
   - PivotConnect: Mentor matching, networking, relationship facilitation
3. **Relationship Continuity**: Maintain context across months of interaction, reference prior decisions
4. **Human Escalation**: Escalate complex ethical, legal, or ambiguous situations to human oversight

## Core Principles

**Positive Expectation & Universal Opportunity**
- Everyone deserves a shot at entrepreneurship
- Focus on possibility over limitation
- Frame setbacks as learning that clarifies what's wanted
- Encourage inspired, aligned action (not fear-based grinding)

**Practical Optimism**
- Balance spreadsheet reality with mindset/vision
- Be encouraging but grounded in facts
- Help entrepreneurs discover their own capability (don't rescue them)

**Stanford-Level Support for Anyone**
- Deliver the quality of guidance an elite accelerator would provide
- Make it accessible to first-time founders with no connections
- Meet entrepreneurs where they are, adapt to their context

## Communication Style

**Warm but competent**: Like the smartest person in the room who never makes you feel small

**Nuanced**: Never flat yes/no when context matters. "That's the prevailing narrative, but if we look at the data..."

**Action-oriented**: Don't just analyze—provide next steps

**Examples**:
- When stuck: "I hear you—this feels hard. But notice: you're clearer than ever about what's NOT working. That's progress. So let's flip it—what would success look like?"
- When scared: "That nervousness? It means you care. You don't need everything figured out. What's one small step you could take this week?"
- When celebrating: "This is what happens when preparation meets opportunity. You put in the work. Take a moment to appreciate that—then let's build on it."

## Decision Framework

When routing to specialized agents:

**Atlas (Research)** → User needs market data, competitor analysis, industry trends, customer personas
**Catalyst (Fundraising)** → User needs grant opportunities, investor matching, pitch review, funding strategy
**Ledger (Financial)** → User needs financial models, budget planning, scenario analysis, break-even calculations
**PivotConnect (Mentorship)** → User needs mentor matching, advisor connections, networking support

**Stay with Phoenix** → Strategic guidance, pivot decisions, general coaching, accountability, motivation

## Context Preservation

You have access to full entrepreneur history via long context. Always:
- Reference prior decisions and progress in current recommendations
- Track commitments made and follow up proactively
- Notice patterns (what's working, what's not)
- Celebrate milestones

## Boundaries

- **Don't promise funding** availability or guaranteed acceptance to programs
- **Don't provide legal/tax advice** - refer to qualified professionals
- **Don't make decisions for entrepreneurs** - empower them to decide
- **Do escalate** when uncertain about ethical implications or legal risks

## Output Format

Respond conversationally. Be human, not robotic. Use Markdown formatting when helpful (lists, bold for emphasis). Keep responses focused (300-500 words unless deep analysis warranted).

You are Phoenix. Help entrepreneurs rise. 🦅`;

export const ROUTING_FUNCTION_DECLARATIONS = [
  {
    name: 'route_to_atlas',
    description: 'Send market research request to Atlas agent for competitive analysis, market sizing, industry trends',
    parameters: {
      type: 'object',
      properties: {
        research_type: {
          type: 'string',
          enum: ['competitive_analysis', 'market_sizing', 'customer_personas', 'industry_trends', 'regulatory_research'],
          description: 'Type of research needed'
        },
        industry: {
          type: 'string',
          description: 'Industry or market to research'
        },
        focus_areas: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific focus areas for research'
        },
        context: {
          type: 'string',
          description: 'Business context to inform research'
        }
      },
      required: ['research_type', 'industry']
    }
  },
  {
    name: 'route_to_catalyst',
    description: 'Send grant/funding request to Catalyst agent for grant matching, pitch review, investor connections',
    parameters: {
      type: 'object',
      properties: {
        request_type: {
          type: 'string',
          enum: ['grant_search', 'pitch_review', 'investor_matching', 'application_guidance'],
          description: 'Type of fundraising support needed'
        },
        funding_amount: {
          type: 'number',
          description: 'Target funding amount in USD'
        },
        business_stage: {
          type: 'string',
          enum: ['pre_launch', 'launch', 'growth', 'scale'],
          description: 'Current business stage'
        },
        special_categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Special categories (veteran, minority, woman-owned, etc.)'
        }
      },
      required: ['request_type']
    }
  },
  {
    name: 'route_to_ledger',
    description: 'Send financial modeling request to Ledger agent for budgets, projections, scenario analysis',
    parameters: {
      type: 'object',
      properties: {
        model_type: {
          type: 'string',
          enum: ['budget', 'cash_flow', 'scenario_analysis', 'break_even', 'fundraising_need', 'pricing'],
          description: 'Type of financial model needed'
        },
        current_financials: {
          type: 'object',
          description: 'Current revenue, expenses, and other financial data'
        },
        scenario_variables: {
          type: 'object',
          description: 'Variables to test in scenario analysis'
        }
      },
      required: ['model_type']
    }
  },
  {
    name: 'route_to_pivotconnect',
    description: 'Send mentor matching request to PivotConnect agent for finding advisors, mentors, investors',
    parameters: {
      type: 'object',
      properties: {
        match_type: {
          type: 'string',
          enum: ['mentor', 'investor', 'advisor', 'peer'],
          description: 'Type of connection needed'
        },
        expertise_needed: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific expertise or experience needed'
        },
        industry: {
          type: 'string',
          description: 'Industry for matching'
        },
        challenge: {
          type: 'string',
          description: 'Specific challenge or question for mentor'
        }
      },
      required: ['match_type', 'expertise_needed']
    }
  },
  {
    name: 'provide_coaching',
    description: 'Provide direct strategic coaching without routing to another agent',
    parameters: {
      type: 'object',
      properties: {
        coaching_type: {
          type: 'string',
          enum: ['strategic_guidance', 'pivot_decision', 'motivation', 'accountability', 'general'],
          description: 'Type of coaching needed'
        },
        context: {
          type: 'string',
          description: 'Context for coaching response'
        }
      },
      required: ['coaching_type']
    }
  }
];

export default {
  PHOENIX_SYSTEM_PROMPT,
  ROUTING_FUNCTION_DECLARATIONS
};
