import { autorun, makeAutoObservable, runInAction } from "mobx"
import firebase from "../firebase"

class UserStore {
  rootStore
  // The user object starts off in an unknown state, so 3 states are required:
  //   undefined = logged in state unknown
  //   null = not logged in
  //   object = logged in
  user = undefined
  // May use an old cached user until this is true
  ready = false

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    if (typeof window === "object")
      this.user = window.localStorage.getItem("lastLoggedInUser") || undefined

    firebase.auth().onAuthStateChanged(user => {
      runInAction(() => {
        this.user = user
        this.ready = true
      })

      if (typeof window === "object") {
        if (user) {
          window.localStorage.setItem("lastLoggedInUser", JSON.stringify(user))
        } else {
          window.localStorage.removeItem("lastLoggedInUser")
        }
      }
    })
  }

  signInAnonymously() {
    return firebase
      .auth()
      .signInAnonymously()
      .then(() => console.log("Signed in anonymously"))
      .catch(error => {
        console.error("Failed to sign in anonymously", error)
        throw error
      })
  }

  signInWithEmail(email) {
    // This method sends an email to verify the user.
    // The rest of the sign in process happens at the URL below.
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: `${process.env.NEXT_PUBLIC_URL}/auth/sign-in`,
        handleCodeInApp: true,
      })
      .then(() => {
        console.log("Successfully sent email link: ", email)
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email)
      })
      .catch(error => {
        console.error("Failed to send email link: ", error)
        throw error
      })
  }

  linkAnonymousWithEmail(email) {
    // This method sends an email to verify the user.
    // The rest of the sign in process happens at the URL below.
    return firebase
      .auth()
      .sendSignInLinkToEmail(email, {
        url: `${process.env.NEXT_PUBLIC_URL}/auth/link-account`,
        handleCodeInApp: true,
      })
      .then(() => {
        console.log("Successfully sent email link: ", email)
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email)
      })
      .catch(error => {
        console.error("Failed to send email link: ", error)
        throw error
      })
  }

  signOut() {
    return firebase
      .auth()
      .signOut()
      .then(() => console.log("Sign out"))
      .catch(error => {
        console.error("Failed to sign out: ", error)
        throw error
      })
  }
}

export default UserStore
