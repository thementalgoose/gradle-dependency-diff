import { DependencyTree } from './dependency-tree.model';
export declare class DependencyTreeHolder {
    all: DependencyTree[];
    constructor(all: DependencyTree[]);
    getAdditions(): DependencyTree[];
    getDeletions(): DependencyTree[];
    getDifferences(): DependencyTree[];
}
