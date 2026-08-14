export declare class Dependency {
    name: string;
    version_info: string;
    children: Dependency[];
    constructor(name: string, version_info: string, children?: Dependency[]);
    isModule(): boolean;
    latestVersion(): string;
}
