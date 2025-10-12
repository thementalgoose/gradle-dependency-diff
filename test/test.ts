import { describe, it } from "node:test";
import { afterList, beforeList, getAfterOutput, getBeforeOutput, mergeLeftList, mergeResult, mergeRightList } from "./assets";
import { parseRawOutput } from "../src/processor/input-parser";
import { merge } from "../src/processor/merger";
import { assert } from "chai";

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