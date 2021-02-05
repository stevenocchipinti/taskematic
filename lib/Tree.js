import { makeAutoObservable } from "mobx"
import { nanoid } from "nanoid"

export function createNode(tree, data) {
  return makeAutoObservable({
    id: data?.id || nanoid(5),
    data,
    tree,
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
    setTitle(newTitle) {
      this.data.title = newTitle
    },
    setContent(newContent) {
      this.data.content = newContent
    },

    addChild(newNode, index) {
      this.children.splice(index ?? this.children.length, 0, newNode)
      newNode.parent = this
      return newNode
    },
    createChild({ children, ...data }, index) {
      const newNode = createNode(this.tree, data)
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
    delete() {
      const currentIndex = this.parent.children.findIndex(i => i === this)
      this.parent.children.splice(currentIndex, 1)
      this.tree.notify("delete", this)
      return this
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

export function createTree(initialData, callbacks = {}) {
  const tree = makeAutoObservable({
    title: "New project",
    root: null,
    callbacks,
    parse(data) {
      if (data?.title) this.title = data?.title
      const newNode = createNode(this, data)
      data?.children?.forEach(data => newNode.createChild(data))
      this.root = newNode
    },
    notify(type, data) {
      callbacks?.[type]?.(data)
    },
  })
  if (initialData) tree.parse(initialData)
  return tree
}
