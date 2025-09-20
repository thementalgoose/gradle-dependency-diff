export class Dependency {

    public name: string;
    public version_info: string;
    public children: Dependency[];

    constructor(
        name: string,
        version_info: string,
        children: Dependency[] = []
    ) { 
        this.name = name;
        this.version_info = version_info;
        this.children = children;
    }

    isModule(): boolean {
        return this.name.startsWith(":")
    }
}