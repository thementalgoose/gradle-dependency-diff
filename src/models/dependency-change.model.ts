import { Dependency } from "./dependency.model";

export interface DependencyChange {
    path: string[];
    getPathString(): string;

    getOverview(): string;
};

export class Addition implements DependencyChange { 

    public path: string[];
    public newDependency: Dependency;

    constructor(
        path: string[],
        newDependency: Dependency
    ) { 
        this.path = path;
        this.newDependency = newDependency;
    }

    getPathString(): string { 
        return this.path.join(", ");
    }

    getOverview(): string {
        return `${this.newDependency.name}:${getLatestVersion(this.newDependency.version_info)}`
    }
}

export class Deletion implements DependencyChange {

    public path: string[];
    public oldDependency: Dependency;

    constructor(
        path: string[],
        oldDependency: Dependency
    ) { 
        this.path = path;
        this.oldDependency = oldDependency;
    }

    getPathString(): string { 
        return this.path.join(", ");
    }

    getOverview(): string {
        return `${this.oldDependency.name}:${getLatestVersion(this.oldDependency.version_info)}`
    }
}

export class Difference implements DependencyChange { 

    public path: string[];
    public newDependency: Dependency;
    public oldDependency: Dependency;
    public subChanges: DependencyChange[];

    constructor(
        path: string[],
        newDependency: Dependency,
        oldDependency: Dependency,
        subChanges: DependencyChange[] = []
    ) { 
        this.path = path;
        this.newDependency = newDependency;
        this.oldDependency = oldDependency;
        this.subChanges = subChanges;
    }

    getPathString(): string { 
        return this.path.join(", ");
    }

    getOverview(): string {
        let oldVersion = getLatestVersion(this.oldDependency.version_info);
        let newVersion = getLatestVersion(this.newDependency.version_info);
        if (oldVersion == newVersion) { 
            return `${this.newDependency.name}`
        } else { 
            return `${this.newDependency.name}:${oldVersion} -> ${newVersion}`
        }
    }
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