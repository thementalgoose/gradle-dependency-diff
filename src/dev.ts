import { argv } from "process";
import { parseOutput } from "./processor/input-parser";
import { merge } from "./processor/merger";
import { output } from "./processor/output";

async function main() { 

    let file1 = argv[2];
    let file2 = argv[3];

    let before = parseOutput(file1);
    let after = parseOutput(file2);

    let merger = merge(before, after);

    let result = output(merger);
    console.log(result);
}

main();