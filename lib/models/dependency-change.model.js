"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difference = exports.Deletion = exports.Addition = void 0;
class Addition {
    constructor(path, newDependency) {
        this.path = path;
        this.newDependency = newDependency;
    }
    getPathString() {
        return this.path.join(', ');
    }
    getOverview() {
        return `${this.newDependency.name}:${getLatestVersion(this.newDependency.version_info)}`;
    }
}
exports.Addition = Addition;
class Deletion {
    constructor(path, oldDependency) {
        this.path = path;
        this.oldDependency = oldDependency;
    }
    getPathString() {
        return this.path.join(', ');
    }
    getOverview() {
        return `${this.oldDependency.name}:${getLatestVersion(this.oldDependency.version_info)}`;
    }
}
exports.Deletion = Deletion;
class Difference {
    constructor(path, newDependency, oldDependency, subChanges = []) {
        this.path = path;
        this.newDependency = newDependency;
        this.oldDependency = oldDependency;
        this.subChanges = subChanges;
    }
    getPathString() {
        return this.path.join(', ');
    }
    getOverview() {
        let oldVersion = getLatestVersion(this.oldDependency.version_info);
        let newVersion = getLatestVersion(this.newDependency.version_info);
        if (oldVersion == newVersion) {
            return `${this.newDependency.name}`;
        }
        else {
            return `${this.newDependency.name}:${oldVersion} -> ${newVersion}`;
        }
    }
}
exports.Difference = Difference;
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
