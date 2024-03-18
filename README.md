# rdf2geojson

[![Bun CI](https://github.com/julianrojas87/rdf2geojson/actions/workflows/ci.yml/badge.svg)](https://github.com/julianrojas87/rdf2geojson/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/rdf2geojson.svg?style=popout)](https://npmjs.com/package/rdf2geojson)

Javascript CLI and library to format RDF data using the [GeoJSON-LD vocabulary](https://purl.org/geojson/vocab#) into proper GeoJSON for visualization purposes. It uses JSON-LD compaction (based on a [given @context](https://github.com/julianrojas87/rdf2geojson/blob/main/lib/utils.js#L1)) and framing (base on a [given frame](https://github.com/julianrojas87/rdf2geojson/blob/main/lib/utils.js#L36)) to format the data into JSON-LD with the proper GeoJSON aliases.

## Install it

Install it running the following command:

```bash
npm install rdf2geojson
```

## Use it in the command line

Run `rdf2geojson -h` to see the usage options:

```bash
Usage: rdf2geojson-ld [options]

Options:
  -s, --source <source>      Path to source RDF file
  -q, --query <query>        Path to file containing a SPARQL CONSTRUCT query
  -e, --endpoint <endpoint>  SPARQL engine HTTP endpoint
  -o, --output <output>      Path to output file that will contain the formatted GeoJSON-LD data
  -h, --help                 display help for command
```

This tool allows to format either existing RDF files (both local and remote) and RDF data resulting from a given SPARQL CONSTRUCT query.

To format an existing RDF file using the GeoJSON-LD vocabulary, run the following command:

```bash
rdf2geojson -s (http://)path/to/file
```

To format the result of a SPARQL CONSTRUCT query, run the following command:

```bash
rdf2geojson -q path/to/query/file -e https://triplestore-address/sparql
```

By default, the transformed data will be written to the standard output, but a specific target path can be given with the `-o` parameter.

## Use it as a library

Two functions are exported for formatting files and SPARQL CONSTRUCT results respectively:

```js
import { fromRDFFile, fromQuery } from "rdf2geojson";

async function format() {
    const geojson1 = await fromRDFFile("/path/to/file.nt");

    const geojson2 = await fromQuery("/path/to/query.rq", "https://triplestore-address/sparql");
}

format();
```

Some real usage example can be seen in the [tests](https://github.com/julianrojas87/rdf2geojson/blob/main/test/rdf2geojson-ld.test.js).
