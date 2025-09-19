import { Dependency } from "./dependency.model";

export interface DependencyChange {
    path: string[];
    getPathString(): string;
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
}