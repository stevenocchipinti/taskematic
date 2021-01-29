import { useEffect, useRef, useState } from "react"
import { Observer } from "mobx-react-lite"
import { Droppable } from "react-beautiful-dnd"
import tw, { styled } from "twin.macro"
import AddItemForm from "./AddItemForm"
import EditableTitle from "./EditableTitle"

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

const Column = styled.div`
  ${tw`w-72 bg-white rounded p-4 shadow`}
`

const Content = tw.p`text-sm text-gray-600 mb-4`

const List = styled.ul`
  ${tw`rounded transition`}
  min-height: 64px;
  ${({ isDraggingOver }) => isDraggingOver && `min-height: 150px;`}
  ${({ isDraggingOver }) => isDraggingOver && tw`shadow-inner bg-gray-300`}
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

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const DeleteButton = styled.button`
  ${tw`w-10 h-10 border rounded p-2 items-center`}
  ${tw`text-gray-400 hover:text-gray-500`}
`

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
            {node.content && <Content>{node.content}</Content>}
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
              <DeleteButton onClick={() => node.delete()}>
                <TrashIcon />
              </DeleteButton>
            </Actions>
          </Column>
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
