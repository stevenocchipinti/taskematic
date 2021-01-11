import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import tw, { styled } from "twin.macro"
import { observer } from "mobx-react-lite"
import Logo from "../components/Logo"
import { createTree } from "../lib/Tree"
import data from "../data"

const Nav = tw.nav`flex bg-gray-50 h-16 border-b`
const NavButton = tw.button`px-4 hover:bg-gray-200 text-gray-600 transition duration-300`
const Columns = styled.div`
  ${tw`flex flex-grow gap-6 p-6 bg-gray-100 overflow-auto`}
  scroll-snap-type: x mandatory;
`
const Column = styled.div`
  scroll-snap-align: center;
`

const List = styled.ul`
  ${tw`rounded-lg transition w-64`}
  min-height: 150px;
  ${({ isDraggingOver }) => isDraggingOver && tw`shadow-inner bg-gray-300`}
  :empty {
    ${tw`shadow-inner bg-gray-200`}
  }
`
const Item = styled.li`
  ${tw`p-4 w-64 border-b last:border-0 bg-white text-gray-600 shadow`}
  ${tw`first:rounded-t last:rounded-b`}
  ${tw`transition duration-200 hover:bg-gray-100`}
  ${({ isDragging }) => isDragging && tw`rounded`}
  ${({ done }) => done && `text-decoration: line-through;`}
`

// Fake data
const tree = createTree(data)
const { root } = tree

const App = observer(() => {
  const [path, setPath] = useState(root.path)
  // const [path, setPath] = useState([root])

  // Only load the dragndrop clientside
  const [componentMounted, setComponentMounted] = useState(false)
  useEffect(() => setComponentMounted(true), [])

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

      // TODO: Move to another droppable
    } else {
      dstNode.addChildAtIndex(srcNode.drop(), destination.index)
      setPath(dstNode.path)
    }
  }

  const stringifyPath = node => node.map(n => n.id).join("/")

  return (
    <>
      <Nav>
        <Logo tw="mx-4" />
        <NavButton type="button">
          {path.map(p => p.title).join(" ▷ ")}
        </NavButton>
      </Nav>

      {componentMounted && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Columns>
            {path.map(node => (
              <Droppable droppableId={node.id} key={node.id} isCombineEnabled>
                {(provided, snapshot) => (
                  <Column>
                    <List
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                      {...provided.droppableProps}
                    >
                      {node.children.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Item
                              role="button"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                              done={item.done}
                              title={item.id}
                              onClick={() => {
                                const isCurrentPath =
                                  stringifyPath(path) ===
                                  stringifyPath(item.path)
                                setPath(
                                  isCurrentPath ? path.slice(0, -1) : item.path
                                )
                              }}
                            >
                              {item.title}
                            </Item>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  </Column>
                )}
              </Droppable>
            ))}
          </Columns>
        </DragDropContext>
      )}
    </>
  )
})

export default App
