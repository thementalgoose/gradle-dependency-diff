"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.space = space;
function space(indentation) {
    let str = '';
    for (let i = 0; i < indentation; i++) {
        str += '  ';
    }
    return str;
}
