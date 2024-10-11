from flask import Flask, render_template, jsonify, request
import os
import pandas as pd
import numpy as np

app = Flask(__name__)

# Path to the directory containing CSV files
csv_directory = 'output/'  # Update with your correct directory

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/csv-files')
def csv_files():
    # Get list of CSV files in the directory
    files = [f for f in os.listdir(csv_directory) if f.endswith('.csv')]
    return jsonify(files)

@app.route('/gps-data')
def gps_data():
    file_name = request.args.get('file')
    file_path = os.path.join(csv_directory, file_name)
    
    # Load and process the CSV data
    data = pd.read_csv(file_path)
    
    # Replace NaN values with None (which translates to null in JSON)
    data = data.replace({np.nan: None})

    # Debugging: Print the first few rows of the data
    print(data.head())

    # Convert DataFrame to list of dictionaries for JSON serialization
    gps_data = data.to_dict(orient='records')

    return jsonify(gps_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
