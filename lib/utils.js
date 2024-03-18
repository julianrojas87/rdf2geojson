export const GEOJSONLD_CONTEXT = {
    "@context": {
        "@version": 1.1,
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "geojson": "https://purl.org/geojson/vocab#",
        "id": "@id",
        "type": "@type",
        "Feature": "geojson:Feature",
        "FeatureCollection": "geojson:FeatureCollection",
        "GeometryCollection": "geojson:GeometryCollection",
        "LineString": "geojson:LineString",
        "MultiLineString": "geojson:MultiLineString",
        "MultiPoint": "geojson:MultiPoint",
        "MultiPolygon": "geojson:MultiPolygon",
        "Point": "geojson:Point",
        "Polygon": "geojson:Polygon",
        "bbox": {
            "@container": "@list",
            "@id": "geojson:bbox"
        },
        "coordinates": {
            "@container": "@list",
            "@id": "geojson:coordinates",
            "@type": "xsd:double"
        },
        "features": {
            "@container": "@set",
            "@id": "geojson:features"
        },
        "geometry": "geojson:geometry",

        "properties": "geojson:properties"
    }
};

export const FRAME = {
    ...GEOJSONLD_CONTEXT,
    "@type": "FeatureCollection",
    "features": {
        "@type": "Feature",
        "geometry": {}
    }
};

/**
 * Converts a stream to an array, pushing all elements to an array
 * Resolving the promise with the 'end' event
 */
export function streamToArray(stream) {
    const out = [];
    return new Promise(async (res, rej) => {
      stream.on("end", () => res(out));
      stream.on("data", (x) => {
        out.push(x);
      });
      stream.on("error", (ex) => {
        console.error("Stream to Array failed");
        rej(ex);
      });
    });
  }