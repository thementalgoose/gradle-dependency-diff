import { diff } from "util";
import { Addition, Deletion, DependencyChange, Difference } from "./dependency-change.model";

export type Changes = { [K in string]: DependencyChange[] }

export class TransformOverview { 

    public additions: Addition[];
    public deletions: Deletion[];
    public differences: Difference[];

    constructor(
        additions: Addition[],
        deletions: Deletion[],
        differences: Difference[]
    ) { 
        this.additions = additions;
        this.deletions = deletions;
        this.differences = differences;
    }

    public getDifferencesByName(): Changes { 
        let tree: Changes = {};
        let names = [...new Set(this.differences.map(x => x.newDependency.name.split(":")[0]))];
        for (let name of names) { 
            tree[name] = this.differences.filter(diff => diff.newDependency.name == name);
        }
        return tree;
    }

    public getAdditionsByName(): Changes { 
        let tree: Changes = {};
        let names = [...new Set(this.additions.map(x => x.newDependency.name.split(":")[0]))];
        for (let name of names) { 
            tree[name] = this.additions.filter(diff => diff.newDependency.name == name);
        }
        return tree;
    }

    public getDeletionsByName(): Changes { 
        let tree: Changes = {};
        let names = [...new Set(this.deletions.map(x => x.oldDependency.name.split(":")[0]))];
        for (let name of names) { 
            tree[name] = this.deletions.filter(diff => diff.oldDependency.name == name);
        }
        return tree;
    }
}