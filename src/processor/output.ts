import {Addition} from '../models/dependency-change.model'
import {
  After,
  Before,
  DependencyTree,
  Node
} from '../models/dependency-tree.model'
import {space} from '../utils/string.utils'

export function output(models: DependencyTree[], showRemovals: boolean, index: number = 0): string {
  if (!containsChildrenWithDiff(models)) {
    return ''
  }
  let returnOutput = ''
  for (let x of models) {
    if (x instanceof Node) {
      if (x.before_version != x.after_version) {
        returnOutput += ` |${space(index)}- ${x.name}:${x.before_version} -> ${x.after_version}\n`
        // if (index != 0) {
        //     output(x.children, index + 1);
        // }
      } else if (containsChildrenWithDiff(x.children)) {
        returnOutput += ` |${space(index)}- ${x.name}\n`
        returnOutput += output(x.children, showRemovals, index + 1)
      }
    }
    if (x instanceof Before && showRemovals) {
      returnOutput += `-|${space(index)}- ${x.name}:${x.before_version}\n`
      returnOutput += output(x.removed, showRemovals, index + 1)
    }
    if (x instanceof After) {
      returnOutput += `+|${space(index)}- ${x.name}:${x.after_version}\n`
      returnOutput += output(x.added, showRemovals, index + 1)
    }
  }
  return returnOutput
}

function containsChildrenWithDiff(models: DependencyTree[]): boolean {
  let returnValue = false
  for (let x of models) {
    if (x instanceof Node) {
      if (x.after_version != x.before_version) {
        returnValue = returnValue || true
      }
      if (x.children.length == 0) {
        returnValue = returnValue || false
      }
      let subChanges = containsChildrenWithDiff(x.children)
      if (subChanges) {
        returnValue = returnValue || true
      }
    }
    if (x instanceof Before) {
      returnValue = returnValue || true
    }
    if (x instanceof After) {
      returnValue = returnValue || true
    }
  }
  return returnValue
}
