import tw, { styled } from "twin.macro"
import { createGlobalStyle } from "styled-components"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { useProjectStore, useUserStore } from "../lib/stores"
import Logo from "../components/Logo"
import {
  GradientButton,
  SendButton,
  OutlineButton,
} from "../components/Buttons"

const GlobalStyle = createGlobalStyle`
  html {
    background-image: var(--brand-gradient);
  }
`

const Layout = styled.div`
  ${tw`flex flex-col gap-20 justify-around items-center`}
  ${tw`mx-auto mb-8 xl:mt-16 xl:flex-row max-w-screen-xl`}
`

const ActionSection = styled.section`
  ${tw`max-w-xl w-full flex flex-col sm:p-16 p-8 rounded-lg shadow-2xl gap-8`}
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`

const IntroSection = styled.section`
  ${tw`grid gap-4 mt-8 sm:mt-8`}
  grid-template-areas:
    "logo title"
    "subtitle subtitle";

  @media (max-width: 640px) {
    grid-template-areas:
      "logo"
      "title"
      "subtitle";
  }
`

const Title = styled.h1`
  font-size: clamp(3rem, -1rem + 8vw, 5rem);
  grid-area: title;
  place-self: center;
`

const SubTitle = styled.p`
  grid-area: subtitle;
  ${tw`text-xl text-center`}
`

const Input = styled.input`
  ${tw`rounded-lg text-gray-700 p-3`}
  ${tw`opacity-50 focus:opacity-100`}
  ${tw`outline-none shadow transition duration-300`}
  @media (hover: hover) {
    ${tw`hover:opacity-75`}
  }
`

const DividerText = styled.div`
  opacity: 0.65;
  display: flex;
  align-items: center;
  ::before {
    content: "";
    display: block;
    border-top: 1px solid white;
    width: 100%;
    height: 0;
    margin-right: 1rem;
  }
  ::after {
    content: "";
    display: block;
    border-top: 1px solid white;
    width: 100%;
    margin-left: 1rem;
  }
`

const ErrorMessage = styled.div`
  ${tw`text-red-400 bg-gray-800 bg-opacity-75 rounded-xl p-4`}
  max-width: fit-content;
`

const LandingPage = observer(() => {
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [buttonState, setButtonState] = useState("reset")

  const router = useRouter()
  const projectStore = useProjectStore()
  const userStore = useUserStore()
  const { user, ready } = userStore

  const onChange = e => {
    setEmail(e.target.value)
    setErrorMessage("")
  }

  const signInWithEmail = e => {
    e.preventDefault()
    if (!email) return

    setErrorMessage("")
    setButtonState("pending")
    userStore
      .signInWithEmail(email)
      .then(() => {
        setButtonState("sent")
      })
      .catch(error => {
        setButtonState("fail")
        setErrorMessage(error.message)
      })
      // TODO: The timeout could be done in userStore and cancel any current requests?
      .finally(() => setTimeout(() => setButtonState("reset"), 2000))
  }

  const linkAnonymousWithEmail = e => {
    e.preventDefault()
    if (!email) return

    setErrorMessage("")
    setButtonState("pending")
    userStore
      .linkAnonymousWithEmail(email)
      .then(() => {
        setButtonState("sent")
      })
      .catch(error => {
        setButtonState("fail")
        setErrorMessage(error.message)
      })
      // TODO: The timeout could be done in userStore and cancel any current requests?
      .finally(() => setTimeout(() => setButtonState("reset"), 2000))
  }

  const signOut = () => {
    userStore.signOut().catch(error => setErrorMessage(error.message))
  }

  const createNewProject = () => {
    setErrorMessage("")
    projectStore
      .createProject()
      .then(projectId => router.push(`/projects/${projectId}`))
      .catch(error => setErrorMessage(error.message))
  }

  return (
    <main tw="p-4 text-white">
      <GlobalStyle />

      <Layout>
        <IntroSection>
          <Logo height={100} width={100} tw="flex-shrink-0 m-auto" />
          <Title>Taskematic</Title>
          <SubTitle>A hierarchical to-do list</SubTitle>
        </IntroSection>

        <ActionSection>
          <h2 tw="text-4xl">{user ? "Welcome back" : "Welcome"}</h2>

          <div tw="flex flex-col gap-6">
            {!user && <p>It's easy &mdash; no login required!</p>}

            <GradientButton
              disabled={!ready}
              onClick={createNewProject}
              tw="h-24"
            >
              Create project
            </GradientButton>
          </div>

          {!user && (
            <>
              <DividerText tw="text-center">or</DividerText>
              <form onSubmit={signInWithEmail} tw="flex flex-col gap-4">
                <p>
                  Sign up to easily access your projects in the future.
                  <br />
                  No password required!
                </p>
                <Input
                  placeholder="Your email here"
                  onChange={onChange}
                  value={email}
                ></Input>
                <SendButton state={buttonState} disabled={!ready}>
                  Sign in / up
                </SendButton>
              </form>
            </>
          )}

          {user && user?.isAnonymous && (
            <>
              <DividerText tw="text-center">or</DividerText>
              <form onSubmit={linkAnonymousWithEmail} tw="flex flex-col gap-6">
                <p>
                  Add an email address to keep easy access to your projects.
                  <br />
                  No password required!
                </p>
                <Input
                  tw="flex-grow border p-4 mr-8"
                  placeholder="Your email here"
                  onChange={onChange}
                  value={email}
                />
                <SendButton
                  state={buttonState}
                  disabled={!ready}
                  tw="p-4 border"
                >
                  Link an email address
                </SendButton>
              </form>
            </>
          )}

          {user && (
            <>
              <Link href="/projects" passHref>
                <OutlineButton disabled={!ready} as="a">
                  My projects
                </OutlineButton>
              </Link>
              <OutlineButton disabled={!ready} onClick={signOut}>
                🚪 Sign out
              </OutlineButton>
            </>
          )}

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </ActionSection>
      </Layout>
    </main>
  )
})

export default LandingPage
