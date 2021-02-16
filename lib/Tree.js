import { autorun, makeAutoObservable, runInAction } from "mobx"
import { nanoid } from "nanoid"
import firebase from "../lib/firebase"

export function createNode(tree, data) {
  const x = makeAutoObservable({
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
  autorun(() => console.log(this.title))
  return x
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

// =============================================================================

export class ProjectNode {
  store = null
  data = {}
  children = []
  id = ""

  constructor(store, id) {
    makeAutoObservable(this, { store: false, id: false })
    this.id = id
    this.store = store
    this.data = store.nodes[id]
    const children_ids = this.data.children_ids
      ? Object.keys(this.data.children_ids)
      : []
    this.children =
      children_ids.length > 0
        ? children_ids.map(id => new ProjectNode(store, id))
        : []
    autorun(() => console.log("node autorun", id))
  }

  get title() {
    return this.data.title
  }

  get asJson() {
    return {
      title: this.title,
      children: this.children.map(child => child.asJson),
    }
  }
}

export class ProjectItem {
  store = null
  data = {}
  id = ""

  constructor(id, data) {
    makeAutoObservable(this, { id: false })
    this.id = id
    this.data = data
    autorun(() => console.log("node autorun", id))
  }

  updateData(data) {
    this.data = data
  }

  get title() {
    return this.data.title
  }

  get asJS() {
    return {
      id: this.id,
      ...this.data,
    }
  }
}

export class ProjectStore {
  ref = firebase.database().ref("projects/test")
  nodes = {}
  root = null
  name = ""
  isLoading = true

  constructor() {
    makeAutoObservable(this)

    // NOTE: This causes all nodes to re-render when only one changes - BAD
    // FIXME: Putting conditional logic in here as per the mobx example
    // would allow me to flip the loading flag upon first callback as opposed to
    // the individual child callbacks where I don't know when the first load of
    // all the children has finished. Knowing this may be important for building
    // the tree structure.
    this.ref.child("nodes").on("value", data => {
      runInAction(() => {
        const allNodes = data.val()
        Object.keys(allNodes).map(nodeId => {
          this.nodes[nodeId] = new ProjectItem(nodeId, allNodes[nodeId])
        })
      })
    })

    // NOTE: The below methods only trigger re-renders when needed however I
    // can't tell when they have finished their initial load which may be
    // important so once the data is loaded we can flip the loading flag and
    // contruct the tree structure?

    // this.ref.child("nodes").on("child_added", data => {
    //   runInAction(() => {
    //     console.log("add", data, data.val())
    //     this.nodes[data.key] = new ProjectItem(data.key, data.val())
    //   })
    // })

    // this.ref.child("nodes").on("child_changed", data => {
    //   runInAction(() => {
    //     console.log("change", data.val())
    //     this.nodes[data.key].updateData(data.val())
    //   })
    // })

    // this.ref.child("nodes").on("child_removed", data => {
    //   runInAction(() => {
    //     console.log("remove", data.val())
    //     delete this.nodes[data.key]
    //   })
    // })
  }

  addTask() {
    const newNode = this.ref.child("nodes").push({ title: "Auto new one" })
    this.ref
      .child(`nodes/${this.root.id}/children_ids`)
      .update({ [newNode.key]: true })
  }

  get tree() {
    // TODO: Make this a computed tree structure
    return this.nodes
  }
}
