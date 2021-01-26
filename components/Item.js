import tw, { styled } from "twin.macro"
import { Draggable } from "react-beautiful-dnd"
import Progress from "./Progress"

const Item = styled.li`
  ${tw`flex justify-between w-64 text-sm`}
  ${tw`bg-white text-gray-600`}
  ${tw`transition duration-200 hover:bg-gray-100`}
  ${tw`border border-b-0 last:border-b first:rounded-t last:rounded-b`}
  ${({ isDragging }) => isDragging && tw`rounded`}
  ${({ done }) => done && `text-decoration: line-through;`}
  ${({ isSelected }) => isSelected && tw`transform scale-105 rounded border`}
  ${({ hasReducedFocus, isSelected }) =>
    hasReducedFocus && !isSelected && tw`opacity-50`}
`

const Text = tw.span`p-4`

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
          done={node.done || node.progress === 1}
          title={node.id}
          {...props}
        >
          <Text>{node.title}</Text>
          <Progress
            tw="h-10 w-10 m-2 flex-none"
            percentage={node.progress}
            showBoolean={node.isLeaf}
          />
        </Item>
      )}
    </Draggable>
  )
}

export default DraggableCard
