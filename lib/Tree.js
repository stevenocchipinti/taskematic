import { makeAutoObservable } from "mobx"
import { nanoid } from "nanoid"

export function createNode(data, parent) {
  return makeAutoObservable({
    id: data?.id || nanoid(5),
    data,
    parent,
    children: [],

    get progress() {
      return 33.3
    },
    get title() {
      return this.data.title
    },
    get content() {
      return this.data.content
    },
    get path() {
      const parentPath = this.parent?.path
      return parentPath ? [...parentPath, this] : [this]
    },
    get done() {
      return this.data.done
    },

    addChild({ children, ...data }) {
      const newNode = createNode(data, this)
      this.children.push(newNode)
      children?.forEach(data => newNode.addChild(data))
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
    first(predicate) {
      if (predicate(this)) return this
      for (const child of this.children) {
        const match = child.first(predicate)
        if (match) return match
      }
      return false
    },
  })
}

export function createTree(initialData) {
  const tree = makeAutoObservable({
    root: createNode({ id: nanoid(5), title: "New taskematic" }),
    parse(data) {
      // this.root.title = data?.title || this.root.title
      // this.id = data?.id || nanoid(5)
      data?.children?.forEach(data => this.root.addChild(data))
    },
  })
  if (initialData) tree.parse(initialData)
  return tree
}
