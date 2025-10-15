#!/usr/bin/env python3
"""
Fix parsing for different CSV formats
"""

import os
import csv
import json
import re

def parse_csv_file(filepath):
    """Parse a CSV file and extract instruments"""
    instruments = []
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            # Read the file content
            content = file.read()
            
            # Split by the separator pattern (nine commas)
            entries = re.split(r',{9,}', content)
            
            for entry in entries:
                entry = entry.strip()
                if not entry or len(entry) < 10:  # Skip very short entries
                    continue
                
                # Parse the entry as CSV
                lines = entry.strip().split('\n')
                if len(lines) < 2:
                    continue
                
                # Use csv.reader to properly parse the entry
                reader = csv.reader([entry])
                try:
                    row = next(reader)
                    if len(row) >= 3 and row[0].strip():  # Has at least name
                        instrument = {
                            'name': row[0].strip().strip('"'),
                            'category': row[1].strip().strip('"') if len(row) > 1 and row[1].strip() else 'General',
                            'brief': row[2].strip().strip('"') if len(row) > 2 and row[2].strip() else 'Surgical instrument',
                            'description': row[3].strip().strip('"') if len(row) > 3 and row[3].strip() else '',
                            'usage': row[5].strip().strip('"') if len(row) > 5 and row[5].strip() else 'General surgical use',
                            'features': [],
                            'material': 'Stainless Steel',
                            'size': 'Various',
                            'sterilization': 'Standard sterilization procedures',
                            'manufacturer': 'Various',
                            'image': f'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text={row[0].strip().strip('"').replace(" ", "+")}'
                        }
                        instruments.append(instrument)
                except Exception as e:
                    print(f"Error parsing entry: {e}")
                    continue
                    
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
    
    return instruments

def main():
    # Directory containing CSV files
    csv_dir = 'instrument_csvs'
    
    # Get all CSV files
    csv_files = [f for f in os.listdir(csv_dir) if f.endswith('.csv')]
    
    all_sets = []
    all_instruments = []
    instrument_to_sets = {}
    
    for csv_file in csv_files:
        filepath = os.path.join(csv_dir, csv_file)
        set_name = csv_file.replace('Instrument Description - ', '').replace('.csv', '')
        
        print(f"Processing {csv_file}...")
        instruments = parse_csv_file(filepath)
        
        print(f"  Found {len(instruments)} instruments")
        
        # Add set information
        set_data = {
            'name': set_name,
            'count': len(instruments),
            'instruments': instruments,
            'filename': csv_file
        }
        all_sets.append(set_data)
        
        # Add instruments to global list and track which sets they belong to
        for instrument in instruments:
            # Add to global instruments list if not already there
            existing_instrument = None
            for existing in all_instruments:
                if existing['name'].lower() == instrument['name'].lower():
                    existing_instrument = existing
                    break
            
            if existing_instrument:
                # Add this set to the existing instrument's sets
                if set_name not in existing_instrument['sets']:
                    existing_instrument['sets'].append(set_name)
            else:
                # Add new instrument
                instrument['sets'] = [set_name]
                all_instruments.append(instrument)
    
    # Create the complete data structure
    complete_data = {
        'sets': all_sets,
        'instruments': all_instruments
    }
    
    # Write to JavaScript file
    with open('data/completeInstrumentsData.js', 'w', encoding='utf-8') as f:
        f.write('// Complete Surgical Instruments Data\n')
        f.write('export const completeInstrumentsData = ')
        f.write(json.dumps(complete_data, indent=2))
        f.write(';\n')
    
    print(f"\nTotal sets: {len(all_sets)}")
    print(f"Total unique instruments: {len(all_instruments)}")
    
    # Print summary for each set
    for set_data in all_sets:
        print(f"{set_data['name']}: {set_data['count']} instruments")

if __name__ == '__main__':
    main()
