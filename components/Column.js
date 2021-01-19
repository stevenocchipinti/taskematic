import tw, { styled } from "twin.macro"
import { Droppable } from "react-beautiful-dnd"

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

const DroppableColumn = ({ node, renderChild }) => {
  return (
    <Droppable droppableId={node.id}>
      {(provided, snapshot) => (
        <Column>
          <List
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            {...provided.droppableProps}
          >
            {node.children.map((child, index) => renderChild(child, index))}
            {provided.placeholder}
          </List>
        </Column>
      )}
    </Droppable>
  )
}

export default DroppableColumn
