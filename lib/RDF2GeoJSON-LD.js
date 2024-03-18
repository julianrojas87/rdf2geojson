import fsPromises from "fs/promises";
import rdfDereference from "rdf-dereference";
import { Writer } from "n3";
import { GEOJSONLD_CONTEXT, FRAME, streamToArray } from "./utils.js";
import * as jsonld from 'jsonld';

const toJSONLD = jsonld.default.fromRDF;
const compactJSONLD = jsonld.default.compact;
const frameJSONLD = jsonld.default.frame;

export async function fromRDFFile(path) {
    console.log("Reading RDF file...");
    const resp = await rdfDereference.dereference(path, {
        localFiles: true,
    });

    return await formatJSONLD(
        new Writer({ format: "N-Quads" })
            .quadsToString(await streamToArray(resp.data))
    );
}

export async function fromQuery(path, endpoint) {
    // Read query from file
    const query = await fsPromises.readFile(path, "utf8");
    // Execute SPARQL CONSTRUCT query
    const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Accept": "text/plain",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `query=${encodeURIComponent(query)}`
    });
    return await formatJSONLD(await resp.text());
}

async function formatJSONLD(rdf) {
    console.log("Transforming to JSON-LD format and compacting...");
    // Use JSON-LD compaction for getting a cleaner GeoJSON
    const compacted = await compactJSONLD(
        await toJSONLD(rdf, { format: "application/n-quads" }),
        GEOJSONLD_CONTEXT,
        { compactArrays: true }
    );
    // Frame the resulting object to aggregate objects and resemble traditional GeoJSON
    console.log("Framing JSON-LD as GeoJSON...");
    return await frameJSONLD(compacted, FRAME);
}