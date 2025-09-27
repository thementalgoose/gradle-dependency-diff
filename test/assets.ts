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