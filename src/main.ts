import * as core from '@actions/core';
import { parseOutput } from './processor/input-parser';
import { merge } from './processor/merger';
import { output } from './processor/output';

export interface Inputs { 
    before: string;
    after: string;
    outputToFile: boolean;
    outputToFileName: string;
}

async function run(): Promise<boolean> { 
    try {
        // Fetch github action inputs
        const inputs: Inputs = { 
            before: core.getInput("before"),
            after: core.getInput("after"),
            outputToFile: core.getInput("output_to_file") == "true",
            outputToFileName: core.getInput("output_to_file_name")
        }

        // Validate inputs
        core.startGroup("Validating inputs");
        core.endGroup();

        // Read input files into a dependencies structure
        core.startGroup("Reading files");
        let beforeDeps = parseOutput(inputs.before);
        let afterDeps = parseOutput(inputs.after);
        core.endGroup();

        // Merge outputs
        core.startGroup("Merging outputs");
        let merger = merge(beforeDeps, afterDeps);
        core.endGroup();

        // Filter out similar data + generate output
        core.startGroup("Generating output");
        let result = output(merger);
        let differenceFound = result != "";
        core.endGroup();

        core.setOutput("is_difference_found", differenceFound);
        core.setOutput("result", result);

        console.log("================================================");
        console.log("         Dependency difference report");
        console.log("================================================");
        console.log(result);
        console.log("================================================");

    } catch (error: any) {
        // Handle errors and indicate failure
        console.error(error);
        core.setFailed(error.message);
    }

    return true;
}

run();