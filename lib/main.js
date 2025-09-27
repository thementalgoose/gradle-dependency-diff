"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const core = __importStar(require("@actions/core"));
const input_parser_1 = require("./processor/input-parser");
const merger_1 = require("./processor/merger");
const output_1 = require("./processor/output");
const file_utils_1 = require("./utils/file.utils");
const comments_1 = require("./github/comments");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch github action inputs
            const inputs = {
                before: core.getInput('before'),
                after: core.getInput('after'),
                outputToFile: core.getInput('output_to_file') == 'true',
                outputToFileName: core.getInput('output_to_file_name'),
                postPrComment: core.getInput('post_pr_comment') == 'true',
                repoToken: core.getInput('repo_token')
            };
            // Validate inputs
            core.startGroup('Validating inputs');
            core.endGroup();
            // Read input files into a dependencies structure
            core.startGroup('Reading files');
            let beforeDeps = (0, input_parser_1.parseOutput)(inputs.before);
            let afterDeps = (0, input_parser_1.parseOutput)(inputs.after);
            core.endGroup();
            // Merge outputs
            core.startGroup('Merging outputs');
            let merger = (0, merger_1.merge)(beforeDeps, afterDeps);
            core.endGroup();
            // Filter out similar data + generate output
            core.startGroup('Generating output');
            let result = (0, output_1.output)(merger);
            core.endGroup();
            let differenceFound = result != '';
            core.setOutput('is_difference_found', differenceFound);
            core.setOutput('result', result);
            if (inputs.outputToFile) {
                core.startGroup(`Saving to '${inputs.outputToFileName}'`);
                (0, file_utils_1.writeFile)(inputs.outputToFileName, result);
                core.endGroup();
            }
            if (inputs.postPrComment) {
                core.startGroup("Posting github comment");
                let messageId = "gradle-dependency-diff";
                if (differenceFound) {
                    let requestResult = yield (0, comments_1.postComment)(inputs.repoToken, messageId, getPrDiffComment(result));
                    console.log(`Posting diff comment: ${requestResult}`);
                }
                else {
                    let requestResult = yield (0, comments_1.postComment)(inputs.repoToken, messageId, getPrNoDiffComment());
                    console.log(`Posting no diff comment: ${requestResult}`);
                }
                core.endGroup();
            }
            core.startGroup('Report printout');
            console.log('================================================');
            console.log('         Dependency difference report');
            console.log('================================================');
            console.log(result);
            console.log('================================================');
            core.endGroup();
        }
        catch (error) {
            // Handle errors and indicate failure
            console.error(error);
            core.setFailed(error.message);
        }
        return true;
    });
}
function getPrDiffComment(result) {
    return `
### ⚠️ Dependency differences found

Differences in the dependency outputs have been introduced in this PR. Please scan the list below and check if any dependencies have had transient dependency updates

<details> 
<summary>Difference</summary>

\`\`\`diff
${result}
\`\`\`

</details> 

_Created at ${new Date().toISOString()}_
  `.trim();
}
function getPrNoDiffComment() {
    return `
### ✅ No dependency differences found
  `.trim();
}
run();
