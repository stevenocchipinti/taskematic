import tw, { styled } from "twin.macro"
import { Draggable } from "react-beautiful-dnd"
import { observer } from "mobx-react-lite"
import Progress from "./Progress"

const Item = styled.li`
  ${tw`flex justify-between items-center w-64 text-sm`}
  ${tw`bg-white text-gray-600`}
  ${tw`transition duration-200 hover:bg-gray-100`}
  ${tw`border border-b-0 last:border-b first:rounded-t last:rounded-b`}
  ${({ isDragging }) => isDragging && tw`rounded`}
  ${({ done }) => done && `text-decoration: line-through;`}
  ${({ isSelected }) => isSelected && tw`transform scale-105 rounded border`}
  ${({ hasReducedFocus, isSelected }) =>
    hasReducedFocus && !isSelected && tw`opacity-50`}
`

const Text = tw.span`px-4 py-2`

const DraggableCard = observer(({ node, index, ...props }) => {
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
            node={node}
            onClick={e => {
              // ! Setting done doesn't update the UI correctly
              // ! Missing the strike through and re-order
              if (node.isLeaf) {
                e.stopPropagation()
                node.setDone(!node.done)
              }
            }}
          />
        </Item>
      )}
    </Draggable>
  )
})

export default DraggableCard
