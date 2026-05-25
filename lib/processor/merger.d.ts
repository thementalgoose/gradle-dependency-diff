import { DependencyTree } from '../models/dependency-tree.model';
import { Dependency } from '../models/dependency.model';
/**
 * Merges the before + after dependency arrays to a single tree like structure
 *  showing the mergers
 *
 * @param before List of dependencies from original printout
 * @param after List of dependencies from new output
 * @returns
 */
export declare function merge(before: Dependency[], after: Dependency[]): DependencyTree[];
