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

    latestVersion(): string { 
        return getLatestVersion(this.version_info);
    }
}

/**
 * Get version from version string
 * "1.1.0 -> 1.2.0 (*)"
 * "1.1.0 -> 1.2.0 (c)"
 * "1.1.0"
 */
function getLatestVersion(versionString: string) { 
    if (versionString.indexOf("->") !== -1) { 
        return versionString.split("->")[1].replace("(*)", "").replace("(c)", "").trim();
    } else if (versionString.indexOf(" ") !== -1) {
        return versionString.split(" ")[0].trim()
    } else { 
        return versionString
    }
}