import { makeAutoObservable } from "mobx"
import { nanoid } from "nanoid"

export function createNode(data) {
  return makeAutoObservable({
    id: data?.id || nanoid(5),
    data,
    parent: null,
    children: [],

    get title() {
      return this.data.title
    },
    get content() {
      return this.data.content
    },
    get done() {
      return this.data.done || false
    },
    get progress() {
      if (this.isLeaf) return this.done ? 1 : 0
      return (
        this.children.reduce((sum, node) => sum + node.progress, 0) /
        this.children.length
      )
    },
    get path() {
      const parentPath = this.parent?.path
      return parentPath ? [...parentPath, this] : [this]
    },
    get isLeaf() {
      return this.children.length === 0
    },

    setDone(newDone) {
      this.data.done = newDone
    },

    addChild(newNode, index) {
      this.children.splice(index ?? this.children.length, 0, newNode)
      newNode.parent = this
      return newNode
    },
    createChild({ children, ...data }, index) {
      const newNode = createNode(data)
      children?.forEach(data => newNode.createChild(data))
      this.addChild(newNode, index)
      return newNode
    },
    setData(newData) {
      return (this.data = {
        ...this.data,
        newData,
      })
    },
    setIndex(newIndex) {
      const currentIndex = this.parent.children.findIndex(i => i === this)
      this.parent.children.splice(currentIndex, 1)
      this.parent.children.splice(newIndex, 0, this)
    },
    drop() {
      const currentIndex = this.parent.children.findIndex(i => i === this)
      const [removedNode] = this.parent.children.splice(currentIndex, 1)
      removedNode.parent = null
      return removedNode
    },
    find(predicate) {
      if (predicate(this)) return this
      for (const child of this.children) {
        const match = child.find(predicate)
        if (match) return match
      }
      return false
    },
  })
}

export function createTree(initialData) {
  const tree = makeAutoObservable({
    root: null,
    parse(data) {
      const newNode = createNode(data)
      data?.children?.forEach(data => newNode.createChild(data))
      this.root = newNode
    },
  })
  if (initialData) tree.parse(initialData)
  return tree
}
