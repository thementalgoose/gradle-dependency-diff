"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputList = outputList;
exports.outputDiff = outputDiff;
const dependency_tree_model_1 = require("../models/dependency-tree.model");
const string_utils_1 = require("../utils/string.utils");
function outputList(models, index = 0) {
    if (!containsChildrenWithDiff(models)) {
        return new Set();
    }
    let set = new Set();
    for (let x of models) {
        if (x instanceof dependency_tree_model_1.Node) {
            if (x.before_version != x.after_version) {
                set.add(`${x.name}:${x.before_version} -> ${x.after_version}`);
            }
            else if (containsChildrenWithDiff(x.children)) {
                let subSet = outputList(x.children, index + 1);
                for (let y of Array.from(subSet)) {
                    set.add(y);
                }
            }
        }
        if (x instanceof dependency_tree_model_1.Before) {
            let subSet = outputList(x.removed, index + 1);
            for (let y of Array.from(subSet)) {
                set.add(y);
            }
        }
        if (x instanceof dependency_tree_model_1.After) {
            let subSet = outputList(x.added, index + 1);
            for (let y of Array.from(subSet)) {
                set.add(y);
            }
        }
    }
    return set;
}
function outputDiff(models, showRemovals, index = 0) {
    if (!containsChildrenWithDiff(models)) {
        return '';
    }
    let returnOutput = '';
    for (let x of models) {
        if (x instanceof dependency_tree_model_1.Node) {
            if (x.before_version != x.after_version) {
                returnOutput += ` |${(0, string_utils_1.space)(index)}- ${x.name}:${x.before_version} -> ${x.after_version}\n`;
            }
            else if (containsChildrenWithDiff(x.children)) {
                returnOutput += ` |${(0, string_utils_1.space)(index)}- ${x.name}\n`;
                returnOutput += outputDiff(x.children, showRemovals, index + 1);
            }
        }
        if (x instanceof dependency_tree_model_1.Before && showRemovals) {
            returnOutput += `-|${(0, string_utils_1.space)(index)}- ${x.name}:${x.before_version}\n`;
            returnOutput += outputDiff(x.removed, showRemovals, index + 1);
        }
        if (x instanceof dependency_tree_model_1.After) {
            returnOutput += `+|${(0, string_utils_1.space)(index)}- ${x.name}:${x.after_version}\n`;
            returnOutput += outputDiff(x.added, showRemovals, index + 1);
        }
    }
    return returnOutput;
}
function containsChildrenWithDiff(models) {
    let returnValue = false;
    for (let x of models) {
        if (x instanceof dependency_tree_model_1.Node) {
            if (x.after_version != x.before_version) {
                returnValue = returnValue || true;
            }
            if (x.children.length == 0) {
                returnValue = returnValue || false;
            }
            let subChanges = containsChildrenWithDiff(x.children);
            if (subChanges) {
                returnValue = returnValue || true;
            }
        }
        if (x instanceof dependency_tree_model_1.Before) {
            returnValue = returnValue || true;
        }
        if (x instanceof dependency_tree_model_1.After) {
            returnValue = returnValue || true;
        }
    }
    return returnValue;
}
