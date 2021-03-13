import firebase from "../../lib/firebase"
import { useEffect } from "react"
import { useRouter } from "next/router"

const SignInPage = () => {
  const router = useRouter()

  // Docs: https://firebase.google.com/docs/auth/web/email-link-auth
  useEffect(() => {
    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
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
      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn")
          console.log("Signed in!", result)
          router.replace("/")
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(error => console.error("Failed to complete sign in: ", error))
    }
  }, [])

  return <div>Signing in, please wait...</div>
}

export default SignInPage
