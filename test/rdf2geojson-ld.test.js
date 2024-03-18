import { describe, test, expect } from "@jest/globals";
import { fromRDFFile, fromQuery } from "../lib/RDF2GeoJSON-LD";

describe("Functional tests of formatting GeoJSON-LD triples into proper GeoJSON syntax", () => {

    test("Conversion from local file", async () => {
        const geojson = await fromRDFFile("example/leuven-geojsonld.nt");
        
        expect(geojson["type"]).toBe("FeatureCollection");
        expect(geojson["features"].length).toBeGreaterThan(0);

        for (const feature of geojson["features"]) {
            expect(feature["type"]).toBe("Feature");
            expect(feature["geometry"]["type"]).toBe("Point");
            expect(feature["geometry"]["coordinates"].length).toBe(2);
            expect(feature["geometry"]["coordinates"].every(c => ~isNaN(parseFloat(c)))).toBeTruthy();
        }
    });

    test("Conversion from SPARQL CONSTRUCT query on remote endopoint", async () => {
        const geojson = await fromQuery("example/sophox.rq", "https://sophox.org/sparql");

        expect(geojson["type"]).toBe("FeatureCollection");
        expect(geojson["features"].length).toBeGreaterThan(0);

        for (const feature of geojson["features"]) {
            expect(feature["type"]).toBe("Feature");
            expect(feature["geometry"]["type"]).toBe("Point");
            expect(feature["geometry"]["coordinates"].length).toBe(2);
            expect(feature["geometry"]["coordinates"].every(c => ~isNaN(parseFloat(c)))).toBeTruthy();
        }
    });
});