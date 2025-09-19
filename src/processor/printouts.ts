import { Addition, Deletion, DependencyChange, Difference } from "../models/dependency-change.model";

export function printStack(
    changes: DependencyChange[],
    printout: (string) => void = x => { console.log(x); }
) { 
    for (let c of changes) { 
        if (c instanceof Difference) { 
            printout(`${space(c.path.length)}- ${c.newDependency.name}:${getLatestVersion(c.oldDependency.version_info)} -> ${getLatestVersion(c.newDependency.version_info)}`)
            for (let x of c.subChanges) { 
                printStack(c.subChanges, printout)
            }
        }
        if (c instanceof Addition) {
            if (c.newDependency.version_info == "") { 
                printout(`${space(c.path.length)}- ${c.newDependency.name} [ADDED]`)
            } else { 
                printout(`${space(c.path.length)}- ${c.newDependency.name}:${getLatestVersion(c.newDependency.version_info)} [ADDED]`)
            }
        }
        if (c instanceof Deletion) {
            printout(`${space(c.path.length)}- ${c.oldDependency.name} [REMOVED]`)
        }
    }
}

function space(indentation: number): string { 
    let str = "";
    for (let i = 0; i < indentation; i++) { 
        str += " ";
    }
    return str;
}

/**
 * Get version from version string
 * "1.1.0 -> 1.2.0 (*)"
 * "1.1.0 -> 1.2.0 (c)"
 * "1.1.0"
 */
function getLatestVersion(versionString: string) { 
    if (versionString.indexOf("->") !== -1) { 
        return versionString.split("->")[1].replace("(*)", "").replace("(c)", "").trim();
    } else if (versionString.indexOf(" ") !== -1) {
        return versionString.split(" ")[0].trim()
    } else { 
        return versionString
    }
}