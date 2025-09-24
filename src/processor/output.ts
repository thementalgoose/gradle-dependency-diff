import { Addition } from "../models/dependency-change.model";
import { After, Before, DependencyTree, Node } from "../models/dependency-tree.model";
import { space } from "../utils/stringutils";

export function output(
    models: DependencyTree[],
    printout: (string) => void = x => { console.log(x); },
    index: number = 0
) { 
    for (let x of models) {
        if (x instanceof Node) { 
            if (x.before_version != x.after_version) {
                printout(` |${space(index)}- ${x.name}:${x.after_version} -> ${x.before_version}`);
                // if (index != 0) { 
                //     output(x.children, printout, index + 1);
                // }
            } else if (containsChildrenWithDiff(x.children)) { 
                printout(` |${space(index)}- ${x.name}`);
                output(x.children, printout, index + 1);
            }
        }
        if (x instanceof Before) { 
            printout(`-|${space(index)}- ${x.name}:${x.before_version}`);
            output(x.removed, printout, index + 1);
        }
        if (x instanceof After) { 
            printout(`+|${space(index)}- ${x.name}:${x.after_version}`);
            output(x.added, printout, index + 1);
        }
    }
}

function containsChildrenWithDiff(models: DependencyTree[]): boolean { 
    let returnValue = false;
    for (let x of models) { 
        if (x instanceof Node) { 
            if (x.after_version != x.before_version) { 
                returnValue = returnValue || true;
            }
            if (x.children.length == 0) { 
                returnValue = returnValue || false;
            }
            let subChanges = containsChildrenWithDiff(x.children);
            if (subChanges) {
                returnValue = returnValue || true;
            }
        }
        if (x instanceof Before) {
            returnValue = returnValue || true;
        }
        if (x instanceof After) {
            returnValue = returnValue || true;
        }
    }
    return returnValue;
}