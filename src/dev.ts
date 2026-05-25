import {argv} from 'process'
import {getIndentation, parseOutput} from './processor/input-parser'
import {merge} from './processor/merger'
import {outputDiff, outputList} from './processor/output'

async function main() {
  let file1 = argv[2]
  let file2 = argv[3]

  let before = parseOutput(file1)
  let after = parseOutput(file2)

  let merger = merge(before, after)

  console.log(" == LIST ======================");
  let list = outputList(merger)
  console.log(list)

  console.log(" == DIFF ======================");
  let result = outputDiff(merger, true)
  console.log(result)
}

main()
