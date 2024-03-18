import path from "path";
import { access, constants, writeFile } from "fs/promises";
import { Command } from "commander";
import { fromRDFFile, fromQuery } from "../lib/index.js";

async function run() {
    const program = new Command()
        .option("-s, --source <source>", "Path to source RDF file")
        .option("-q, --query <query>", "Path to file containing a SPARQL CONSTRUCT query")
        .option("-e, --endpoint <endpoint>", "SPARQL engine HTTP endpoint")
        .option("-o, --output <output>", "Path to output file that will contain the formatted GeoJSON-LD data")
        .parse(process.argv);

    if (!program.opts().source && !program.opts().query) {
        throw new Error("Please provide a source RDF (--source) or query file (--query)");
    }

    const source = program.opts().source? path.resolve(program.opts().source) : null;
    const query = program.opts().query? path.resolve(program.opts().query) : null;
    let data = null;

    if (source) {
        try {
            await access(source, constants.R_OK);
            data = await fromRDFFile(source);
        } catch(err) {
            throw err;
        }
    } else if (query) {
        if (program.opts().endpoint) {
            try {
                await access(query, constants.R_OK);
                data = await fromQuery(query, program.opts().endpoint);

            } catch {
                throw new Error(`Source query file ${program.opts().source} does not exist or is not accessible`);
            }
        } else {
            throw new Error("Please provide a valid SPARQL server address");
        }
    }

    if(data) {
        // If no output given write to standard output
        const stringData = JSON.stringify(data, null, 3);
        if(!program.opts().output) {
            process.stdout.write(stringData);
        } else {
            await writeFile(program.opts().output, stringData, "utf8");
        }
    }
}

run();