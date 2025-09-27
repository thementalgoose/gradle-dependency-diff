"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = output;
const dependency_tree_model_1 = require("../models/dependency-tree.model");
const string_utils_1 = require("../utils/string.utils");
function output(models, index = 0) {
    if (!containsChildrenWithDiff(models)) {
        return '';
    }
    let returnOutput = '';
    for (let x of models) {
        if (x instanceof dependency_tree_model_1.Node) {
            if (x.before_version != x.after_version) {
                returnOutput += ` |${(0, string_utils_1.space)(index)}- ${x.name}:${x.before_version} -> ${x.after_version}\n`;
                // if (index != 0) {
                //     output(x.children, index + 1);
                // }
            }
            else if (containsChildrenWithDiff(x.children)) {
                returnOutput += ` |${(0, string_utils_1.space)(index)}- ${x.name}\n`;
                returnOutput += output(x.children, index + 1);
            }
        }
        if (x instanceof dependency_tree_model_1.Before) {
            returnOutput += `-|${(0, string_utils_1.space)(index)}- ${x.name}:${x.before_version}\n`;
            returnOutput += output(x.removed, index + 1);
        }
        if (x instanceof dependency_tree_model_1.After) {
            returnOutput += `+|${(0, string_utils_1.space)(index)}- ${x.name}:${x.after_version}\n`;
            returnOutput += output(x.added, index + 1);
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
