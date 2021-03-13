import "twin.macro"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { observer } from "mobx-react-lite"
import { useProjectStore, useUserStore } from "../lib/stores"

const LandingPage = observer(() => {
  const [email, setEmail] = useState("")

  const router = useRouter()

  const projectStore = useProjectStore()
  const userStore = useUserStore()
  const { user } = userStore

  const userState = !userStore.ready
    ? "Loading..."
    : user
    ? `Logged in as ${user.uid} ${user.isAnonymous ? "(anon)" : ""}`
    : "Logged out"

  const signInWithEmail = e => {
    e.preventDefault()
    if (email) userStore.signInWithEmail(email)
  }

  const linkAnonymousWithEmail = e => {
    e.preventDefault()
    if (email) userStore.linkAnonymousWithEmail(email)
  }

  const createNewProject = () => {
    projectStore
      .createProject()
      .then(projectId => router.push(`/project/${projectId}`))
      .catch(e => console.error("nope", e))
  }

  return (
    <main tw="p-4 text-center">
      <h1 tw="text-6xl">Taskematic</h1>
      <p tw="my-4">
        A hierarchical to do list - v{process.env.NEXT_PUBLIC_SHA}
      </p>
      <p tw="my-4">{userState}</p>

      {userStore.ready && (
        <div tw="my-24 mx-auto flex flex-col justify-center gap-8 max-w-xl text-lg">
          <Link href="/project/taskematic" passHref>
            <a tw="p-4 border">🐶 Go to the Taskematic project</a>
          </Link>

          {!user && (
            <button
              tw="p-4 border"
              onClick={() => userStore.signInAnonymously()}
            >
              🎭 Sign in anonymously
            </button>
          )}

          {user?.isAnonymous && (
            <form onSubmit={linkAnonymousWithEmail} tw="flex">
              <input
                tw="flex-grow border p-4 mr-8"
                placeholder="Email address"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
              <button tw="p-4 border">🔗 Link email</button>
            </form>
          )}

          {!user && (
            <form onSubmit={signInWithEmail} tw="flex">
              <input
                tw="flex-grow border p-4 mr-8"
                placeholder="Email address"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
              <button tw="p-4 border">👨‍💻 Sign in</button>
            </form>
          )}

          {user && (
            <button tw="p-4 border" onClick={createNewProject}>
              🆕 Start a project
            </button>
          )}

          {user && (
            <button tw="p-4 border" onClick={() => userStore.signOut()}>
              🚪 Sign out
            </button>
          )}
        </div>
      )}
    </main>
  )
})

export default LandingPage
