import tw, { styled } from "twin.macro"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Link from "next/link"
import { useRouter } from "next/router"
import Skeleton from "react-loading-skeleton"
import Logo from "../../components/Logo"
import PlusIcon from "../../components/icons/PlusIcon"
import { useProjectStore } from "../../lib/stores"
import { LoaderButton } from "../../components/Buttons"

const Nav = styled.nav`
  ${tw`flex justify-center h-16 shadow-lg`}
  background-image: var(--brand-gradient);
`
const HomeLink = styled.a`
  ${tw`h-full inline-flex items-center pr-4`}
  ${tw`text-white text-2xl transform transition hover:scale-105`}
`

const Main = tw.main`max-w-screen-xl w-full p-8 mx-auto flex flex-col gap-8`

const Container = styled.div`
  ${tw`grid auto-cols-min gap-4`}
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
`

const Tile = styled.button`
  ${tw`h-32 w-full p-4 bg-white border rounded-2xl shadow-sm`}
  ${tw`flex text-lg text-gray-500 hover:text-gray-600`}
  ${tw`capitalize transition transform hover:scale-105`}
`
const PlaceholderTile = tw.span`h-32 w-full p-4 flex bg-white border rounded-2xl`

const NewProjectTile = tw(Tile)`
  flex-col justify-evenly items-center shadow-inner bg-gray-200
`

const ProjectsPage = observer(() => {
  const router = useRouter()
  const projectStore = useProjectStore()

  const [loading, setLoading] = useState(false)

  useEffect(() => projectStore.subscribeToProjects(), [projectStore])

  const createNewProject = () => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 10000)
    projectStore
      .createProject()
      .then(projectId => {
        clearTimeout(timeout)
        router.push(`/projects/${projectId}`)
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }

  return (
    <>
      <Nav>
        <div tw="flex-1 hidden sm:block" />
        <Link href="/" passHref>
          <HomeLink>
            <Logo tw="h-10" />
            Taskematic
          </HomeLink>
        </Link>
        <div tw="flex flex-1 flex-row-reverse">
          <LoaderButton
            onClick={createNewProject}
            loading={loading}
            tw="my-2 ml-0 mr-3 p-0 px-4"
          >
            Create project
          </LoaderButton>
        </div>
      </Nav>

      <Main>
        <h2 tw="text-2xl text-gray-500">Projects</h2>
        <Container>
          <NewProjectTile onClick={createNewProject}>
            <PlusIcon tw="h-8" />
            Create new project
          </NewProjectTile>
          {!projectStore.ready ? (
            <PlaceholderTile>
              <Skeleton width={200} height={20} />
            </PlaceholderTile>
          ) : (
            projectStore.projects?.map(slug => (
              <Link key={slug} href={`/projects/${slug}`} passHref>
                <Tile as="a">{slug}</Tile>
              </Link>
            ))
          )}
        </Container>
      </Main>
    </>
  )
})

export default ProjectsPage
