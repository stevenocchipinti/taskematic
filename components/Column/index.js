import { useEffect, useRef } from "react"
import { Observer } from "mobx-react-lite"
import { Droppable } from "react-beautiful-dnd"

import EditableContent from "../EditableContent"
import Menu from "./Menu"
import AddItemForm from "./AddItemForm"
import EditableTitle from "./EditableTitle"
import {
  Container,
  Column,
  ColumnHeader,
  ColumnBody,
  ColumnFooter,
  List,
} from "./styles"

const DroppableObserver = ({ children, ...props }) => (
  <Droppable {...props}>
    {(...droppableProps) => (
      <Observer>{() => children(...droppableProps)}</Observer>
    )}
  </Droppable>
)

const DroppableColumn = ({ node, children }) => {
  const ref = useRef(null)

  useEffect(() => ref?.current?.scrollIntoView({ behavior: "smooth" }), [])

  return (
    <DroppableObserver droppableId={node.id}>
      {(provided, snapshot) => (
        <Container ref={ref}>
          <Column>
            <ColumnHeader>
              <EditableTitle
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
                {children}
                {provided.placeholder}
              </List>
            </ColumnBody>

            <ColumnFooter>
              <AddItemForm
                onSubmit={newTitle => node.createChildNode({ title: newTitle })}
              />
            </ColumnFooter>
          </Column>
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
