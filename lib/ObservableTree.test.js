import { autorun } from "mobx"
import ObservableTree from "./ObservableTree"

describe("ObservableTree", () => {
  const tree = new ObservableTree()

  beforeEach(() => tree.reset())

  it("Resets the tree", () => {
    tree.addTask({ title: "new task", content: "Do all the things" })
    expect(tree.tasks).toHaveLength(1)
    tree.reset()
    expect(tree.tasks).toHaveLength(0)
  })

  it("Add a root task", () => {
    expect(tree.tasks).toHaveLength(0)
    tree.addTask({ title: "new task", content: "Do all the things" })
    expect(tree.tasks).toHaveLength(1)
  })

  it("Add a sub task", () => {
    const topLevelTaskId = tree.addTask({
      title: "root task",
      content: "Stuff",
    })
    tree.addTask({
      title: "root task",
      content: "Stuff",
      parent: topLevelTaskId,
    })
    expect(tree.root).toHaveLength(1)
    expect(tree.root[0].children).toHaveLength(1)
  })

  it("Updates a task", () => {
    const t1 = tree.addTask({ title: "new task 1", content: "task1" })
    tree.updateTask(t1, { title: "new title" })
    let updatedTask = tree.tasks.find(t => t.id === t1)
    expect(updatedTask).toHaveProperty("title", "new title")
    expect(updatedTask).toHaveProperty("content", "task1")

    tree.updateTask(t1, { content: "something new" })
    updatedTask = tree.tasks.find(t => t.id === t1)
    expect(updatedTask).toHaveProperty("title", "new title")
    expect(updatedTask).toHaveProperty("content", "something new")
  })

  it("Removes a task", () => {
    const t1 = tree.addTask({ title: "new task 1", content: "task1" })
    const t2 = tree.addTask({ title: "new task 2", content: "task2" })
    const t3 = tree.addTask({ title: "new task 3", content: "task3" })
    tree.removeTask(t2)
    expect(tree.tasks.map(t => t.title)).toContain("new task 1")
    expect(tree.tasks.map(t => t.title)).not.toContain("new task 2")
    expect(tree.tasks.map(t => t.title)).toContain("new task 3")
  })

  it("Reorders root tasks", () => {
    const t1 = tree.addTask({ title: "t1", content: "task1" })
    const t2 = tree.addTask({ title: "t2", content: "task2" })
    const t3 = tree.addTask({ title: "t3", content: "task3" })
    expect(tree.root.children.map(t => t.id)).toEqual([t1, t2, t3])
    tree.reorder(t2, 0)
    expect(tree.root.children.map(t => t.id)).toEqual([t2, t1, t3])
  })
})
