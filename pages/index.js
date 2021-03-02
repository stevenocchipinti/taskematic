import { useEffect, useState } from "react"
import firebase from "../lib/firebase"
import App from "../components/App"
import { UiStoreProvider } from "../lib/UiStore"

const Home = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log("Determining auth state")
    firebase.auth().onAuthStateChanged(user => {
      console.log("user", user.uid)
      setUser(user)
    })
  }, [])

  return (
    <UiStoreProvider>
      <App />
    </UiStoreProvider>
  )
}

export default Home
