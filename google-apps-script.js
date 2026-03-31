/**
 * Baker Advice Group - New Client Form Google Apps Script
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (this will store your submissions)
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire script into the editor
 * 4. Click Deploy > New deployment
 * 5. Select type: "Web app"
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Click Deploy and copy the URL
 * 9. Paste that URL into index.html where it says __APPS_SCRIPT_URL__
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Set up headers on first run
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Submitted', 'Full Name', 'DOB', 'Mobile', 'Email',
        'Residential Address', 'Postal Address', 'TFN',
        // Situation flags
        'Spouse?', 'Dependants?', 'Sole Trader?', 'Company?', 'Trust?', 'SMSF?',
        'Rental Property?', 'Shares?', 'Capital Gains?', 'Crypto?',
        'Foreign Income?', 'Investments?', 'Income Protection?', 'PHI?', 'Depreciation?',
        // Agent
        'Agent Nominated?',
        // Spouse
        'Spouse Name', 'Spouse DOB', 'Spouse Mobile', 'Spouse Email',
        'Spouse Address', 'Spouse Postal', 'Spouse TFN',
        // Company
        'Company Name', 'Company ABN', 'Company ACN', 'Company TFN',
        'Directors', 'Director ID', 'Director POB', 'Secretary', 'Shareholders',
        // Trust
        'Trust Name', 'Trust Type', 'Trust ABN', 'Trust TFN', 'Trustees', 'Beneficiaries',
        // SMSF
        'SMSF Name', 'SMSF ABN', 'SMSF TFN', 'SMSF Trustees', 'SMSF Members',
        // Children
        'Children',
        // Bank
        'Bank Account Name', 'BSB', 'Account Number',
        // Other
        'Previous Accountant', 'Additional Info',
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Format children as readable string
    let childrenStr = '';
    if (data.children && data.children.length > 0) {
      childrenStr = data.children
        .filter(c => c.name)
        .map(c => `${c.name} (DOB: ${c.dob || 'N/A'}, Dep: ${c.dependant})`)
        .join(' | ');
    }

    const row = [
      data.submittedAt ? new Date(data.submittedAt).toLocaleString('en-AU') : new Date().toLocaleString('en-AU'),
      data.fullName || '',
      data.dob || '',
      data.mobile || '',
      data.email || '',
      data.residentialAddress || '',
      data.postalAddress || '',
      data.tfn || '',
      // Situation flags
      data.situation_spouse || 'No',
      data.situation_dependants || 'No',
      data.situation_soleTrader || 'No',
      data.situation_company || 'No',
      data.situation_trust || 'No',
      data.situation_smsf || 'No',
      data.situation_rentalProperty || 'No',
      data.situation_shares || 'No',
      data.situation_capitalGains || 'No',
      data.situation_crypto || 'No',
      data.situation_foreignIncome || 'No',
      data.situation_investments || 'No',
      data.situation_incomeProtection || 'No',
      data.situation_phi || 'No',
      data.situation_depreciation || 'No',
      // Agent
      data.agentNomination || '',
      // Spouse
      data.spouseFullName || '',
      data.spouseDob || '',
      data.spouseMobile || '',
      data.spouseEmail || '',
      data.spouseResidentialAddress || '',
      data.spousePostalAddress || '',
      data.spouseTfn || '',
      // Company
      data.companyName || '',
      data.companyAbn || '',
      data.companyAcn || '',
      data.companyTfn || '',
      data.companyDirectors || '',
      data.companyDirectorId || '',
      data.companyDirectorPob || '',
      data.companySecretary || '',
      data.companyShareholders || '',
      // Trust
      data.trustName || '',
      data.trustType || '',
      data.trustAbn || '',
      data.trustTfn || '',
      data.trustTrustees || '',
      data.trustBeneficiaries || '',
      // SMSF
      data.smsfName || '',
      data.smsfAbn || '',
      data.smsfTfn || '',
      data.smsfTrustees || '',
      data.smsfMembers || '',
      // Children
      childrenStr,
      // Bank
      data.bankAccountName || '',
      data.bankBsb || '',
      data.bankAccountNumber || '',
      // Other
      data.previousAccountant || '',
      data.additionalInfo || '',
    ];

    sheet.appendRow(row);

    // Auto-resize columns for readability
    try { sheet.autoResizeColumns(1, row.length); } catch(e) {}

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Required for GET requests (testing)
function doGet(e) {
  return ContentService
    .createTextOutput('Baker Advice Group - Onboarding Form Backend is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
