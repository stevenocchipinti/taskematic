import "twin.macro"
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
  BackButton,
} from "./styles"

const DroppableObserver = ({ children, ...props }) => (
  <Droppable {...props}>
    {(...droppableProps) => (
      <Observer>{() => children(...droppableProps)}</Observer>
    )}
  </Droppable>
)

const DroppableColumn = ({ node, children, onClose }) => {
  const ref = useRef(null)

  useEffect(() => ref?.current?.scrollIntoView({ behavior: "smooth" }), [])

  return (
    <DroppableObserver droppableId={node.id}>
      {(provided, snapshot) => (
        <Container ref={ref}>
          <Column panelMode={node.isRoot}>
            {!node.isRoot && (
              <ColumnHeader>
                <EditableTitle
                  value={node.title}
                  onChange={newTitle => node.setTitle(newTitle)}
                />
                <Menu node={node} />
              </ColumnHeader>
            )}

            <ColumnBody panelMode={node.isRoot}>
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

          {!node.isRoot && typeof onClose === "function" && (
            <BackButton tw="sm:hidden" onClick={onClose} />
          )}
        </Container>
      )}
    </DroppableObserver>
  )
}

export default DroppableColumn
