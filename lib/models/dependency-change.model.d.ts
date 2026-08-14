import { Dependency } from './dependency.model';
export interface DependencyChange {
    path: string[];
    getPathString(): string;
    getOverview(): string;
}
export declare class Addition implements DependencyChange {
    path: string[];
    newDependency: Dependency;
    constructor(path: string[], newDependency: Dependency);
    getPathString(): string;
    getOverview(): string;
}
export declare class Deletion implements DependencyChange {
    path: string[];
    oldDependency: Dependency;
    constructor(path: string[], oldDependency: Dependency);
    getPathString(): string;
    getOverview(): string;
}
export declare class Difference implements DependencyChange {
    path: string[];
    newDependency: Dependency;
    oldDependency: Dependency;
    subChanges: DependencyChange[];
    constructor(path: string[], newDependency: Dependency, oldDependency: Dependency, subChanges?: DependencyChange[]);
    getPathString(): string;
    getOverview(): string;
}
