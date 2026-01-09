"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const input_parser_1 = require("./processor/input-parser");
const merger_1 = require("./processor/merger");
const output_1 = require("./processor/output");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let file1 = process_1.argv[2];
        let file2 = process_1.argv[3];
        let before = (0, input_parser_1.parseOutput)(file1);
        let after = (0, input_parser_1.parseOutput)(file2);
        let merger = (0, merger_1.merge)(before, after);
        let result = (0, output_1.output)(merger, true);
        console.log(result);
    });
}
main();
