import { createTree } from "./Tree"

describe("Tree data structure", () => {
  //
  //                                        0 = 75%
  //          0                .            1 = 100%
  //         / \              / \           2 = 50%
  //        1   2            .   .          3 = done
  //       /   / \          /   / \         4 = done
  //      3   4   5        Y   Y   N        5 = not done
  //
  const tree = createTree({
    id: "0",
    title: "root",
    children: [
      {
        id: "1",
        title: "one",
        children: [{ id: "3", title: "three", done: true }],
      },
      {
        id: "2",
        title: "two",
        children: [
          { id: "4", title: "four", done: true },
          { id: "5", title: "five", done: false },
        ],
      },
    ],
  })

  it("determines if it is a leaf node or not", () => {
    const firstChild = tree.root.children[0]
    const leafNode = tree.root.children[0].children[0]
    expect(firstChild.isLeaf).toBe(false)
    expect(leafNode.isLeaf).toBe(true)
  })

  it("calculates progress recursively", () => {
    expect(tree.root.progress).toBe(0.75)
    expect(tree.root.children[1].progress).toBe(0.5)
  })
})
