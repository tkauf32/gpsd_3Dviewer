import csv

def dms_to_decimal(degrees, minutes, direction):
    """Convert DMS to decimal degrees."""
    decimal = degrees + minutes / 60.0
    if direction in ['S', 'W']:
        decimal = -decimal
    return decimal

def process_gnss_data(input_file, output_file):
    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames + ['latitude_decimal', 'longitude_decimal', 'HAE']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            try:
                # Debugging: Print row contents to identify issues
                print(f"Processing row: {row}")

                # Check if the necessary fields are present and not empty
                if row['latitude'] and row['longitude'] and row['altitude msl'] and row['geoid (HAE-MSL)']:
                    lat_degrees = int(row['latitude'][:2])
                    lat_minutes = float(row['latitude'][2:])
                    lon_degrees = int(row['longitude'][:2])
                    lon_minutes = float(row['longitude'][2:])
                    
                    lat_decimal = dms_to_decimal(lat_degrees, lat_minutes, row['northing'])
                    lon_decimal = dms_to_decimal(lon_degrees, lon_minutes, row['easting'])
                    
                    altitude_msl = float(row['altitude msl'])
                    geoid_separation = float(row['geoid (HAE-MSL)'])
                    hae = altitude_msl + geoid_separation
                    
                    row['latitude_decimal'] = lat_decimal
                    row['longitude_decimal'] = lon_decimal
                    row['HAE'] = hae
                    
                    writer.writerow(row)
                else:
                    # Print missing fields for debugging
                    missing_fields = []
                    if not row['latitude']:
                        missing_fields.append('latitude')
                    if not row['longitude']:
                        missing_fields.append('longitude')
                    if not row['altitude msl']:
                        missing_fields.append('altitude msl')
                    if not row['geoid (HAE-MSL)']:
                        missing_fields.append('geoid (HAE-MSL)')
                    raise ValueError(f"Missing required field(s): {', '.join(missing_fields)}")
            except (ValueError, KeyError) as e:
                print(f"Skipping row due to error: {e}")
                continue

input_file = '../gnss_data.csv'  # Replace with your input CSV file path
output_file = 'processed_gnss_data.csv'  # Replace with your desired output CSV file path

process_gnss_data(input_file, output_file)
