/**
 * Google Sheets Data Service
 * Fetches data from a published Google Sheet and converts it to instrument objects
 */

// Helper function to parse CSV text into array of objects
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    if (!line.trim()) return null; // Skip empty lines
    
    const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    
    return obj;
  }).filter(item => item !== null);
};

// Helper function to convert CSV row to instrument object
const csvRowToInstrument = (row) => {
  return {
    id: row.id || Math.random().toString(36).substr(2, 9),
    name: row.name || 'Unknown Instrument',
    category: row.category || 'General',
    description: row.description || 'No description available',
    image: row.image || 'https://via.placeholder.com/400x300?text=Instrument+Image',
    features: row.features ? row.features.split(';').map(f => f.trim()) : [],
    usage: row.usage || 'General surgical use',
    // Add any additional fields from your Google Sheet
    manufacturer: row.manufacturer || '',
    size: row.size || '',
    material: row.material || '',
    sterilization: row.sterilization || '',
  };
};

/**
 * Fetches instruments data from a published Google Sheet
 * @param {string} sheetId - The Google Sheet ID from the URL
 * @param {string} sheetName - The name of the sheet tab (default: 'Sheet1')
 * @returns {Promise<Array>} Array of instrument objects
 */
export const fetchInstrumentsFromGoogleSheet = async (sheetId, sheetName = 'Sheet1') => {
  try {
    // Construct the CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    console.log('Fetching data from Google Sheet:', csvUrl);
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV data received:', csvText.substring(0, 200) + '...');
    
    // Parse CSV into array of objects
    const csvData = parseCSV(csvText);
    console.log('Parsed CSV data:', csvData);
    
    // Convert to instrument objects
    const instruments = csvData.map(csvRowToInstrument);
    
    console.log('Converted instruments:', instruments);
    
    return instruments;
    
  } catch (error) {
    console.error('Error fetching data from Google Sheet:', error);
    
    // Return fallback data in case of error
    return [
      {
        id: 'fallback-1',
        name: 'Scalpel',
        category: 'Cutting',
        description: 'A small and extremely sharp bladed instrument used for surgery, anatomical dissection, and various arts and crafts.',
        image: 'https://via.placeholder.com/400x300?text=Scalpel',
        features: ['Sharp blade', 'Precise cutting', 'Sterile'],
        usage: 'Making precise incisions in tissue',
        manufacturer: 'Sample Manufacturer',
        size: 'Various sizes',
        material: 'Stainless steel',
        sterilization: 'Autoclave',
      }
    ];
  }
};

/**
 * Example usage and setup instructions
 */
export const setupInstructions = {
  step1: "Create a Google Sheet with columns: name, category, description, image, features, usage, manufacturer, size, material, sterilization",
  step2: "Publish the sheet: File > Share > Publish to web > CSV format",
  step3: "Copy the sheet ID from the URL (the long string between /d/ and /edit)",
  step4: "Use the sheet ID in your app to fetch data",
  exampleUrl: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0",
  csvUrl: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0"
};

