import tw, { styled } from "twin.macro"
import { keyframes } from "styled-components"
import { useEffect, useRef, useState } from "react"
import { Observer } from "mobx-react-lite"
import { Droppable } from "react-beautiful-dnd"

import DeleteButton from "./DeleteButton"
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

const Container = styled.div`
  scroll-snap-align: center;
  max-width: 18rem;
`

const slideIn = keyframes`
  0% { transform: translateX(-30px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`

const Column = styled.div`
  ${tw`w-72 bg-white rounded p-4 shadow`}
  animation: ${slideIn} 0.2s ease-in-out;
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

const Actions = tw.div`flex mt-2 gap-2`

const DroppableColumn = ({ node, renderChild }) => {
  const [newItemTitle, setNewItemTitle] = useState("")

  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollIntoView({ behavior: "smooth" })
  }, [])

  const onSubmit = e => {
    e.preventDefault()
    node.createChild({ title: newItemTitle })
    setNewItemTitle("")
  }

  return (
    <DroppableObserver droppableId={node.id}>
      {(provided, snapshot) => (
        <Container>
          <Column ref={ref}>
            <EditableTitle
              value={node.title}
              onChange={newTitle => node.setTitle(newTitle)}
            />

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
            <Actions>
              <AddItemForm
                onSubmit={onSubmit}
                value={newItemTitle}
                onChange={e => setNewItemTitle(e.target.value)}
              />
              <DeleteButton onClick={() => node.delete()} />
            </Actions>
          </Column>
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
