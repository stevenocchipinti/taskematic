// Copied from:
//   https://codesandbox.io/s/react-drag-and-drop-react-beautiful-dnd-forked-d45lq?file=/src/index.js

import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import tw, { styled } from "twin.macro"
import Logo from "../components/Logo"

const Nav = tw.nav`flex bg-gray-50 h-16 border-b`
const NavButton = tw.button`px-4 hover:bg-gray-200 text-gray-600 transition duration-300`
const Columns = tw.div`flex flex-grow gap-6 p-6 bg-gray-100`
const Column = tw.div``
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

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }))

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

function App() {
  const [state, setState] = useState([getItems(10), getItems(5, 10)])

  // Only load the dragndrop clientside
  const [componentMounted, setComponentMounted] = useState(false)
  useEffect(() => setComponentMounted(true), [])

  function onDragEnd(result) {
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }
    const sInd = +source.droppableId
    const dInd = +destination.droppableId

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index)
      const newState = [...state]
      newState[sInd] = items
      setState(newState)
    } else {
      const result = move(state[sInd], state[dInd], source, destination)
      const newState = [...state]
      newState[sInd] = result[sInd]
      newState[dInd] = result[dInd]

      setState(newState.filter(group => group.length))
    }
  }

  return (
    <>
      <Nav>
        <Logo tw="mx-4" />
        <NavButton
          type="button"
          onClick={() => {
            setState([...state, []])
          }}
        >
          Add new group
        </NavButton>
        <NavButton
          type="button"
          onClick={() => {
            setState([...state, getItems(1)])
          }}
        >
          Add new item
        </NavButton>
      </Nav>
      {componentMounted && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Columns>
            {state.map((el, ind) => (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <Column>
                    <List
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                      {...provided.droppableProps}
                    >
                      {el.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Item
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                            >
                              {item.content}
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

// -------------------------------------------------------------------------

// const App = () => {
//   const onDragEnd = console.log

//   return (
//     <>
//       <Nav>
//         <Logo tw="ml-2" />
//       </Nav>
//       <Columns>
//         <Column>
//           <List>
//             <Item>Foo</Item>
//             <Item>Bar</Item>
//             <Item>Baz</Item>
//           </List>
//         </Column>
//         <Column>
//           <List>
//             <Item>Foo</Item>
//             <Item>Bar</Item>
//             <Item>Baz</Item>
//           </List>
//         </Column>
//       </Columns>
//     </>
//   )
// }

// export default App

//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-around",
//                           }}
//                         >
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const newState = [...state]
//                               newState[ind].splice(index, 1)
//                               setState(
//                                 newState.filter(group => group.length)
//                               )
//                             }}
//                           >
//                             delete
//                           </button>
//                         </div>
