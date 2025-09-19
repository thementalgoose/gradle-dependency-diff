import { after } from "node:test";
import { Addition, Deletion, DependencyChange, Difference } from "../models/dependency-change.model";
import { Dependency } from "../models/dependency.model";
import { versions } from "process";

export function transform(before: Dependency[], after: Dependency[]): DependencyChange[] { 
    return compareDependencies([], before, after)
}

function compareDependency(path: string[], bef: Dependency | null, aft: Dependency | null): DependencyChange[] { 
    if (bef == aft) { 
        return [];
    }
    if (bef != null && aft == null) { 
        return [new Deletion(path, bef)];
    }
    if (bef == null && aft != null) { 
        return [new Addition(path, aft)];
    }

    let newPath = [...path]
    newPath.push(aft!!.name);

    if (getLatestVersion(bef!!.version_info) != getLatestVersion(aft!!.version_info)) { 
        return [new Difference(path, bef!!, aft!!, compareDependencies(newPath, bef!!.children, aft!!.children))]
    } else { 
        return compareDependencies(newPath, bef!!.children, aft!!.children);
    }
}

function compareDependencies(path: string[], bef: Dependency[], aft: Dependency[]): DependencyChange[] { 
    if (bef == aft) { 
        return [];
    }

    let befSet = new Set(bef.map(x => x.name));
    let aftSet = new Set(aft.map(x => x.name));

    let a_minus_b = new Set([...aftSet].filter(x => !befSet.has(x)));
    let b_minus_a = new Set([...befSet].filter(x => !aftSet.has(x)));
    let a_union_b = new Set([...aftSet].filter(x => befSet.has(x))); 

    let deps: DependencyChange[] = [];

    for (let item of [...a_union_b]) { 
        let b = bef.filter(x => x.name == item)[0];
        let a = aft.filter(x => x.name == item)[0];
        let results = compareDependency(path, b, a);
        for (let res of results) { 
            deps.push(res);
        }
    }
    
    for (let item of [...a_minus_b]) { 
        let a = aft.filter(x => x.name == item)[0];
        let results = compareDependency(path, null, a);
        for (let res of results) { 
            deps.push(res);
        }
    }
    
    for (let item of [...b_minus_a]) { 
        let b = bef.filter(x => x.name == item)[0];
        let results = compareDependency(path, b, null);
        for (let res of results) { 
            deps.push(res);
        }
    }

    return deps;
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