import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import tw, { styled } from "twin.macro"
import Logo from "../components/Logo"
import TreeModel from "../lib/TreeModel"

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
`

// Fake data
let Tree = new TreeModel()
let root = Tree.parse({
  id: "root",
  children: [
    {
      id: "0",
      title: "Foo",
      children: [
        {
          id: "1",
          title: "Foo 1",
          children: [
            { id: "8", title: "Foo 1-1" },
            { id: "9", title: "Foo 1-2" },
            { id: "10", title: "Foo 1-3" },
          ],
        },
        { id: "2", title: "Foo 2" },
        { id: "3", title: "Foo 3" },
      ],
    },
    {
      id: "4",
      title: "Bar",
      children: [
        { id: "5", title: "Bar 1" },
        { id: "6", title: "Bar 2" },
        { id: "7", title: "Bar 3" },
      ],
    },
  ],
})

function App() {
  const [path, setPath] = useState(root.getPath())

  // Only load the dragndrop clientside
  const [componentMounted, setComponentMounted] = useState(false)
  useEffect(() => setComponentMounted(true), [])

  function onDragEnd(result) {
    const { draggableId, source, destination } = result

    // Dropped outside the list
    if (!destination) return

    const srcNode = root.first(n => n.model.id === draggableId)
    const dstNode = root.first(n => n.model.id === destination.droppableId)

    // Reorder within the same droppable
    if (source.droppableId === destination.droppableId) {
      srcNode.setIndex(destination.index)
      setPath(srcNode.getPath())

      // Move to another droppable
    } else {
      dstNode.addChildAtIndex(srcNode.drop(), destination.index)
      setPath(dstNode.getPath())
    }
  }

  const stringifyPath = node => node.map(n => n.model.id).join("/")

  return (
    <>
      <Nav>
        <Logo tw="mx-4" />
        <NavButton type="button">Something</NavButton>
        <NavButton type="button">Something else</NavButton>
      </Nav>

      {componentMounted && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Columns>
            {path.map(node => (
              <Droppable
                droppableId={node.model.id}
                key={node.model.id}
                isCombineEnabled
              >
                {(provided, snapshot) => (
                  <Column>
                    <List
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                      {...provided.droppableProps}
                    >
                      {node.children.map((item, index) => (
                        <Draggable
                          key={item.model.id}
                          draggableId={item.model.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Item
                              role="button"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                              onClick={() => {
                                const isCurrentPath =
                                  stringifyPath(path) ===
                                  stringifyPath(item.getPath())
                                setPath(
                                  isCurrentPath
                                    ? path.slice(0, -1)
                                    : item.getPath()
                                )
                              }}
                              onDoubleClick={() => {
                                console.log("edit", item.model)
                                setPath(item.setIndex(0).getPath())
                              }}
                            >
                              {item.model.id}. {item.model.title}
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
}

export default App
