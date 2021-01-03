import { makeObservable, observable, action, autorun } from "mobx"

class ObservableTree {
  nextId = 1
  tasks = []
  root = {
    children: [],
  }

  addTask({ title, content, parent }) {
    const parentNode = parent ? parent : this.root
    const id = this.nextId++
    this.tasks.push({ id, title, content, done: false })
    parentNode.children.push({ id, children: [] })
    return id
  }

  updateTask(id, newProperties) {
    const existingTaskId = this.tasks.findIndex(t => t.id === id)
    this.tasks[existingTaskId] = {
      ...this.tasks[existingTaskId],
      ...newProperties,
    }
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }

  reorder(taskId, newIndex) {
    const startIndex = this.root.children.findIndex(t => t.id === taskId)
    const [removed] = this.root.children.splice(startIndex, 1)
    this.root.children.splice(newIndex, 0, removed)
  }

  reset() {
    this.tasks = []
    this.root = { children: [] }
    this.nextId = 0
  }

  constructor() {
    makeObservable(this, {
      tasks: observable,
      root: observable,
      // completedTodosCount: computed,
      // report: computed,
      addTask: action,
      updateTask: action,
      removeTask: action,
      reset: action,
      reorder: action,
    })
  }
}

export default ObservableTree
