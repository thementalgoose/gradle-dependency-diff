"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyTreeHolder = void 0;
class DependencyTreeHolder {
    constructor(all) {
        this.all = all;
    }
    getAdditions() {
        return this.all;
    }
    getDeletions() {
        return this.all;
    }
    getDifferences() {
        return this.all;
    }
}
exports.DependencyTreeHolder = DependencyTreeHolder;
