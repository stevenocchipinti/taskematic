import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import tw, { styled } from "twin.macro"
import { DragDropContext } from "react-beautiful-dnd"
import { when } from "mobx"
import { observer } from "mobx-react-lite"

import Sidebar from "../../components/Sidebar"
import Column from "../../components/Column"
import PlaceholderColumn from "../../components/Column/PlaceholderColumn"
import Item from "../../components/Item"

import { useUiStore, useProjectStore } from "../../lib/stores"

const Columns = styled.div`
  ${tw`flex flex-grow overflow-auto`}
  scroll-snap-type: x mandatory;

  // This is a dodgy hack until I can work out how to get the margin at the end
  &:after {
    content: ".";
    color: transparent;
  }
`

const App = observer(() => {
  const router = useRouter()
  const projectId = router.query.pid

  const projectStore = useProjectStore()
  const ui = useUiStore()
  const [project, setProject] = useState(null)

  useEffect(() => {
    const project = projectStore.getProject(projectId)
    setProject(project)
    return () => project.disconnect()
  }, [projectStore, projectId])

  useEffect(
    () =>
      when(
        () => project?.ready && !ui.cursor,
        () => ui.setCursor(project.root)
      ),
    [project, ui]
  )

  function onDragEnd(result) {
    const { draggableId, source, destination } = result

    // Dropped outside the list
    if (!destination) return

    const srcNodeId = draggableId
    const dstNodeId = destination.droppableId

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same droppable
      project.moveNode(srcNodeId, destination.index)
    } else {
      // Move to a different column
      project.moveNode(srcNodeId, destination.index, dstNodeId)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Columns>
        <Sidebar project={project} />
        {project?.ready ? (
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
          ))
        ) : (
          <PlaceholderColumn />
        )}
      </Columns>
    </DragDropContext>
  )
})

export default App
