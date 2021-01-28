import { useEffect, useRef, useState } from "react"
import tw, { styled } from "twin.macro"
import { Observer } from "mobx-react-lite"
import { Droppable } from "react-beautiful-dnd"
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
            <AddItemForm
              onSubmit={onSubmit}
              value={newItemTitle}
              onChange={e => setNewItemTitle(e.target.value)}
            />
          </Column>
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
