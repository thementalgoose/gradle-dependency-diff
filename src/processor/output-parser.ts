import { version } from "os";
import { Dependency } from "../models/dependency.model";
import { readFile } from "../utils/fileutils";

/**
 * Map the :app:dependencies output into a data structure we can worth with
 * 
 * @param filename Filename of dependency output
 * @returns 
 */
export function parseOutput(filename: string): Dependency[] {
    console.log(`Loading ${filename}`);
    let lines = readFile(filename)
        .filter(x => x.startsWith("|") || x.startsWith("\\") || x.startsWith("+"));

    return mapDependencies(lines, 0);
}

function createDependency(line: string, children: Dependency[]): Dependency { 
    if (line.startsWith("+--- project")) {
        return new Dependency(stripModuleName(line), "", children);
    } else {
        let name = stripDependencyName(line)
        let versionInfo = stripVersionInfo(line);
        return new Dependency(name, versionInfo, children);
    }
}

function mapDependencies(lines: string[], level: number): Dependency[] {
    if (lines.length == 0) { 
        return [];
    }

    let line = lines[0];
    if (getIndentation(line) == level) {
        let sublines: string[] = [];
        for (let i = 1; i < lines.length; i++) { 
            if (getIndentation(lines[i]) > level) { 
                sublines.push(lines[i]);
            } else {
                break;
            }
        }

        let subDependencies = mapDependencies(sublines, level + 1);
        let dependency = createDependency(line, subDependencies);
        let depth = 1 + lengthOfDependencies(subDependencies);

        let returnArray: Dependency[] = [];
        returnArray.push(dependency);
        let remaining = mapDependencies(lines.slice(depth), level);
        for (let x of remaining) { 
            returnArray.push(x);
        }
        return returnArray;
    }

    return [];
}

function lengthOfDependencies(dependencies: Dependency[]): number { 
    if (dependencies.length == 0) { 
        return 0;
    }
    let total = 0;
    for (let x of dependencies) { 
        total += (1 + lengthOfDependencies(x.children));
    }
    return total;
}

function getIndentation(line: string): number { 
    return Math.round(Math.floor(line.indexOf("---") / 5.0))
}

/**
 * Strip module out of project string
 * "+--- project :core:configuration (*)"
 */
function stripModuleName(line: string): string { 
    return line.split("project ")[1].replace("(*)", "").trim();
}

/**
 * Strip module out of project string
 * "|         |                   \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.23 -> 2.2.20 (*)"
 */
function stripDependencyName(line: string): string { 
    let numberOfColons = (line.match(new RegExp(":", "g")) || []).length;
    if (numberOfColons <= 1) { 
        return line.split("---")[1].trim().split(" ")[0].trim();
    } else { 
        return (line.split("---")[1].split(":")[0] + ":" + line.split("---")[1].split(":")[1]).trim();
    }
}

/**
 * Strip module out of project string
 * "|         |                   \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.23 -> 2.2.20 (*)"
 */
function stripVersionInfo(line: string): string { 
    let numberOfColons = (line.match(new RegExp(":", "g")) || []).length;
    return line.split(":")[numberOfColons].replace("(*)", "").trim();
}