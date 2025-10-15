#!/usr/bin/env python3
"""
Comprehensive Surgical Instruments Data Parser
Handles both old and new CSV structures with Speciality and Set Description fields
"""

import os
import csv
import json
import re
from collections import defaultdict

def clean_text(text):
    """Clean and normalize text data"""
    if not text or text.strip() == '':
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove quotes if they wrap the entire text
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1]
    
    return text

def detect_csv_structure(file_path):
    """Detect which CSV structure is being used"""
    with open(file_path, 'r', encoding='utf-8') as file:
        first_line = file.readline().strip()
        
    # Check for new structure with SPECIALITY and SET DISCRIPTION
    if 'SPECIALITY' in first_line and 'SET DISCRIPTION' in first_line:
        return 'new'
    else:
        return 'old'

def parse_csv_file(file_path, set_name):
    """Parse a single CSV file and return instruments data"""
    structure = detect_csv_structure(file_path)
    instruments = []
    
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row_num, row in enumerate(reader, start=2):  # Start at 2 because header is row 1
            # Skip empty rows
            if not any(value.strip() for value in row.values()):
                continue
            
            # Extract instrument data based on structure
            if structure == 'new':
                instrument = {
                    'name': clean_text(row.get('NAME', '')),
                    'category': clean_text(row.get('CATEGORY', '')),
                    'brief': clean_text(row.get('BRIEF', '')),
                    'description': clean_text(row.get('DISCRIPTION ', '')),  # Note the space in header
                    'type': clean_text(row.get('TYPE', '')),
                    'usage': clean_text(row.get('USAGE', '')),
                    'importantConsiderations': clean_text(row.get('IMPORTANT CONSIDERATIONS', '')),
                    'cleaningSterilization': clean_text(row.get('CLEANING & STERILIZATION', '')),
                    'inspectionMaintenance': clean_text(row.get('INSPECTION & MAINTENANCE', '')),
                    'referenceImages': clean_text(row.get('REFERENCE IMAGES', '')),
                    'speciality': clean_text(row.get('SPECIALITY', '')),
                    'setDescription': clean_text(row.get('SET DISCRIPTION', '')),
                    'sourceFile': os.path.basename(file_path),
                    'rowNumber': row_num
                }
            else:  # old structure
                instrument = {
                    'name': clean_text(row.get('NAME', '')),
                    'category': clean_text(row.get('CATEGORY', '')),
                    'brief': clean_text(row.get('BRIEF', '')),
                    'description': clean_text(row.get('DISCRIPTION ', '')),  # Note the space in header
                    'type': clean_text(row.get('TYPE', '')),
                    'usage': clean_text(row.get('USAGE', '')),
                    'importantConsiderations': clean_text(row.get('IMPORTANT CONSIDERATIONS', '')),
                    'cleaningSterilization': clean_text(row.get('CLEANING & STERILIZATION', '')),
                    'inspectionMaintenance': clean_text(row.get('INSPECTION & MAINTENANCE', '')),
                    'referenceImages': clean_text(row.get('REFERENCE IMAGES', '')),
                    'speciality': '',  # Not available in old structure
                    'setDescription': '',  # Not available in old structure
                    'sourceFile': os.path.basename(file_path),
                    'rowNumber': row_num
                }
            
            # Only add instruments with names
            if instrument['name']:
                instruments.append(instrument)
    
    return instruments, structure

def extract_set_name_from_filename(filename):
    """Extract set name from CSV filename"""
    # Remove "Instrument Description - " prefix and ".csv" suffix
    name = filename.replace('Instrument Description - ', '').replace('.csv', '')
    return name

def parse_all_csv_files(csv_directory):
    """Parse all CSV files in the directory"""
    all_instruments = []
    set_info = {}
    structure_info = {}
    
    csv_files = [f for f in os.listdir(csv_directory) if f.endswith('.csv')]
    csv_files.sort()  # Sort for consistent ordering
    
    print(f"Found {len(csv_files)} CSV files to process...")
    
    for filename in csv_files:
        file_path = os.path.join(csv_directory, filename)
        set_name = extract_set_name_from_filename(filename)
        
        print(f"Processing: {filename} -> {set_name}")
        
        try:
            instruments, structure = parse_csv_file(file_path, set_name)
            
            # Store set information
            set_info[set_name] = {
                'filename': filename,
                'instrumentCount': len(instruments),
                'structure': structure,
                'hasSpeciality': any(instr.get('speciality') for instr in instruments),
                'hasSetDescription': any(instr.get('setDescription') for instr in instruments)
            }
            
            structure_info[filename] = structure
            
            # Add set name to each instrument
            for instrument in instruments:
                instrument['setName'] = set_name
                instrument['sets'] = [set_name]  # For compatibility with existing structure
            
            all_instruments.extend(instruments)
            print(f"  -> Parsed {len(instruments)} instruments using {structure} structure")
            
        except Exception as e:
            print(f"  -> Error processing {filename}: {str(e)}")
            continue
    
    return all_instruments, set_info, structure_info

def create_unique_instruments_data(all_instruments):
    """Create unique instruments data by merging duplicates"""
    unique_instruments = {}
    
    for instrument in all_instruments:
        name = instrument['name']
        
        if name in unique_instruments:
            # Merge sets information
            existing_sets = set(unique_instruments[name]['sets'])
            new_sets = set(instrument['sets'])
            unique_instruments[name]['sets'] = list(existing_sets.union(new_sets))
            
            # Update other fields if they're empty in existing but filled in new
            for field in ['category', 'brief', 'description', 'type', 'usage', 
                         'importantConsiderations', 'cleaningSterilization', 
                         'inspectionMaintenance', 'referenceImages']:
                if not unique_instruments[name][field] and instrument[field]:
                    unique_instruments[name][field] = instrument[field]
            
            # For speciality and setDescription, collect all unique values
            if instrument['speciality'] and instrument['speciality'] not in unique_instruments[name].get('specialities', []):
                if 'specialities' not in unique_instruments[name]:
                    unique_instruments[name]['specialities'] = []
                unique_instruments[name]['specialities'].append(instrument['speciality'])
            
            if instrument['setDescription'] and instrument['setDescription'] not in unique_instruments[name].get('setDescriptions', []):
                if 'setDescriptions' not in unique_instruments[name]:
                    unique_instruments[name]['setDescriptions'] = []
                unique_instruments[name]['setDescriptions'].append(instrument['setDescription'])
                
        else:
            # Create new unique instrument
            unique_instrument = instrument.copy()
            
            # Initialize specialities and setDescriptions lists
            if unique_instrument['speciality']:
                unique_instrument['specialities'] = [unique_instrument['speciality']]
            else:
                unique_instrument['specialities'] = []
            
            if unique_instrument['setDescription']:
                unique_instrument['setDescriptions'] = [unique_instrument['setDescription']]
            else:
                unique_instrument['setDescriptions'] = []
            
            # Remove individual speciality and setDescription fields
            del unique_instrument['speciality']
            del unique_instrument['setDescription']
            
            # Add additional fields for compatibility
            unique_instrument['features'] = []
            unique_instrument['material'] = "Stainless Steel"
            unique_instrument['size'] = "Various"
            unique_instrument['sterilization'] = "Standard sterilization procedures"
            unique_instrument['manufacturer'] = "Various"
            unique_instrument['image'] = f"https://via.placeholder.com/300x200/4A90E2/FFFFFF?text={name.replace(' ', '+')}"
            
            unique_instruments[name] = unique_instrument
    
    return list(unique_instruments.values())

def create_sets_overview(set_info, all_instruments):
    """Create sets overview data"""
    sets_overview = []
    
    # Create a mapping of set names to their specialty and description
    set_specialty_map = {}
    set_description_map = {}
    
    for instrument in all_instruments:
        if instrument.get('sets'):
            for set_name in instrument['sets']:
                if instrument.get('speciality'):
                    set_specialty_map[set_name] = instrument['speciality']
                if instrument.get('setDescription'):
                    set_description_map[set_name] = instrument['setDescription']
    
    for set_name, info in set_info.items():
        set_data = {
            'name': set_name,
            'count': info['instrumentCount'],
            'structure': info['structure'],
            'hasSpeciality': info['hasSpeciality'],
            'hasSetDescription': info['hasSetDescription'],
            'filename': info['filename']
        }
        
        # Add specialty and set description if available
        if set_name in set_specialty_map:
            set_data['speciality'] = set_specialty_map[set_name]
        if set_name in set_description_map:
            set_data['setDescription'] = set_description_map[set_name]
            
        sets_overview.append(set_data)
    
    return sorted(sets_overview, key=lambda x: x['name'])

def main():
    """Main parsing function"""
    csv_directory = 'instrument_csvs'
    
    if not os.path.exists(csv_directory):
        print(f"Error: Directory '{csv_directory}' not found!")
        return
    
    print("Starting comprehensive surgical instruments data parsing...")
    print("=" * 60)
    
    # Parse all CSV files
    all_instruments, set_info, structure_info = parse_all_csv_files(csv_directory)
    
    print("\n" + "=" * 60)
    print("PARSING SUMMARY")
    print("=" * 60)
    print(f"Total instruments parsed: {len(all_instruments)}")
    print(f"Total sets processed: {len(set_info)}")
    
    # Count structures
    old_structure_count = sum(1 for s in structure_info.values() if s == 'old')
    new_structure_count = sum(1 for s in structure_info.values() if s == 'new')
    print(f"Files with old structure: {old_structure_count}")
    print(f"Files with new structure: {new_structure_count}")
    
    # Create unique instruments
    print("\nCreating unique instruments data...")
    unique_instruments = create_unique_instruments_data(all_instruments)
    print(f"Unique instruments: {len(unique_instruments)}")
    
    # Create sets overview
    sets_overview = create_sets_overview(set_info, all_instruments)
    
    # Create complete data structure
    complete_data = {
        'sets': sets_overview,
        'instruments': unique_instruments,
        'metadata': {
            'totalInstruments': len(all_instruments),
            'uniqueInstruments': len(unique_instruments),
            'totalSets': len(set_info),
            'oldStructureFiles': old_structure_count,
            'newStructureFiles': new_structure_count,
            'parsingDate': '2024-01-01'  # Update as needed
        }
    }
    
    # Write output files
    print("\nWriting output files...")
    
    # Write complete instruments data
    with open('data/completeInstrumentsData.js', 'w', encoding='utf-8') as f:
        f.write('// Complete Surgical Instruments Data\n')
        f.write('export const completeInstrumentsData = ')
        f.write(json.dumps(complete_data, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    # Write unique instruments data
    with open('data/uniqueInstruments.js', 'w', encoding='utf-8') as f:
        f.write('// Unique Surgical Instruments Data\n')
        f.write('export const uniqueInstruments = ')
        f.write(json.dumps(unique_instruments, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    # Write sets overview
    with open('data/setsOverview.js', 'w', encoding='utf-8') as f:
        f.write('// Surgical Sets Overview Data\n')
        f.write('export const setsOverview = ')
        f.write(json.dumps(sets_overview, indent=2, ensure_ascii=False))
        f.write(';\n')
    
    # Write detailed parsing report
    with open('parsing_report.json', 'w', encoding='utf-8') as f:
        report = {
            'summary': {
                'totalInstruments': len(all_instruments),
                'uniqueInstruments': len(unique_instruments),
                'totalSets': len(set_info),
                'oldStructureFiles': old_structure_count,
                'newStructureFiles': new_structure_count
            },
            'setInfo': set_info,
            'structureInfo': structure_info
        }
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("PARSING COMPLETE!")
    print("=" * 60)
    print("Output files created:")
    print("- data/completeInstrumentsData.js")
    print("- data/uniqueInstruments.js") 
    print("- data/setsOverview.js")
    print("- parsing_report.json")
    
    # Print some statistics
    print(f"\nStatistics:")
    print(f"- Total instruments: {len(all_instruments)}")
    print(f"- Unique instruments: {len(unique_instruments)}")
    print(f"- Total sets: {len(set_info)}")
    print(f"- Files with speciality data: {sum(1 for s in set_info.values() if s['hasSpeciality'])}")
    print(f"- Files with set description data: {sum(1 for s in set_info.values() if s['hasSetDescription'])}")

if __name__ == "__main__":
    main()

