import "twin.macro"
import Link from "next/link"

const LandingPage = () => (
  <main tw="p-4 text-center">
    <h1 tw="text-6xl">Taskematic</h1>
    <p tw="my-4">A hierarchical to do list</p>
    <div tw="my-24 mx-auto flex flex-col justify-center gap-8 max-w-xl">
      <Link href="/project/taskematic" passHref>
        <a tw="p-4 border">🐶 Go to the Taskematic project</a>
      </Link>
      <Link href="/new-project" passHref>
        <a tw="p-4 border">🆕 Create a new project</a>
      </Link>
    </div>
  </main>
)

export default LandingPage
