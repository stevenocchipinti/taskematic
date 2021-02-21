import tw, { styled } from "twin.macro"
import { useEffect } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { when } from "mobx"
import { observer } from "mobx-react-lite"

import Sidebar from "../Sidebar"
import Column from "../Column"
import Item from "../Item"
import { useProject } from "../../lib/ProjectStore"
import { UiStoreProvider, useUiStore } from "../../lib/UiStore"

const Columns = styled.div`
  ${tw`flex flex-grow bg-gray-100 overflow-auto`}
  scroll-snap-type: x mandatory;

  // This is a dodgy hack until I can work out how to get the margin at the end
  &:after {
    content: ".";
    color: transparent;
  }
`

const App = observer(() => {
  const project = useProject("test")
  const ui = useUiStore()

  useEffect(() =>
    when(
      () => project.ready && !ui.cursor,
      () => ui.setCursor(project.root)
    )
  )

  function onDragEnd(result) {
    const { draggableId, source, destination } = result
    return null

    // Dropped outside the list
    if (!destination) return

    const srcNode = tree.root.find(n => n.id === draggableId)
    const dstNode = tree.root.find(n => n.id === destination.droppableId)

    // Reorder within the same droppable
    if (source.droppableId === destination.droppableId) {
      srcNode.setIndex(destination.index)
      setPath(srcNode.path)

      // Move to a different column
    } else {
      const removedNode = srcNode.delete()
      dstNode.addChild(removedNode, destination.index)
      setPath(dstNode.path)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Columns>
        <Sidebar project={project} />
        {project?.ready &&
          ui.cursor?.path.map((node, columnIndex) => (
            <Column key={node.id} node={node}>
              {node.children.map((childNode, childIndex) => {
                const isSelected = ui.cursor.path.includes(childNode)
                return (
                  <Item
                    key={childNode.id}
                    node={childNode}
                    index={childIndex}
                    isSelected={isSelected}
                    hasReducedFocus={!!ui.cursor.path[columnIndex + 1]}
                    onClick={() => ui.setCursor(isSelected ? node : childNode)}
                  />
                )
              })}
            </Column>
          ))}
      </Columns>
    </DragDropContext>
  )
})

const AppWrapper = () => (
  <UiStoreProvider>
    <App />
  </UiStoreProvider>
)

export default AppWrapper
