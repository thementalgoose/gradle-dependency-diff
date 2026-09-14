export interface DependencyTree {
    name: string;
}
export declare class Node implements DependencyTree {
    name: string;
    before_version: string;
    after_version: string;
    children: DependencyTree[];
    constructor(name: string, before_version: string, after_version: string, children: DependencyTree[]);
}
export declare class Before implements DependencyTree {
    name: string;
    before_version: string;
    removed: DependencyTree[];
    constructor(name: string, before_version: string, removed: DependencyTree[]);
}
export declare class After implements DependencyTree {
    name: string;
    after_version: string;
    added: DependencyTree[];
    constructor(name: string, after_version: string, added: DependencyTree[]);
}
