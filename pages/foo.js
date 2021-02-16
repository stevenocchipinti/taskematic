import "twin.macro"
import { createContext, useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ProjectStore } from "../lib/Tree"

const ProjectContext = createContext()

const Node = observer(({ node }) => {
  console.log("render", node.title)
  return (
    <div tw="border rounded p-4">
      <h2>{node.title}</h2>
      <ul>
        {node.children.map(c => (
          <Node key={c.id} node={c} />
        ))}
      </ul>
    </div>
  )
})

const Project = observer(() => {
  const project = useContext(ProjectContext)

  if (!project || project.isLoading) return <h1>Loading...</h1>
  return (
    <main tw="m-4 p-4">
      <h1>{project.name}</h1>
      <Node node={project.root} />

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

const ListItem = observer(({ item }) => {
  console.log("render", item.id)
  return <li tw="border m-1 p-2">{JSON.stringify(item.asJS, null, 2)}</li>
})

const List = observer(() => {
  const project = useContext(ProjectContext)
  if (!project) return <h1>Loading...</h1>
  return (
    <main tw="m-4 p-4">
      <h1>{project.name}</h1>
      <ul>
        {Object.keys(project.tree).map(id => (
          <ListItem key={id} item={project.tree[id]} />
        ))}
        <li></li>
      </ul>
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
