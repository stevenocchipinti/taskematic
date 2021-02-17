import { useEffect, useState } from "react"
import firebase from "../lib/firebase"
import App from "../components/App"

const Home = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user", user.uid)
      setUser(user)
    })
  }, [])

  return <App />
}

export default Home
