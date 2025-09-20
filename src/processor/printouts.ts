import { Addition, Deletion, DependencyChange, Difference } from "../models/dependency-change.model";
import { Changes, TransformOverview } from "../models/transform-overview.model";

export function printStack(
    overview: TransformOverview,
    printout: (string) => void = x => { console.log(x); }
) { 
    let additions = overview.getAdditionsByName();
    let deletions = overview.getDeletionsByName();
    let differences = overview.getDifferencesByName();

    printout("=== ADDITIONS =================================");
    printChanges(additions, printout);
    printout("=== DELETIONS =================================");
    printChanges(deletions, printout);
    printout("=== DIFFERENCES ===============================");
    printChanges(differences, printout);
}

function printChanges(tree: Changes, printout: (string) => void) { 
    if (Object.keys(tree).length != 0) { 
        for (let x in tree) { 
            printout(`- ${x}`);
            for (let paths of tree[x]) { 
                printout(`  - ${paths.getOverview()}`);
            }
        }
    } else { 
        printout("- None found");
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