import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import tw, { styled } from "twin.macro"

import Logo from "../components/Logo"
import Column from "../components/Column"
import Item from "../components/Item"
import { createTree } from "../lib/Tree"
import useClientSideOnly from "../lib/useClientSideOnly"
import data from "../data"

const Nav = tw.nav`flex bg-gray-50 h-16 border-b`
const Columns = styled.div`
  ${tw`flex flex-grow gap-6 p-6 bg-gray-100 overflow-auto`}
  scroll-snap-type: x mandatory;

  // This is a dodgy hack until I can work out how to get the margin at the end
  &:after {
    content: ".";
    color: transparent;
  }
`

// Fake data
const tree = createTree(data)
const { root } = tree

const App = () => {
  const [path, setPath] = useState(root.path)

  // Only load the dragndrop clientside
  const clientSideOnly = useClientSideOnly()

  function onDragEnd(result) {
    const { draggableId, source, destination } = result

    // Dropped outside the list
    if (!destination) return

    const srcNode = root.first(n => n.id === draggableId)
    const dstNode = root.first(n => n.id === destination.droppableId)

    // Reorder within the same droppable
    if (source.droppableId === destination.droppableId) {
      srcNode.setIndex(destination.index)
      setPath(srcNode.path)

      // Move to a different column
    } else {
      const removedNode = srcNode.drop()
      dstNode.addChild(removedNode, destination.index)
      setPath(dstNode.path)
    }
  }

  const stringifyPath = node => node.map(n => n.id).join("/")
  const withinCurrentPath = givenPath =>
    stringifyPath(path).match(stringifyPath(givenPath))

  return (
    <>
      <Nav>
        <Logo tw="mx-4" />
      </Nav>

      {clientSideOnly && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Columns>
            {path.map((node, columnIndex) => (
              <Column
                key={node.id}
                node={node}
                renderChild={(childNode, childIndex) => {
                  const isSelected = withinCurrentPath(childNode.path)
                  return (
                    <Item
                      key={childNode.id}
                      node={childNode}
                      index={childIndex}
                      isSelected={isSelected}
                      hasReducedFocus={!!path[columnIndex + 1]}
                      onClick={() => {
                        setPath(isSelected ? node.path : childNode.path)
                      }}
                    />
                  )
                }}
              />
            ))}
          </Columns>
        </DragDropContext>
      )}
    </>
  )
}

export default App
