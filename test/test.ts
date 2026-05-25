import { describe, it } from "node:test";
import { 
    afterList, 
    beforeList, 
    getAfterOutput, 
    getBeforeOutput, 
    listResultOutput, 
    mergeLeftList, 
    mergeResult, 
    mergeResultOutputWithoutRemovals, 
    mergeResultOutputWithRemovals, 
    mergeRightList 
} from "./assets";
import { parseRawOutput } from "../src/processor/input-parser";
import { merge } from "../src/processor/merger";
import { outputDiff, outputList } from "../src/processor/output";
import { assert } from "chai";
import { getPrDiffComment, getPrNoDiffComment } from "../src/main";

describe("Parsing", () => { 

    it("gradle before output parses to dependency models", () => { 
        let beforeOutput = getBeforeOutput();
        assert.equal(
            JSON.stringify(parseRawOutput(beforeOutput)), 
            JSON.stringify(beforeList), 
            "Dependency tree not created as expected"
        );
    });

    it("gradle before output parses to dependency models", () => { 
        let afterOutput = getAfterOutput();
        assert.equal(
            JSON.stringify(parseRawOutput(afterOutput)), 
            JSON.stringify(afterList), 
            "Dependency tree not created as expected"
        );
    });
});


describe("Merging", () => { 

    it("merging two lists results in correct merger", () => {
        let result = merge(mergeLeftList, mergeRightList); 
        assert.equal(JSON.stringify(mergeResult), JSON.stringify(result));
    });
})


describe("Output - Diff", () => { 

    it("output prints out correct diff with removals", () => {
        let result = outputDiff(mergeResult, true); 
        assert.equal(result, mergeResultOutputWithRemovals);
    });

    it("output prints out correct diff with no removals", () => {
        let result = outputDiff(mergeResult, false); 
        assert.equal(result, mergeResultOutputWithoutRemovals);
    });
})


describe("Output - List", () => { 

    it("output prints out correct list", () => {
        let result = outputList(mergeResult); 
        assert.notStrictEqual(Array.from(result), Array.from(listResultOutput));
    });
})

describe("Output - PR", () => {

    it("getPrDiffComment includes high-level bullets and the diff block", () => {
        const expected = `### ⚠️ Dependency differences found

Differences in the dependency outputs have been introduced in this PR. Below are the high-level dependency names touched in this change:

- Something

<details> 
<summary>View differences here</summary>

\`\`\`diff
 |- com.squareup.okhttp3:okhttp
 |  - com.squareup.okio:okio:2.8.0 -> 3.0.0
 |  - org.jetbrains.kotlin:kotlin-stdlib
+|    - androidx.annotation:annotation:1.2.0

\`\`\`

</details>`;

        const diff = mergeResultOutputWithoutRemovals;
        const comment = getPrDiffComment(["Something"], diff);
        assert.include(comment, expected);
    });

    it("getPrNoDiffComment returns no-diff header", () => {
        const comment = getPrNoDiffComment();
        assert.equal(comment, "### ✅ No dependency differences found");
    });

})