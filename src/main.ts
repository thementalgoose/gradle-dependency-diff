import * as core from '@actions/core'
import * as github from '@actions/github'
import {parseOutput} from './processor/input-parser'
import {merge} from './processor/merger'
import {output} from './processor/output'
import {writeFile} from './utils/file.utils'
import { postComment } from './github/comments'

export interface Inputs {
  before: string
  after: string
  outputToFile: boolean
  outputToFileName: string
  postPrComment: boolean
  repoToken: string
  showRemovals: boolean
}

async function run(): Promise<boolean> {
  try {
    // Fetch github action inputs
    const inputs: Inputs = {
      before: core.getInput('before'),
      after: core.getInput('after'),
      outputToFile: core.getInput('output_to_file') == 'true',
      outputToFileName: core.getInput('output_to_file_name'),
      postPrComment: core.getInput('post_pr_comment') == 'true',
      repoToken: core.getInput('repo_token'),
      showRemovals: core.getInput('show_removals') == 'true'
    }
    
    // Validate inputs
    core.startGroup('Validating inputs')
    core.endGroup()
    
    // Read input files into a dependencies structure
    core.startGroup('Reading files')
    let beforeDeps = parseOutput(inputs.before)
    let afterDeps = parseOutput(inputs.after)
    core.endGroup()
    
    // Merge outputs
    core.startGroup('Merging outputs')
    let merger = merge(beforeDeps, afterDeps)
    core.endGroup()
    
    // Filter out similar data + generate output
    core.startGroup('Generating output')
    let result = output(merger, inputs.showRemovals)
    core.endGroup()
    
    let differenceFound = result != ''
    core.setOutput('is_difference_found', differenceFound);
    core.setOutput('result', result);
    
    if (inputs.outputToFile) {
      core.startGroup(`Saving to '${inputs.outputToFileName}'`)
      writeFile(inputs.outputToFileName, result)
      core.endGroup()
    }
  
    if (inputs.postPrComment) { 
      core.startGroup("Posting github comment");
      let messageId: string = "gradle-dependency-diff";
      if (differenceFound) { 
        let requestResult = await postComment(inputs.repoToken, messageId, getPrDiffComment(result));
        console.log(`Posting diff comment: ${requestResult}`);
      } else { 
        let requestResult = await postComment(inputs.repoToken, messageId, getPrNoDiffComment());
        console.log(`Posting no diff comment: ${requestResult}`);
      }
      core.endGroup();
    }

    core.startGroup('Report printout')
    console.log('================================================')
    console.log('         Dependency difference report')
    console.log('================================================')
    console.log(result)
    console.log('================================================')
    core.endGroup()

  } catch (error: any) {
    // Handle errors and indicate failure
    console.error(error)
    core.setFailed(error.message)
  }

  return true
}

function getPrDiffComment(result: string): string { 
  // Extract dependency names from the result lines
  const names = new Set<string>();
  for (const line of result.split(/\r?\n/)) {
    if (!line || !line.includes('-')) continue
    const m = line.match(/-\s+(.+)$/)
    if (!m) continue
    const depWithVersion = m[1].trim()
    // strip trailing version info (last ":<version>" or ":<version> -> <version>")
    const parts = depWithVersion.split(':')
    if (parts.length <= 1) {
      names.add(depWithVersion)
    } else {
      const name = parts.slice(0, parts.length - 1).join(':')
      names.add(name)
    }
  }

  const bullets = Array.from(names)
    .sort()
    .map(n => `- ${n}`)
    .join('\n')

  return `
### ⚠️ Dependency differences found

Differences in the dependency outputs have been introduced in this PR. Below are the high-level dependency names touched in this change:

${bullets}

<details> 
<summary>View differences here</summary>

\`\`\`diff
${result}
\`\`\`

</details> 

_Created at ${ new Date().toISOString() }_
  `.trim();
}

function getPrNoDiffComment(): string {
  return `
### ✅ No dependency differences found
  `.trim();
}

run()
