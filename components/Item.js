import tw, { styled } from "twin.macro"
import { Draggable } from "react-beautiful-dnd"

const Item = styled.li`
  ${tw`w-64 p-4 bg-white text-gray-600 shadow`}
  ${tw`border-b last:border-0 first:rounded-t last:rounded-b`}
  ${tw`transition duration-200 hover:bg-gray-100`}
  ${({ isDragging }) => isDragging && tw`rounded`}
  ${({ done }) => done && `text-decoration: line-through;`}
  ${({ isSelected }) => isSelected && tw`transform scale-105 rounded`}
  ${({ hasReducedFocus, isSelected }) =>
    hasReducedFocus && !isSelected && tw`opacity-50`}
`

const DraggableCard = ({ node, index, ...props }) => {
  return (
    <Draggable key={node.id} draggableId={node.id} index={index}>
      {(provided, snapshot) => (
        <Item
          role="button"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          done={node.done}
          title={node.id}
          {...props}
        >
          {node.title}
        </Item>
      )}
    </Draggable>
  )
}

export default DraggableCard
