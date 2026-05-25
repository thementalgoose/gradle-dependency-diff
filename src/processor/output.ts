import {Addition} from '../models/dependency-change.model'
import {
  After,
  Before,
  DependencyTree,
  Node
} from '../models/dependency-tree.model'
import {space} from '../utils/string.utils'

export function outputList(models: DependencyTree[], index: number = 0): Set<string> { 
  if (!containsChildrenWithDiff(models)) {
    return new Set<string>();
  }
  let set = new Set<string>();
  for (let x of models) { 
    if (x instanceof Node) {
      if (x.before_version != x.after_version) {
        set.add(`${x.name}:${x.before_version} -> ${x.after_version}`);
      } else if (containsChildrenWithDiff(x.children)) {
        let subSet = outputList(x.children, index + 1);
        for (let y of Array.from(subSet)) { 
          set.add(y);
        }
      }
    }
    if (x instanceof Before) {
      let subSet = outputList(x.removed, index + 1);
      for (let y of Array.from(subSet)) { 
        set.add(y);
      }
    }
    if (x instanceof After) {
      let subSet = outputList(x.added, index + 1);
      for (let y of Array.from(subSet)) { 
        set.add(y);
      }
    }
  }
  return set;
}

export function outputDiff(models: DependencyTree[], showRemovals: boolean, index: number = 0): string {
  if (!containsChildrenWithDiff(models)) {
    return ''
  }
  let returnOutput = ''
  for (let x of models) {
    if (x instanceof Node) {
      if (x.before_version != x.after_version) {
        returnOutput += ` |${space(index)}- ${x.name}:${x.before_version} -> ${x.after_version}\n`
      } else if (containsChildrenWithDiff(x.children)) {
        returnOutput += ` |${space(index)}- ${x.name}\n`
        returnOutput += outputDiff(x.children, showRemovals, index + 1)
      }
    }
    if (x instanceof Before && showRemovals) {
      returnOutput += `-|${space(index)}- ${x.name}:${x.before_version}\n`
      returnOutput += outputDiff(x.removed, showRemovals, index + 1)
    }
    if (x instanceof After) {
      returnOutput += `+|${space(index)}- ${x.name}:${x.after_version}\n`
      returnOutput += outputDiff(x.added, showRemovals, index + 1)
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
