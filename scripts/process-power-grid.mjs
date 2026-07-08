import fs from 'fs';
import path from 'path';
import * as turf from '@turf/turf';

// Rough polygon approximating Turkey's land borders and territorial waters.
// This is used to clip out erroneous lines (like Syrian or Greek grids) that bleed in.
const TURKEY_POLYGON = turf.polygon([[
  [25.6, 42.2], // Northwest (Edirne area)
  [29.0, 42.5], // Black Sea West
  [35.0, 42.5], // Black Sea Mid
  [41.5, 41.8], // Black Sea East
  [44.8, 40.0], // Northeast (Igdir area)
  [44.8, 37.0], // East (Hakkari/Van area)
  [43.0, 37.0], // Southeast (Iraq border)
  [40.0, 36.8], // Southeast (Syria border east)
  [38.0, 36.7], // Southeast (Syria border mid)
  [36.8, 36.7], // North of Aleppo
  [36.8, 35.8], // Hatay East dip
  [35.8, 35.8], // Hatay South dip
  [35.8, 36.7], // Hatay West
  [34.0, 36.0], // Mediterranean (Antalya/Mersin area)
  [29.0, 36.0], // Mediterranean West
  [27.0, 36.5], // Aegean South
  [25.6, 38.0], // Aegean Mid
  [25.6, 42.2]  // Close polygon
]]);

// Only these element types will be included
const ALLOWED_ELEMENT_TYPES = new Set(['line', 'minor_line', 'cable', 'substation', 'plant']);

function processGeojson() {
  const inputPath = path.resolve('docs/OSM_maps/osm-power-grid.geojson');
  const outputPath = path.resolve('app/public/power-grid-filtered.geojson');

  console.log('Reading input file...', inputPath);
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log(`Original feature count: ${data.features.length}`);

  const filteredFeatures = data.features.filter((feature) => {
    const props = feature.properties;
    if (!props) return false;

    // Filter by element type
    if (!ALLOWED_ELEMENT_TYPES.has(props.elementType)) {
      return false;
    }

    // Filter by Country Code (Turkey only)
    if (props.countryCode !== 'TR') {
      return false;
    }

    // Advanced Geographic Filtering: Check if ANY point of the geometry is inside the rough Turkey polygon
    try {
      let isInside = false;
      if (feature.geometry.type === 'Point') {
        isInside = turf.booleanPointInPolygon(feature.geometry.coordinates, TURKEY_POLYGON);
      } else if (feature.geometry.type === 'LineString') {
        // For lines, if at least one point is in Turkey, we keep it. 
        // This clips out lines completely in Syria/Greece that were somehow tagged 'TR'.
        for (const coord of feature.geometry.coordinates) {
          if (turf.booleanPointInPolygon(coord, TURKEY_POLYGON)) {
            isInside = true;
            break;
          }
        }
      } else if (feature.geometry.type === 'Polygon') {
        isInside = turf.booleanPointInPolygon(feature.geometry.coordinates[0][0], TURKEY_POLYGON);
      } else {
        isInside = true; // Fallback for other geometry types
      }

      if (!isInside) {
        return false;
      }
    } catch (err) {
      // Ignore turf errors and keep the feature just in case
    }

    return true;
  }).map((feature) => {
    // Keep only essential metadata
    const props = feature.properties;
    let voltage = null;

    if (props.voltagesKv && props.voltagesKv.length > 0) {
      voltage = props.voltagesKv[0]; // primary voltage in kV
    } else if (props.tags && props.tags.voltage) {
      // fallback to tags.voltage
      const v = parseInt(props.tags.voltage.split(';')[0], 10);
      if (!isNaN(v)) {
        voltage = v >= 1000 ? v / 1000 : v;
      }
    }

    return {
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        id: props.osmId || null,
        type: props.elementType,
        name: props.tags?.name || null,
        voltage: voltage,
      }
    };
  });

  const outputData = {
    type: 'FeatureCollection',
    features: filteredFeatures
  };

  console.log(`Filtered feature count: ${filteredFeatures.length}`);

  fs.writeFileSync(outputPath, JSON.stringify(outputData));
  
  const stats = fs.statSync(outputPath);
  console.log(`Output saved to ${outputPath}`);
  console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

processGeojson();
