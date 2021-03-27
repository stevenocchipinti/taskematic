import tw, { styled } from "twin.macro"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import Link from "next/link"
import { useProjectStore } from "../../lib/stores"
import { OutlineButton } from "../../components/Buttons"

const Layout = tw.main`max-w-screen-xl w-full px-16 py-8 mx-auto flex flex-col gap-8`
const Home = tw.a`text-4xl font-bold text-center`
const Heading = tw.h2`text-3xl font-bold`

const Container = tw.div`flex gap-4`

const Tile = styled(OutlineButton)`
  ${tw`h-32 w-64 flex justify-center items-center transition transform hover:scale-105`}
`

const ProjectsPage = observer(() => {
  const projectStore = useProjectStore()

  useEffect(() => projectStore.subscribeToProjects(), [projectStore])

  return (
    <Layout>
      <Link href={"/"} passHref>
        <Home>Taskematic</Home>
      </Link>
      <Heading>My projects:</Heading>

      {!projectStore.ready ? (
        <span>loading...</span>
      ) : (
        <Container>
          {projectStore.projects?.length > 0
            ? projectStore.projects.map(slug => (
                <Link key={slug} href={`/projects/${slug}`} passHref>
                  <Tile as="a">{slug}</Tile>
                </Link>
              ))
            : "No projects"}
        </Container>
      )}
    </Layout>
  )
})

export default ProjectsPage
