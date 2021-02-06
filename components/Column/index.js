import tw, { styled } from "twin.macro"
import { keyframes } from "styled-components"
import { useEffect, useRef, useState } from "react"
import { Observer } from "mobx-react-lite"
import { Droppable } from "react-beautiful-dnd"
import Menu from "./Menu"

import AddItemForm from "./AddItemForm"
import EditableTitle from "./EditableTitle"
import EditableContent from "../EditableContent"

const DroppableObserver = ({ children, ...props }) => (
  <Droppable {...props}>
    {(...droppableProps) => (
      <Observer>{() => children(...droppableProps)}</Observer>
    )}
  </Droppable>
)

const slideIn = keyframes`
  0% { transform: translateX(-30px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`

const Container = styled.div`
  scroll-snap-align: center;
  ${tw`last:pr-3`}
`

const Column = styled.div`
  ${tw`mx-3 mt-6`}
  ${tw`bg-white rounded shadow`}
  animation: ${slideIn} 0.2s ease-in-out;
  width: min(22rem, 100vw);
`

const List = styled.ul`
  ${tw`rounded transition`}
  min-height: 64px;
  ${({ isDraggingOver }) => isDraggingOver && `min-height: 150px;`}
  ${({ isDraggingOver }) => isDraggingOver && tw`shadow-inner bg-gray-100`}
  :empty {
    ${tw`border bg-gray-50 text-gray-400 text-sm`}
    ${tw`flex items-center justify-center`}
    ::after {
      display: block;
      content: "No sub-tasks yet";
    }
  }
`

const ColumnHeader = tw.div`flex justify-between align-top`
const ColumnBody = tw.div`pb-2 px-4`
const ColumnFooter = tw.div`flex p-4 pt-0 gap-2`

const DroppableColumn = ({ node, renderChild }) => {
  const ref = useRef(null)
  const addItemInputRef = useRef(null)

  useEffect(() => {
    if (addItemInputRef.current) addItemInputRef.current.focus()
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <DroppableObserver droppableId={node.id}>
      {(provided, snapshot) => (
        <Container ref={ref}>
          <Column>
            <ColumnHeader>
              <EditableTitle
                tw="flex-grow"
                value={node.title}
                onChange={newTitle => node.setTitle(newTitle)}
              />
              <Menu node={node} />
            </ColumnHeader>

            <ColumnBody>
              {node.content && (
                <EditableContent
                  value={node.content}
                  onChange={newContent => node.setContent(newContent)}
                />
              )}
              <List
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
                {...provided.droppableProps}
              >
                {node.children.map((child, index) => renderChild(child, index))}
                {provided.placeholder}
              </List>
            </ColumnBody>

            <ColumnFooter>
              <AddItemForm
                ref={addItemInputRef}
                onSubmit={newTitle => node.createChild({ title: newTitle })}
              />
            </ColumnFooter>
          </Column>
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
