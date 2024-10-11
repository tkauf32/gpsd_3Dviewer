import csv
import glob
import os

# Define the columns of interest
columns_of_interest = [
    "Index", "UTC", "Lat", "Lon", "Alt (HAE)", 
    "PDOP", "HDOP", "VDOP", "Fix type (GPS)", "SVs Used",
    "Carrier Range Status", "RTK Fix Type"
]

# Mapping for Carrier Range Status
carrier_range_map = {
    "0": "No Fix",
    "1": "Float",
    "2": "Fixed"
}

def extract_columns(input_csv, output_csv):
    with open(input_csv, 'r') as infile:
        reader = csv.DictReader(infile)
        
        # Check if all required columns (excluding RTK Fix Type) are present
        for col in columns_of_interest[:-1]:  # Exclude "RTK Fix Type" as it is added by us
            if col not in reader.fieldnames:
                raise ValueError(f"Column '{col}' is missing in the input CSV")

        with open(output_csv, 'w', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=columns_of_interest)
            writer.writeheader()
            
            for row in reader:
                # Map Carrier Range Status to RTK Fix Type
                carrier_range_status = row.get("Carrier Range Status", "")
                rtk_fix_type = carrier_range_map.get(carrier_range_status, "Unknown")
                
                # Add RTK Fix Type to the row
                row["RTK Fix Type"] = rtk_fix_type
                
                # Extract the desired columns and write to the new CSV
                extracted_row = {col: row.get(col, "") for col in columns_of_interest}
                writer.writerow(extracted_row)

if __name__ == "__main__":
    input_dir = 'input/'  # Replace with your input directory path
    output_dir = 'output/'  # Replace with your output directory path
    
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Get the list of input and output files (without the directory path)
    input_files = set(os.path.basename(f) for f in glob.glob(os.path.join(input_dir, '*.csv')))
    output_files = set(os.path.basename(f) for f in glob.glob(os.path.join(output_dir, '*.csv')))
    
    # Find new files in input that are not in output
    new_files = input_files - output_files
    
    # Process each new CSV file in the input directory
    for input_file in new_files:
        input_csv = os.path.join(input_dir, input_file)
        output_csv = os.path.join(output_dir, input_file)
        try:
            extract_columns(input_csv, output_csv)
            print(f"Data successfully extracted to {output_csv}")
        except ValueError as e:
            print(f"Error processing {input_csv}: {e}")
