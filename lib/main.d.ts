export interface Inputs {
    before: string;
    after: string;
    outputToFile: boolean;
    outputToFileName: string;
    postPrComment: boolean;
    repoToken: string;
    showRemovals: boolean;
}
export declare function getPrDiffComment(list: string[], result: string): string;
export declare function getPrNoDiffComment(): string;
