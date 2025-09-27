import { Dependency } from '../models/dependency.model';
/**
 * Map the :app:dependencies output into a data structure we can worth with
 *
 * @param filename Filename of dependency output
 * @returns
 */
export declare function parseOutput(filename: string): Dependency[];
export declare function getIndentation(line: string): number;
