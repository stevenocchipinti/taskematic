import { useState, useEffect } from "react"
import { makeAutoObservable, runInAction, toJS } from "mobx"
import firebase from "../lib/firebase"

const objectEntriesSortedByValue = obj =>
  Object.entries(obj).sort(([aKey, aVal], [bKey, bVal]) => aVal - bVal)

class ProjectNode {
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
    return objectEntriesSortedByValue(this.record?.children_ids).map(
      ([key]) => key
    )
  }
  get children() {
    const children = this.children_ids.map(id => this.store.nodes[id])
    return children.every(Boolean) ? children : []
  }
  get isLeaf() {
    return this.children.length === 0
  }
  get parent() {
    return Object.values(this.store.nodes).find(node =>
      node.children_ids.includes(this.id)
    )
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
  get path() {
    const parentPath = this.parent?.path
    return parentPath ? [...parentPath, this] : [this]
  }

  updateLocalRecord(record) {
    this.record = record
  }

  setTitle(title) {
    this.store.updateNode(this.id, { title })
  }

  setContent(content) {
    this.store.updateNode(this.id, { content })
  }

  setDone(done) {
    this.store.updateNode(this.id, { done })
  }

  createChildNode(data) {
    this.store.addNode(data, this.id)
  }

  delete() {
    this.store.deleteNode(this.id)
  }
}

class ProjectStore {
  nodes = {}
  rootId = null
  title = "Untitled project"

  constructor(projectId) {
    makeAutoObservable(this)

    this.projectRef = firebase.database().ref(`projects/${projectId}`)
    this.projectRef.child("data").on("value", data => {
      runInAction(() => {
        const { title, root_id } = data.val()
        this.title = title
        this.rootId = root_id
      })
    })

    this.projectRef.child("nodes").on("child_added", data => {
      runInAction(() => {
        // console.log("add", data, data.val())
        this.nodes[data.key] = new ProjectNode(this, data.key, data.val())
      })
    })

    this.projectRef.child("nodes").on("child_changed", data => {
      runInAction(() => {
        // console.log("change", data.val())
        this.nodes[data.key].updateLocalRecord(data.val())
      })
    })

    this.projectRef.child("nodes").on("child_removed", data => {
      runInAction(() => {
        // console.log("remove", data.val())
        delete this.nodes[data.key]
      })
    })
  }

  get root() {
    return this.nodes?.[this?.rootId]
  }

  // Firebase initially calls the child_added callback for every node in the DB
  // but does not give an indication of when the initial load is complete
  // without setting up a sepatate callback, which would double up the creation
  // of ProjectNode objects so this is an alternative to ensure everything is
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
    let idsNotYetDownloaded = new Set([...a].filter(x => !b.has(x)))

    return idsNotYetDownloaded.size === 0
  }

  addNode(data, parentId = this.rootId) {
    const newKey = this.projectRef.child("nodes").push(data).key
    this.projectRef
      .child(`nodes/${parentId}/children_ids`)
      .transaction(children_ids => {
        const newSortKeyValue = children_ids
          ? Object.keys(children_ids).length + 1
          : 1
        return { ...children_ids, [newKey]: newSortKeyValue }
      })
  }

  updateNode(nodeId, data) {
    this.projectRef.child(`nodes/${nodeId}`).update(data)
  }

  deleteNode(nodeIdToDelete) {
    const updateOperationForNode = { [`nodes/${nodeIdToDelete}`]: null }
    const updateOperationsForchildReferences = Object.values(this.nodes)
      .filter(node => node.children_ids.includes(nodeIdToDelete))
      .reduce(
        (result, node) => ({
          ...result,
          [`nodes/${node.id}/children_ids/${nodeIdToDelete}`]: null,
        }),
        {}
      )

    this.projectRef.update({
      ...updateOperationForNode,
      ...updateOperationsForchildReferences,
    })
  }
}

const useProject = projectId => {
  const [project, setProject] = useState({ ready: false })

  useEffect(() => {
    const projectStore = new ProjectStore(projectId)
    setProject(projectStore)
  }, [])

  return project
}

export { useProject }
