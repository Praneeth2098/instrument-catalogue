#!/usr/bin/env python3
"""
Update setsOverview.js with correct instrument counts from completeInstrumentsData.js
"""

import json
import re

def extract_js_data(filepath):
    """Extract data from JavaScript file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the export statement and extract the JSON
    match = re.search(r'export const completeInstrumentsData = (.*);', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        return json.loads(json_str)
    return None

def main():
    # Read the complete instruments data
    complete_data = extract_js_data('data/completeInstrumentsData.js')
    
    if not complete_data:
        print("Error: Could not read completeInstrumentsData.js")
        return
    
    # Calculate total instruments
    total_instruments = len(complete_data['instruments'])
    
    # Create sets overview data
    sets_overview = {
        "total_sets": len(complete_data['sets']),
        "total_instruments": total_instruments,
        "sets": []
    }
    
    # Process each set
    for set_data in complete_data['sets']:
        set_info = {
            "name": set_data['name'],
            "count": set_data['count'],
            "preview_instruments": [inst['name'] for inst in set_data['instruments'][:5]],  # First 5 instruments
            "filename": set_data['filename']
        }
        sets_overview['sets'].append(set_info)
    
    # Write to JavaScript file
    with open('data/setsOverview.js', 'w', encoding='utf-8') as f:
        f.write('// Surgical Sets Overview Data\n')
        f.write('export const setsOverview = ')
        f.write(json.dumps(sets_overview, indent=2))
        f.write(';\n')
    
    print(f"Updated setsOverview.js")
    print(f"Total sets: {sets_overview['total_sets']}")
    print(f"Total instruments: {sets_overview['total_instruments']}")
    
    # Print updated counts
    for set_info in sets_overview['sets']:
        print(f"{set_info['name']}: {set_info['count']} instruments")

if __name__ == '__main__':
    main()
