import {Dependency} from './dependency.model'

export interface DependencyTree {
  name: string
}

export class Node implements DependencyTree {
  public name: string
  public before_version: string
  public after_version: string
  public children: DependencyTree[]

  constructor(
    name: string,
    before_version: string,
    after_version: string,
    children: DependencyTree[]
  ) {
    this.name = name
    this.before_version = before_version
    this.after_version = after_version
    this.children = children
  }
}

export class Before implements DependencyTree {
  public name: string
  public before_version: string
  public removed: DependencyTree[]

  constructor(name: string, before_version: string, removed: DependencyTree[]) {
    this.name = name
    this.before_version = before_version
    this.removed = removed
  }
}

export class After implements DependencyTree {
  public name: string
  public after_version: string
  public added: DependencyTree[]

  constructor(name: string, after_version: string, added: DependencyTree[]) {
    this.name = name
    this.after_version = after_version
    this.added = added
  }
}
