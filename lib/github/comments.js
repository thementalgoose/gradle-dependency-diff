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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComment = postComment;
const github = __importStar(require("@actions/github"));
function postComment(githubToken, messageId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (github.context.payload.pull_request == null) {
            return false;
        }
        let pullRequestNumber = github.context.payload.pull_request.number;
        const octokit = github.getOctokit(githubToken);
        let formattedMsgId = `<!--${messageId}-->`;
        let existingCommentId = yield findCommentById(pullRequestNumber, formattedMsgId, githubToken);
        if (existingCommentId == null) {
            let newCommentResult = yield octokit.rest.issues.createComment({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: pullRequestNumber,
                body: `${formattedMsgId}\n\n${message}`
            });
            return newCommentResult.status == 201;
        }
        else {
            let updateCommentResult = yield octokit.rest.issues.updateComment({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                comment_id: existingCommentId,
                body: `${formattedMsgId}\n\n${message}`
            });
            return updateCommentResult.status == 200;
        }
    });
}
function findCommentById(pullRequestNumber, messageId, githubToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const octokit = github.getOctokit(githubToken);
        // Find existing comment based on an ID
        const parameters = {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: pullRequestNumber,
            per_page: 100,
        };
        try {
            for (var _d = true, _e = __asyncValues(octokit.paginate.iterator(octokit.rest.issues.listComments, parameters)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const comments = _c;
                let result = (comments.data.find(({ body }) => {
                    var _a;
                    return ((_a = body === null || body === void 0 ? void 0 : body.search(messageId)) !== null && _a !== void 0 ? _a : -1) > -1;
                }));
                if (result) {
                    return result.id;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    });
}
