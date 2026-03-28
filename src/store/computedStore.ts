type Listener = () => void

type ComputedNode = {
  deps: string[]
  evaluate: (data: Record<string, any> | null) => boolean
  value: boolean
  listeners: Set<Listener>
}

export class ComputedStore {

  private computedNodes = new Map<string, ComputedNode>()

  private dependencyGraph = new Map<string, Set<ComputedNode>>()

  constructor(
    private getData: () => Record<string, any> | null
  ) {}

  registerComputed(
    key: string,
    deps: string[],
    evaluate: (data: Record<string, any> | null) => boolean
  ) {

    if (this.computedNodes.has(key)) {
      return this.computedNodes.get(key)!
    }

    const node: ComputedNode = {
      deps,
      evaluate,
      value: false,
      listeners: new Set()
    }

    node.value = evaluate(this.getData())

    this.computedNodes.set(key, node)

    deps.forEach(dep => {

      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, new Set())
      }

      this.dependencyGraph.get(dep)!.add(node)

    })

    return node
  }

  trigger(key: string) {

    const nodes = this.dependencyGraph.get(key)

    if (!nodes) return

    nodes.forEach(node => this.recompute(node))
  }

  private recompute(node: ComputedNode) {

    const next = node.evaluate(this.getData())

    if (next === node.value) return

    node.value = next

    node.listeners.forEach(cb => cb())
  }

}