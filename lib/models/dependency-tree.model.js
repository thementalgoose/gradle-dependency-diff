"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.After = exports.Before = exports.Node = void 0;
class Node {
    constructor(name, before_version, after_version, children) {
        this.name = name;
        this.before_version = before_version;
        this.after_version = after_version;
        this.children = children;
    }
}
exports.Node = Node;
class Before {
    constructor(name, before_version, removed) {
        this.name = name;
        this.before_version = before_version;
        this.removed = removed;
    }
}
exports.Before = Before;
class After {
    constructor(name, after_version, added) {
        this.name = name;
        this.after_version = after_version;
        this.added = added;
    }
}
exports.After = After;
