import { describe, it } from "node:test";
import { Dependency } from "../src/models/dependency.model";
import { getAfterOutput, getBeforeOutput } from "./assets";
import { parseRawOutput } from "../src/processor/input-parser";
import { assert } from "chai";

/**
 * ===============================================================
 * Assets
 * ===============================================================
 */
let beforeList = [
    new Dependency("com.squareup.okhttp3:okhttp", "4.10.0", [
        new Dependency("com.squareup.okio:okio", "2.8.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.4.0")
        ]),
        new Dependency("org.jetbrains.kotlin:kotlin-stdlib", "1.4.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.4.0")
        ])
    ])
];
let afterList = [
    new Dependency("com.squareup.okhttp3:okhttp", "4.10.0", [
        new Dependency("com.squareup.okio:okio", "3.0.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0")
        ]),
        new Dependency("org.jetbrains.kotlin:kotlin-stdlib", "1.5.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0")
        ])
    ]),
    new Dependency("androidx.core:core-ktx", "1.7.0", [
        new Dependency("androidx.annotation:annotation", "1.2.0"),
        new Dependency("androidx.core:core", "1.7.0")
    ])
];

/**
 * ===============================================================
 * Tests
 * ===============================================================
 */
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
