import {DependencyTree} from './dependency-tree.model'

export class DependencyTreeHolder {
  public all: DependencyTree[]

  constructor(all: DependencyTree[]) {
    this.all = all
  }

  getAdditions(): DependencyTree[] {
    return this.all
  }

  getDeletions(): DependencyTree[] {
    return this.all
  }

  getDifferences(): DependencyTree[] {
    return this.all
  }
}
