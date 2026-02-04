// Velo Backend Module: Lead Management
// Unified lead handling - imports from leads.jsw for actual implementation

import { saveCalculatorLead, pushToPipedrive } from './leads.jsw';

/**
 * Main entry point for saving leads
 * Saves to database and optionally pushes to Pipedrive
 */
export async function saveLead(leadData, options = {}) {
  const { pushToCrm = true } = options;
  
  try {
    // Save to Wix database
    const dbResult = await saveCalculatorLead(leadData);
    
    // Push to Pipedrive if enabled
    let crmResult = null;
    if (pushToCrm) {
      try {
        crmResult = await pushToPipedrive(leadData);
      } catch (crmError) {
        console.error('Pipedrive push failed (lead still saved to DB):', crmError);
        // Don't fail the whole operation if CRM push fails
      }
    }
    
    return {
      success: true,
      leadId: dbResult._id,
      crmDealId: crmResult?.data?.id || null
    };
  } catch (error) {
    console.error('Lead save error:', error);
    throw error;
  }
}

// Re-export for convenience
export { saveCalculatorLead, pushToPipedrive };
