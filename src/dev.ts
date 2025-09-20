import { argv } from "process";
import { parseOutput } from "./processor/output-parser";
import { transform } from "./processor/transform";
import { diff } from "util";
import { printStack } from "./processor/printouts";

async function main() { 

    let file1 = argv[2];
    let file2 = argv[3];

    let difference = transform(parseOutput(file1), parseOutput(file2));

    printStack(difference)
}

main();