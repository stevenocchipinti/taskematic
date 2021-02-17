import { autorun, makeAutoObservable, reaction, runInAction, toJS } from "mobx"
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

export class ProjectItem {
  store = null
  record = {}
  id = ""

  constructor(store, id, record) {
    makeAutoObservable(this, { id: false, store: false })
    this.store = store
    this.id = id
    this.record = record
    // autorun(() => console.log("node autorun", record))
  }

  get asJS() {
    return {
      id: this.id,
      record: toJS(this.record),
      children: this.children,
    }
  }

  get children_ids() {
    if (!this.record?.children_ids) return []
    return Object.keys(this.record?.children_ids)
  }
  get children() {
    const children = this.children_ids.map(id => this.store.nodes[id])
    return children.every(Boolean) ? children : []
  }
  get isLeaf() {
    return this.children.length === 0
  }

  get title() {
    return this.record?.title
  }
  get content() {
    return this.record?.content
  }
  get done() {
    return this.record.done || false
  }

  get progress() {
    if (this.isLeaf) return this.done ? 1 : 0
    return (
      this.children.reduce((sum, child) => sum + child.progress, 0) /
      this.children.length
    )
  }

  updateData(record) {
    this.record = record
  }
}

export class ProjectStore {
  ref = firebase.database().ref("projects/test")
  nodes = {}
  rootId = null
  title = "Untitled project"

  constructor() {
    makeAutoObservable(this)

    this.ref.child("data").on("value", data => {
      runInAction(() => {
        const { title, root_id } = data.val()
        this.title = title
        this.rootId = root_id
      })
    })

    this.ref.child("nodes").on("child_added", data => {
      runInAction(() => {
        // console.log("add", data, data.val())
        this.nodes[data.key] = new ProjectItem(this, data.key, data.val())
      })
    })

    this.ref.child("nodes").on("child_changed", data => {
      runInAction(() => {
        // console.log("change", data.val())
        this.nodes[data.key].updateData(data.val())
      })
    })

    this.ref.child("nodes").on("child_removed", data => {
      runInAction(() => {
        // console.log("remove", data.val())
        delete this.nodes[data.key]
      })
    })

    autorun(() => console.log("READY?", this.ready))
  }

  get root() {
    return this.nodes?.[this?.rootId]
  }

  // Firebase initially calls the child_added callback for every item in the DB
  // but does not give an indication of when the initial load is complete
  // without setting up a sepatate callback, which would double up the creation
  // of ProjectItem objects so this is an alternative to ensure everything is
  // loaded by checking that all referenced child ids have downloaded nodes
  get ready() {
    if (!this.root) return false
    const referencedChildIds = Object.values(this.nodes).flatMap(
      n => n.children_ids
    )
    const currentlyDownloadedChildIds = Object.keys(this.nodes)

    // Creates a set that contains those elements of set A that are not in set B
    let a = new Set(referencedChildIds)
    let b = new Set(currentlyDownloadedChildIds)
    let itemsNotYetDownloaded = new Set([...a].filter(x => !b.has(x)))

    return itemsNotYetDownloaded.size === 0
  }

  addTask() {
    const newNode = this.ref.child("nodes").push({ title: "Auto new one" })
    this.ref
      .child(`nodes/${this.root.id}/children_ids`)
      .update({ [newNode.key]: true })
  }
}
