Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZTZiZGIwOC0xOGExLTQzM2YtODZhZi05ODkzN2Q5ZWE0NzYiLCJpZCI6MTU0NjU2LCJpYXQiOjE3MTcwOTQ0ODF9.ufxmy1WMHCiZ087mypyV5vPVZc-xJCmiy-q5CByshew';

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// Set a custom home button position
const homeLat = 42.097891; // Example latitude
const homeLon = -87.828332; // Example longitude
const homeHeight = 300.0; // Height above the terrain
let flattenBool = false;
const FLATTEN_HEIGHT = 163.0;  // Predefined height in meters for flattening


viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(homeLon, homeLat, homeHeight)
    });
    commandInfo.cancel = true; // Cancel default behavior
});


document.addEventListener('DOMContentLoaded', function() {
    const flattenCheckbox = document.getElementById('flattenCheckbox');
    const csvSelector = document.getElementById('csvSelector');

    const colorMap = {
        'No Fix': Cesium.Color.RED,
        'Float': Cesium.Color.BLUE,
        'Fixed': Cesium.Color.GREEN
    };

    function getColorByFixType(fixType) {
        return colorMap[fixType] || Cesium.Color.WHITE;
    }

    function fetchAndPlotData() {
        const selectedFile = csvSelector.value;
        fetch(`/gps-data?file=${selectedFile}`)
            .then(response => response.json())
            .then(data => {
                viewer.entities.removeAll();  // Clear existing entities

                data.forEach(point => {
                    if (point.Lat && point.Lon && point['Alt (HAE)'] !== undefined) {
                        const position = Cesium.Cartesian3.fromDegrees(
                            point.Lon,
                            point.Lat,
                            flattenBool ? FLATTEN_HEIGHT : point['Alt (HAE)']
                        );

                        viewer.entities.add({
                            position: position,
                            point: {
                                pixelSize: 10,
                                color: getColorByFixType(point['RTK Fix Type']),
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2
                            },
                            description: `
                                <p><strong>Latitude:</strong> ${point.Lat}</p>
                                <p><strong>Longitude:</strong> ${point.Lon}</p>
                                <p><strong>HAE:</strong> ${point['Alt (HAE)']}</p>
                                <p><strong>Fix mode:</strong> ${point['Fix type (GPS)']}</p>
                                <p><strong>RTK Fix Type:</strong> ${point['RTK Fix Type']}</p>
                                <p><strong># Satellites:</strong> ${point['SVs Used']}</p>
                            `
                        });
                    }
                });

                // Automatically zoom to the points
                if (data.length > 0) {
                    viewer.zoomTo(viewer.entities);
                }
            })
            .catch(error => console.error('Error fetching GPS data:', error));
    }

    flattenCheckbox.addEventListener('change', function () {
        flattenBool = this.checked;
        fetchAndPlotData();
    });

    csvSelector.addEventListener('change', function () {
        fetchAndPlotData();
    });

    // Fetch list of CSV files from the server and populate the selector
    fetch('/csv-files')
        .then(response => response.json())
        .then(csvFiles => {
            csvSelector.innerHTML = ''; // Clear previous options
            csvFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.text = file;
                csvSelector.appendChild(option);
            });
            fetchAndPlotData();  // Load data from the first file by default
        });
});

// Ensure this is in place to handle clicks on the points and show the info box
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
        viewer.selectedEntity = pickedObject.id;
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Color mapping based on RTK Fix Type
const colorMap = {
    'No Fix': Cesium.Color.RED,
    'Float': Cesium.Color.BLUE,
    'Fixed': Cesium.Color.GREEN
};

// Function to plot data points
function plotDataPoints(data) {
    viewer.entities.removeAll();

    data.forEach(point => {
        if (point.Lat && point.Lon && point['Alt (HAE)']) {
            const position = Cesium.Cartesian3.fromDegrees(
                point.Lon,
                point.Lat,
                point['Alt (HAE)']
            );

            const entity = viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 10,
                    color: colorMap[point['RTK Fix Type']] || Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2
                },
                description: `
                    <p><strong>Latitude:</strong> ${point.Lat}</p>
                    <p><strong>Longitude:</strong> ${point.Lon}</p>
                    <p><strong>HAE:</strong> ${point['Alt (HAE)']}</p>
                    <p><strong>Fix mode:</strong> ${point['Fix type (GPS)']}</p>
                    <p><strong>RTK Fix Type:</strong> ${point['RTK Fix Type']}</p>
                    <p><strong># Satellites:</strong> ${point['SVs Used']}</p>
                `
            });
        }
    });

    if (data.length > 0) {
        viewer.zoomTo(viewer.entities);
    }
}

// Event listener for clicking on points
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
        viewer.selectedEntity = pickedObject.id;
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Fetch data and plot
function fetchAndPlotData(csvFile) {
    fetch(`/gps-data?file=${csvFile}`)
        .then(response => response.json())
        .then(data => {
            plotDataPoints(data);
        })
        .catch(error => console.error('Error fetching GPS data:', error));
}

// On DOM load
document.addEventListener('DOMContentLoaded', function () {
    const csvSelector = document.getElementById('csvSelector');
    const flattenCheckbox = document.getElementById('flattenCheckbox');

    // Populate CSV selector and plot initial data
    fetch('/csv-files')
        .then(response => response.json())
        .then(csvFiles => {
            csvSelector.innerHTML = '';
            csvFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.text = file;
                csvSelector.appendChild(option);
            });
            fetchAndPlotData(csvSelector.value);
        });

    // Event listener for CSV selection change
    csvSelector.addEventListener('change', function () {
        fetchAndPlotData(csvSelector.value);
    });
});
