#!/usr/bin/env python3
"""
Final fix for CSV parsing - handles multi-line entries properly
"""

import os
import csv
import json
import re

def parse_csv_file(filepath):
    """Parse a CSV file and extract instruments"""
    instruments = []
    
    try:
        with open(filepath, 'r', encoding='utf-8', newline='') as file:
            # Read the entire file content
            content = file.read()
            
            # Split by the separator pattern (nine commas)
            entries = re.split(r',{9,}', content)
            
            for entry in entries:
                entry = entry.strip()
                if not entry or len(entry) < 10:  # Skip very short entries
                    continue
                
                # Use csv.reader with proper handling of newlines in quoted fields
                try:
                    # Create a StringIO object for the entry
                    import io
                    entry_io = io.StringIO(entry)
                    reader = csv.reader(entry_io, quotechar='"', skipinitialspace=True)
                    row = next(reader)
                    
                    if len(row) >= 3 and row[0].strip():  # Has at least name
                        # Clean up the name
                        name = row[0].strip().strip('"')
                        if not name or name == 'NAME':  # Skip empty names and header row
                            continue
                        
                        # Extract all fields, handling empty ones
                        category = row[1].strip().strip('"') if len(row) > 1 and row[1].strip() else 'General'
                        brief = row[2].strip().strip('"') if len(row) > 2 and row[2].strip() else 'Surgical instrument'
                        description = row[3].strip().strip('"') if len(row) > 3 and row[3].strip() else ''
                        type_field = row[4].strip().strip('"') if len(row) > 4 and row[4].strip() else ''
                        usage = row[5].strip().strip('"') if len(row) > 5 and row[5].strip() else 'General surgical use'
                        important_considerations = row[6].strip().strip('"') if len(row) > 6 and row[6].strip() else ''
                        cleaning_sterilization = row[7].strip().strip('"') if len(row) > 7 and row[7].strip() else ''
                        inspection_maintenance = row[8].strip().strip('"') if len(row) > 8 and row[8].strip() else ''
                        reference_images = row[9].strip().strip('"') if len(row) > 9 and row[9].strip() else ''
                        
                        instrument = {
                            'name': name,
                            'category': category,
                            'brief': brief,
                            'description': description,
                            'type': type_field,
                            'usage': usage,
                            'importantConsiderations': important_considerations,
                            'cleaningSterilization': cleaning_sterilization,
                            'inspectionMaintenance': inspection_maintenance,
                            'referenceImages': reference_images,
                            'features': [],
                            'material': 'Stainless Steel',
                            'size': 'Various',
                            'sterilization': 'Standard sterilization procedures',
                            'manufacturer': 'Various',
                            'image': f'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text={name.replace(" ", "+").replace("/", "%2F").replace("'", "%27")}'
                        }
                        instruments.append(instrument)
                        
                except Exception as e:
                    print(f"Error parsing entry in {os.path.basename(filepath)}: {e}")
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
    
    # Print a sample instrument to verify data
    if all_instruments:
        sample = all_instruments[0]
        print(f"\nSample instrument data:")
        print(f"Name: {sample['name']}")
        print(f"Brief: {sample['brief'][:100]}...")
        print(f"Description: {sample['description'][:100]}...")
        print(f"Usage: {sample['usage'][:100]}...")

if __name__ == '__main__':
    main()
