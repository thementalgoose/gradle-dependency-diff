import { After, Before, DependencyTree, Node } from "../models/dependency-tree.model";
import { Dependency } from "../models/dependency.model";


/**
 * Merges the before + after dependency arrays to a single tree like structure
 *  showing the mergers
 * 
 * @param before List of dependencies from original printout
 * @param after List of dependencies from new output
 * @returns 
 */
export function merge(before: Dependency[], after: Dependency[]): DependencyTree[] { 
    let listOfNodes: DependencyTree[] = [];

    let beforeSets = [...new Set(before.map(x => x.name))];
    let afterSets = [...new Set(after.map(x => x.name))];

    let intersection = beforeSets.filter(x => afterSets.includes(x));
    let left_join = beforeSets.filter(x => !afterSets.includes(x));
    let right_join = afterSets.filter(x => !beforeSets.includes(x));

    for (let name of intersection) { 
        let b = before.filter(x => x.name == name)[0];
        let a = after.filter(x => x.name == name)[0];
        listOfNodes.push(new Node(
            b.name,
            b.latestVersion(),
            a.latestVersion(),
            merge(b.children, a.children)
        ))
    }

    for (let name of left_join) { 
        let b = before.filter(x => x.name == name)[0];
        listOfNodes.push(new Before(
            b.name, 
            b.latestVersion(),
            mapDependencyToBeforeTree(b.children)
        ))
    }

    for (let name of right_join) { 
        let a = after.filter(x => x.name == name)[0];
        listOfNodes.push(new After(
            a.name, 
            a.latestVersion(),
            mapDependencyToAfterTree(a.children)
        ))
    }

    return listOfNodes;
}

function mapDependencyToBeforeTree(dependencies: Dependency[]): DependencyTree[] { 
    if (dependencies.length == 0) { 
        return [];
    }

    let list: DependencyTree[] = [];
    for (let x of dependencies) {
        list.push(new Before(x.name, x.version_info, mapDependencyToBeforeTree(x.children)));
    }
    return list;
}

function mapDependencyToAfterTree(dependencies: Dependency[]): DependencyTree[] { 
    if (dependencies.length == 0) { 
        return [];
    }

    let list: DependencyTree[] = [];
    for (let x of dependencies) {
        list.push(new After(x.name, x.version_info, mapDependencyToAfterTree(x.children)));
    }
    return list;
}