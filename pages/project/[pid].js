import { useRouter } from "next/router"
import { UiStoreProvider } from "../../lib/UiStore"
import App from "../../components/App"

const Project = () => {
  const router = useRouter()
  const { pid } = router.query

  return (
    <UiStoreProvider>
      <App projectId={pid} />
    </UiStoreProvider>
  )
}

export default Project
