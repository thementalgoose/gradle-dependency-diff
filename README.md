# Gradle Dependency Diff

> Help spot transitive dependency updates across the project

A small github action designed for android projects which will analyse the gradle dependency graph of a base branch and a target branch and highlight any differences between the two. 

### Setup 

```yml
# Optional: 
#  If running inside a pull request, generate the dependency
#  outputs of previous state by checking out the base ref, 
#  generating the report and then change back to the head ref 
#  and generate that report in two different files
- name: Checkout base branch + generate report
  run: | 
    git checkout ${{ github.base_ref }}
    ./gradlew :app:dependencies --configuration releaseRuntimeClasspath >> before.txt

- name: Checkout head branch + generate report
  run: | 
    git checkout ${{ github.head_ref }}
    ./gradlew :app:dependencies --configuration releaseRuntimeClasspath >> after.txt


# This action
#  Run the diff report
- name: Generate dependency diff
  id: diff
  uses: thementalgoose/gradle-dependency-diff@v1
  with: 
    before: before.txt
    after: after.txt
    output_to_file: true
    output_to_file_name: diff.txt


# Optional
#  Post the report to the pull request via. a comment 
#  or use the output_to_file option and archive the file
#  for viewing later
- name: Post PR comment
  uses: mshick/add-pr-comment@v2
  if: ${{ steps.diff.outputs.is_difference_found }}
  with:
    message: |
      ### Dependency report
      ```diff
      ${{ steps.diff.outputs.result }}
      ```
- name: Archive dependency diff
  uses: actions/upload-artifact@v4
  with:
    name: dependency-diff
    path: diff.txt
```

### Parameters

#### Inputs

| Input | Required | Default | Info |
|---|---|---|---|
| `before` | true | | Relative path to a file that holds the output of the original dependency output |
| `after` | true | | Relative path to a file that holds the output of the new dependency output |
| `output_to_file` | false | `false` | Output the diff to a file |
| `output_to_file_name` | false | `diff.txt` | The file name that the output diff is saved too. Only generated if output_to_file is true | 

#### Outputs

| Output | Type | Info |
|---|---|---|
| `is_difference_found` | boolean | If a dependency difference was found | 
| `difference` | string | Dependency difference output |

### Sample output

Example: I update `androidx.window:window` from 1.4.0 to 1.5.0 in an android project

```diff |- com.squareup.okhttp3:okhttp:4.9.0 -> 4.10.0
 |- androidx.core:core-ktx:1.6.0 -> 1.7.0
 |- com.google.android.material:material
 |  - androidx.annotation:annotation:1.1.0 -> 1.2.0
 |  - androidx.transition:transition
 |    - androidx.annotation:annotation:1.1.0 -> 1.2.0
 |    - androidx.core:core:1.6.0 -> 1.7.0
-|  - androidx.core:core:1.6.0
+|- com.google.guava:guava:30.1-jre
+|  - com.google.guava:failureaccess:1.0.1
+|  - com.google.code.findbugs:jsr305:3.0.2
```