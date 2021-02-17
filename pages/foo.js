import "twin.macro"
import { createContext, useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ProjectStore } from "../lib/ProjectStore"

const ProjectContext = createContext()

const ListItem = observer(({ item }) => {
  console.log("render", item.title)
  return (
    <div tw="border m-1 p-2">
      {item.title}
      {item.children.map(
        child => child && <ListItem key={child.id} item={child} />
      )}
    </div>
  )
})

const List = observer(() => {
  console.log("List")
  const project = useContext(ProjectContext)
  if (!project) return <h1>Loading...</h1>
  return (
    <main tw="m-4 p-4">
      <h1>{project.name}</h1>
      {project.root && <ListItem item={project.root} />}
      <button
        tw="my-4 p-4 rounded text-center bg-blue-500 text-white"
        onClick={() => {
          project.addTask()
        }}
      >
        Add a new node
      </button>
    </main>
  )
})

const Page = () => {
  // This is so the store is only created client-side
  const [projectStore, setProjectStore] = useState(null)
  useEffect(() => setProjectStore(new ProjectStore()), [])

  return (
    <ProjectContext.Provider value={projectStore}>
      <List />
    </ProjectContext.Provider>
  )
}

export default Page
