"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOutput = parseOutput;
exports.parseRawOutput = parseRawOutput;
exports.getIndentation = getIndentation;
const dependency_model_1 = require("../models/dependency.model");
const file_utils_1 = require("../utils/file.utils");
/**
 * Map the :app:dependencies output into a data structure we can worth with
 *
 * @param filename Filename of dependency output
 * @returns
 */
function parseOutput(filename) {
    return parseRawOutput((0, file_utils_1.readFile)(filename));
}
function parseRawOutput(content) {
    let lines = content.split("\n").filter(x => x.trim().startsWith('|') ||
        x.trim().startsWith('\\') ||
        x.trim().startsWith('+'));
    return mapDependencies(lines);
}
function createDependency(line, children) {
    if (line.startsWith('+--- project')) {
        return new dependency_model_1.Dependency(stripModuleName(line), '', children);
    }
    else {
        let name = stripDependencyName(line);
        let versionInfo = stripVersionInfo(line);
        return new dependency_model_1.Dependency(name, versionInfo, children);
    }
}
function mapDependencies(lines, level = 0) {
    if (lines.length == 0) {
        return [];
    }
    let line = lines[0];
    if (getIndentation(line) == level) {
        let sublines = [];
        for (let i = 1; i < lines.length; i++) {
            if (getIndentation(lines[i]) > level) {
                sublines.push(lines[i]);
            }
            else {
                break;
            }
        }
        let subDependencies = mapDependencies(sublines, level + 1);
        let dependency = createDependency(line, subDependencies);
        let depth = 1 + lengthOfDependencies(subDependencies);
        let returnArray = [];
        returnArray.push(dependency);
        let remaining = mapDependencies(lines.slice(depth), level);
        for (let x of remaining) {
            returnArray.push(x);
        }
        return returnArray;
    }
    return [];
}
function lengthOfDependencies(dependencies) {
    if (dependencies.length == 0) {
        return 0;
    }
    let total = 0;
    for (let x of dependencies) {
        total += 1 + lengthOfDependencies(x.children);
    }
    return total;
}
function getIndentation(line) {
    return Math.round(Math.floor(line.indexOf('---') / 5.0));
}
/**
 * Strip module out of project string
 * "+--- project :core:configuration (*)"
 */
function stripModuleName(line) {
    return line.split('project ')[1].replace('(*)', '').trim();
}
/**
 * Strip module out of project string
 * "|         |                   \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.23 -> 2.2.20 (*)"
 * "+--- org.jetbrains.kotlin:kotlin-stdlib -> 2.2.20 (*)"
 */
function stripDependencyName(line) {
    if (line.indexOf('project :') !== -1) {
        return line.split('---')[1].replace('project', '').trim();
    }
    let numberOfColons = (line.match(new RegExp(':', 'g')) || []).length;
    if (numberOfColons <= 1) {
        return line.split('---')[1].trim().split(' ')[0].trim();
    }
    else {
        return (line.split('---')[1].split(':')[0] +
            ':' +
            line.split('---')[1].split(':')[1]).trim();
    }
}
/**
 * Strip module out of project string
 * "|         |                   \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.23 -> 2.2.20 (*)"
 * "+---org.jetbrains.kotlin:kotlin-stdlib -> 2.2.20 (*)"
 */
function stripVersionInfo(line) {
    let numberOfColons = (line.match(new RegExp(':', 'g')) || []).length;
    if (line.indexOf('->') !== -1) {
        return line.split('->')[1].replace('(*)', '').replace('(c)', '').trim();
    }
    else {
        return line
            .split(':')[numberOfColons].replace('(*)', '')
            .replace('(c)', '')
            .trim();
    }
}
