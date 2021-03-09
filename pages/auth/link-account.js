import firebase from "../../lib/firebase"
import Firebase from "firebase/app"
import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useRouter } from "next/router"
import { useUserStore } from "../../lib/stores"

// Docs: https://firebase.google.com/docs/auth/web/email-link-auth
const LinkAccountsPage = observer(() => {
  const router = useRouter()

  const { user } = useUserStore()

  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    if (user && firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem("emailForSignIn")
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation")
      }

      // Construct the email link credential from the current URL.
      var credential = Firebase.auth.EmailAuthProvider.credentialWithLink(
        email,
        window.location.href
      )

      // Link the credential to the current user.
      user
        .linkWithCredential(credential)
        .then(result => {
          window.localStorage.removeItem("emailForSignIn")
          console.log("Linked!", result)
          router.replace("/")
        })
        .catch(error =>
          console.error("Failed to link anonymous user with email: ", error)
        )
    }
  }, [user])

  return <div>Linking your account with an email address, please wait...</div>
})

export default LinkAccountsPage
