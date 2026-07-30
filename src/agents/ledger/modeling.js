import geminiClient from '../../integrations/gemini/client.js';
import { LEDGER_SYSTEM_PROMPT } from './prompts.js';
import logger from '../../utils/logger.js';

/**
 * Ledger Financial Modeling Agent
 * Uses Gemini code execution for precise calculations
 */
class LedgerAgent {
  async execute(options) {
    const { userId, params, context } = options;
    const { model_type, current_financials = {}, scenario_variables = {} } = params;

    logger.info('Ledger modeling started', {
      userId,
      model_type,
      current_financials
    });

    try {
      const modelQuery = this._buildModelQuery(model_type, current_financials, scenario_variables, context);

      // Use Gemini 2.5 Pro with code execution
      const result = await geminiClient.generateWithPro({
        systemInstruction: LEDGER_SYSTEM_PROMPT,
        userMessage: modelQuery,
        temperature: 0.3, // Lower temperature for precision
        maxOutputTokens: 3072,
        tools: [{
          codeExecution: {} // Enable code execution
        }]
      });

      logger.info('Ledger modeling completed', {
        userId,
        model_type,
        responseLength: result.text?.length
      });

      return {
        model_type,
        current_financials,
        scenario_variables,
        analysis: result.text,
        timestamp: new Date().toISOString(),
        metadata: {
          agent: 'ledger',
          userId,
          code_execution_used: true
        }
      };

    } catch (error) {
      logger.error('Ledger modeling error', {
        userId,
        model_type,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Build financial model query
   */
  _buildModelQuery(modelType, currentFinancials, scenarioVariables, context) {
    const queries = {
      budget: this._buildBudgetQuery(currentFinancials, scenarioVariables),
      cash_flow: this._buildCashFlowQuery(currentFinancials, scenarioVariables),
      scenario_analysis: this._buildScenarioQuery(currentFinancials, scenarioVariables),
      break_even: this._buildBreakEvenQuery(currentFinancials, scenarioVariables),
      fundraising_need: this._buildFundraisingQuery(currentFinancials, scenarioVariables),
      pricing: this._buildPricingQuery(currentFinancials, scenarioVariables)
    };

    let query = queries[modelType] || queries.budget;

    if (context?.originalMessage) {
      query += `\n\nAdditional context from entrepreneur:\n${context.originalMessage}`;
    }

    return query;
  }

  /**
   * Budget model query
   */
  _buildBudgetQuery(financials, variables) {
    return `
Create a monthly budget model for the next 12 months.

**Current Financials:**
${JSON.stringify(financials, null, 2)}

**Variables:**
${JSON.stringify(variables, null, 2)}

Use Python code execution to:
1. Project monthly revenue based on growth assumptions
2. Calculate fixed and variable expenses
3. Compute monthly profit/loss
4. Determine cash runway

Provide both the code and a summary interpretation.`;
  }

  /**
   * Cash flow query
   */
  _buildCashFlowQuery(financials, variables) {
    return `
Build a cash flow projection model.

**Current Financials:**
${JSON.stringify(financials, null, 2)}

**Scenario Variables:**
${JSON.stringify(variables, null, 2)}

Use Python to calculate:
1. Monthly cash inflows (revenue, investments)
2. Monthly cash outflows (expenses, capital expenditures)
3. Net cash flow per month
4. Cumulative cash position
5. Burn rate and runway

Show monthly projections for 18 months.`;
  }

  /**
   * Scenario analysis query
   */
  _buildScenarioQuery(financials, variables) {
    return `
Run scenario analysis comparing multiple growth/expense scenarios.

**Current State:**
${JSON.stringify(financials, null, 2)}

**Scenario Variables to Test:**
${JSON.stringify(variables, null, 2)}

Use Python to model:
1. **Best Case**: ${variables.best_case_growth || '20% monthly growth'}
2. **Base Case**: ${variables.base_case_growth || '10% monthly growth'}
3. **Conservative**: ${variables.conservative_growth || '5% monthly growth'}

For each scenario, calculate:
- Revenue projection (12 months)
- Break-even timing
- Cash needed
- Risk level

Compare scenarios and recommend which to plan for.`;
  }

  /**
   * Break-even query
   */
  _buildBreakEvenQuery(financials, variables) {
    return `
Calculate break-even analysis.

**Current Financials:**
- Revenue: ${financials.monthly_revenue || financials.mrr || 'Not provided'}
- Fixed costs: ${financials.fixed_costs || 'Not provided'}
- Variable costs: ${financials.variable_costs || 'Not provided'}
- Unit economics: ${JSON.stringify(financials.unit_economics || {})}

**Assumptions:**
${JSON.stringify(variables, null, 2)}

Use Python to calculate:
1. Monthly break-even point (revenue needed to cover costs)
2. Time to break-even given growth rate
3. Cash required to reach break-even
4. Sensitivity analysis (what if growth is slower?)

Provide specific recommendation: Can they afford this decision?`;
  }

  /**
   * Fundraising need query
   */
  _buildFundraisingQuery(financials, variables) {
    return `
Calculate fundraising needs.

**Current State:**
${JSON.stringify(financials, null, 2)}

**Growth Plans:**
${JSON.stringify(variables, null, 2)}

Use Python to determine:
1. Monthly burn rate (current and projected)
2. Desired runway (months of operation)
3. Growth capital needed (hiring, marketing, equipment)
4. Buffer for contingencies (20-30%)
5. Total fundraising target

Break down: How much money do they need and why?`;
  }

  /**
   * Pricing query
   */
  _buildPricingQuery(financials, variables) {
    return `
Analyze pricing strategy and unit economics.

**Current Pricing:**
${JSON.stringify(financials.pricing || {}, null, 2)}

**Cost Structure:**
${JSON.stringify(financials.costs || {}, null, 2)}

**Market Context:**
${JSON.stringify(variables, null, 2)}

Use Python to calculate:
1. Gross margin per unit/customer
2. Customer Acquisition Cost (CAC)
3. Lifetime Value (LTV)
4. LTV:CAC ratio
5. Break-even price point

Test pricing scenarios (lower vs. higher price) and recommend optimal pricing.`;
  }
}

// Singleton instance
const ledgerAgent = new LedgerAgent();
export default ledgerAgent;
