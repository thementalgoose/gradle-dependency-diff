import { DependencyChange } from "./dependency-change.model";

export interface DepTree { }

export class Node implements DepTree { 

    public diffs: DependencyChange[];

    constructor(
        diffs: DependencyChange[]
    ) { 
        this.diffs = diffs;
    }
}

export class Branch implements DepTree { 

    public name: string;
    public branches: DepTree[];

    constructor(
        name: string,
        branches: DepTree[] = []
    ) { 
        this.name = name;
        this.branches = branches;
    }
}