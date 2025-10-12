import { Dependency } from "../src/models/dependency.model";
import { DependencyTree, Node, Before, After } from "../src/models/dependency-tree.model";

export let beforeList = [
    new Dependency("com.squareup.okhttp3:okhttp", "4.10.0", [
        new Dependency("com.squareup.okio:okio", "2.8.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.4.0")
        ]),
        new Dependency("org.jetbrains.kotlin:kotlin-stdlib", "1.4.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.4.0")
        ])
    ])
];
export function getBeforeOutput() { 
    return `
------------------------------------------------------------
Project ':app'
------------------------------------------------------------

variantRuntimeClasspath - Runtime classpath for variant source set 'main'.
+--- com.squareup.okhttp3:okhttp:4.10.0
     +--- com.squareup.okio:okio:2.8.0
     |    \\--- org.jetbrains.kotlin:kotlin-stdlib-common:1.4.0
     \\--- org.jetbrains.kotlin:kotlin-stdlib:1.4.0
          \\--- org.jetbrains.kotlin:kotlin-stdlib-common:1.4.0 (*)

(*) - dependencies omitted (listed previously)

A web-based, searchable dependency report is available by adding the --scan option.
    `.trim();
}


export let afterList = [
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
export function getAfterOutput() { 
    return `
------------------------------------------------------------
Project ':app'
------------------------------------------------------------

variantRuntimeClasspath - Runtime classpath for variant source set 'main'.
+--- com.squareup.okhttp3:okhttp:4.10.0
|    +--- com.squareup.okio:okio:3.0.0
|    |    \\--- org.jetbrains.kotlin:kotlin-stdlib-common:1.5.0
|    \\--- org.jetbrains.kotlin:kotlin-stdlib:1.5.0
|         \\--- org.jetbrains.kotlin:kotlin-stdlib-common:1.5.0 (*)
+--- androidx.core:core-ktx:1.7.0
|    +--- androidx.annotation:annotation:1.2.0
|    +--- androidx.core:core:1.7.0

(*) - dependencies omitted (listed previously)

A web-based, searchable dependency report is available by adding the --scan option.
    `.trim();
}



export let mergeLeftList = [
    new Dependency("com.squareup.okhttp3:okhttp", "4.10.0", [
        new Dependency("com.squareup.okio:okio", "2.8.0", [
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
export let mergeRightList = [
    new Dependency("com.squareup.okhttp3:okhttp", "4.10.0", [
        new Dependency("com.squareup.okio:okio", "3.0.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0")
        ]),
        new Dependency("org.jetbrains.kotlin:kotlin-stdlib", "1.5.0", [
            new Dependency("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0"),
            new Dependency("androidx.annotation:annotation", "1.2.0")
        ])
    ])
];
export let mergeResult: DependencyTree[] = [
    new Node("com.squareup.okhttp3:okhttp", "4.10.0", "4.10.0", [
        new Node("com.squareup.okio:okio", "2.8.0", "3.0.0", [
            new Node("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0", "1.5.0", [])
        ]),
        new Node("org.jetbrains.kotlin:kotlin-stdlib", "1.5.0", "1.5.0", [
            new Node("org.jetbrains.kotlin:kotlin-stdlib-common", "1.5.0", "1.5.0", []),
            new After("androidx.annotation:annotation", "1.2.0", [])
        ])
    ]),
    new Before("androidx.core:core-ktx", "1.7.0", [
        new Before("androidx.annotation:annotation", "1.2.0", []),
        new Before("androidx.core:core", "1.7.0", [])
    ])
];