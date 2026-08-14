"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dependency = void 0;
class Dependency {
    constructor(name, version_info, children = []) {
        this.name = name;
        this.version_info = version_info;
        this.children = children;
    }
    isModule() {
        return this.name.startsWith(':');
    }
    latestVersion() {
        return getLatestVersion(this.version_info);
    }
}
exports.Dependency = Dependency;
/**
 * Get version from version string
 * "1.1.0 -> 1.2.0 (*)"
 * "1.1.0 -> 1.2.0 (c)"
 * "1.1.0"
 */
function getLatestVersion(versionString) {
    if (versionString.indexOf('->') !== -1) {
        return versionString
            .split('->')[1]
            .replace('(*)', '')
            .replace('(c)', '')
            .trim();
    }
    else if (versionString.indexOf(' ') !== -1) {
        return versionString.split(' ')[0].trim();
    }
    else {
        return versionString;
    }
}
