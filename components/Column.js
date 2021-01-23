import tw, { styled } from "twin.macro"
import { Droppable } from "react-beautiful-dnd"

const Container = styled.div`
  scroll-snap-align: center;
  max-width: 18rem;
`

const Column = styled.div`
  ${tw`bg-white rounded p-4 shadow`}
`

const Title = tw.h1`text-lg text-gray-600 font-semibold mb-4`

const List = styled.ul`
  ${tw`w-64 transition`}
  min-height: 150px;
  ${({ isDraggingOver }) => isDraggingOver && tw`shadow-inner bg-gray-300`}
  :empty {
    ${tw`border rounded bg-gray-50 text-gray-400 text-sm`}
    ${tw`flex items-center justify-center`}
    ::after {
      display: block;
      content: "No sub-tasks yet";
    }
  }
`

const DroppableColumn = ({ node, renderChild }) => {
  return (
    <Droppable droppableId={node.id}>
      {(provided, snapshot) => (
        <Container>
          <Column>
            <Title>{node.title}</Title>
            <List
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {node.children.map((child, index) => renderChild(child, index))}
              {provided.placeholder}
            </List>
          </Column>
        </Container>
      )}
    </Droppable>
  )
}

export default DroppableColumn