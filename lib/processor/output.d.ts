import { DependencyTree } from '../models/dependency-tree.model';
export declare function outputList(models: DependencyTree[], index?: number): Set<string>;
export declare function outputDiff(models: DependencyTree[], showRemovals: boolean, index?: number): string;
