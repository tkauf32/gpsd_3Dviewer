# GPSD 3D Visualizer

## Overview

This project is a 3D GPS data visualizer built using Cesium.js, which allows you to plot GPS points on a 3D globe. The GPS data is provided in CSV format, and each point's RTK (Real-Time Kinematic) Fix Type is color-coded for easy interpretation. You can also control the altitude display of the points by enabling a flattening feature to set all points to a predefined height.

## Features

- **3D visualization of GPS data:** View GPS data on a 3D globe using Cesium.js.
- **Color-coded fix types:** Points are color-coded based on RTK Fix Type (No Fix, Float, Fixed).
- **Dynamic CSV loading:** Select GPS data files from a list, and the points will update automatically.
- **Altitude flattening option:** Set all points to a fixed altitude for easier analysis.
- **Interactive map controls:** Click on any point to view more information about it, such as latitude, longitude, altitude, and more.
- **Custom home button location:** Quickly navigate back to a predefined home location.

## Requirements

- Cesium.js (with a valid Cesium Ion API token)
- A web server capable of serving GPS data in CSV format via API (e.g., `/gps-data?file=example.csv`).
- Access to a list of CSV files on the server at `/csv-files`.

## Installation

1. **Clone this repository:**

    ```bash
    git clone https://github.com/your-repo/gpsd-3d-visualizer.git
    cd gpsd-3d-visualizer
    ```

2. **Set up a Cesium Ion API Token:**
    - Visit [Cesium Ion](https://cesium.com/platform/cesium-ion/) to create an account and get your API token.
    - Replace the `Cesium.Ion.defaultAccessToken` value with your token in the provided script.

3. **Configure the server:**
    Ensure your web server serves GPS data in the following way:
    - `/gps-data?file=example.csv` should return GPS data in JSON format.
    - `/csv-files` should return a list of available CSV files in JSON format.

4. **Start your server** (example with Node.js, Python, etc.).

5. **Access the visualizer:**
    Open the `index.html` file in your browser or deploy the app to a web server.

## Usage

### CSV Selection
- Use the dropdown menu to select different CSV files containing GPS data.
- The visualizer will automatically fetch and display the selected file's GPS data.

### Flattening Altitude
- Check the "Flatten Altitude" checkbox to set all points to a predefined altitude (`163.0` meters in this example).
- Uncheck it to display the points' actual altitude as specified in the GPS data.

### Point Interaction
- Click on any GPS point to view detailed information about the fix type, number of satellites, and the precise location (latitude, longitude, altitude).

### Custom Home Button
- A custom "Home" button is set to a predefined location (latitude: `42.097891`, longitude: `-87.828332`) with a specific altitude (`300.0` meters). Clicking this button will fly the camera to that location.

## Data Format

The CSV files should follow this structure:

| Lat   | Lon   | Alt (HAE) | Fix type (GPS) | RTK Fix Type | SVs Used |
|-------|-------|-----------|----------------|--------------|----------|
| 42.0  | -87.0 | 100.0     | 3              | Fixed        | 8        |

- **Lat** and **Lon**: Latitude and longitude coordinates.
- **Alt (HAE)**: Height Above Ellipsoid (in meters).
- **Fix type (GPS)**: The GPS fix type, typically ranging from 0 (No fix) to 3 (Fix).
- **RTK Fix Type**: Describes the RTK fix status (`No Fix`, `Float`, or `Fixed`).
- **SVs Used**: Number of satellites used in the calculation.

## License

This project is licensed under the MIT License.

## Credits

- Cesium.js for the 3D visualization platform.
- GPSD for the underlying GPS data format handling.

## Future Improvements

- Add support for visualizing different GPS data formats.
- Implement real-time GPS data streaming.
- Improve data filtering and point rendering performance.

---

Feel free to contribute to this project by submitting issues and pull requests!
