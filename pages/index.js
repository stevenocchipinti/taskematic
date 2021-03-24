import tw, { styled } from "twin.macro"
import { createGlobalStyle } from "styled-components"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { observer } from "mobx-react-lite"
import { useProjectStore, useUserStore } from "../lib/stores"
import Logo from "../components/Logo"

const GlobalStyle = createGlobalStyle`
  html {
    background-image: linear-gradient(
      to right top,
      #051937,
      #004d7a,
      #008793,
      #00bf72,
      #a8eb12
    );
  }
`

const Layout = styled.div`
  ${tw`flex flex-col gap-20 justify-around items-center`}
  ${tw`mx-auto mb-8 xl:mt-16 xl:flex-row max-w-screen-xl`}
  font-family: "Montserrat", sans-serif;
`

const ActionSection = styled.section`
  ${tw`flex flex-col sm:p-16 p-8 rounded-lg shadow-2xl gap-8`}
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`

const IntroSection = styled.section`
  ${tw`grid gap-4 mt-16 sm:mt-8`}
  font-family: "Montserrat", sans-serif;
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

const Button = styled.button`
  ${tw`rounded-lg text-center`}

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow 0.2s;
  }

  :focus {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
    outline: none;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300`}
  }
`

const GradientButton = styled(Button)`
  background-image: linear-gradient(
    45deg,
    #e96443 0%,
    #904e95 51%,
    #e96443 100%
  );
  padding: 1rem 3rem;
  text-transform: uppercase;
  background-size: 200% auto;
  ${tw`shadow`}

  @media (prefers-reduced-motion: no-preference) {
    transition: background-position 0.5s;
  }

  :hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  :disabled {
    background-position: left center;
  }
`

const OutlineButton = styled.button`
  ${tw`p-4 rounded-lg border text-center`}

  @media (prefers-reduced-motion: no-preference) {
    transition: background-color 0.3s;
  }

  :hover {
    background-color: #fff2;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300 bg-transparent`}
  }
`

const AirplaneSvg = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12L13 12M5 12L3 21L21 12L3 3L5 12Z"
    />
  </svg>
)

const Airplane = styled(AirplaneSvg)`
  ${tw`h-6 w-6 absolute left-4 top-0 bottom-0 my-auto transform -rotate-90`}
  transition: all 0.7s ease-in;
  transform-origin: 0 50px;

  ${({ $state }) =>
    $state === "pending" && tw`rotate-0 animate-pulse duration-300`}

  ${({ $state }) =>
    $state === "sent" && "transform: rotate(0) translateX(400px);"}

  ${({ $state }) => $state === "fail" && tw`rotate-180`}

  ${({ $state }) => $state === "reset" && tw`transition-none`}
`

const SendButton = ({ state, children }) => (
  <GradientButton disabled={state !== "reset"} tw="relative overflow-hidden">
    <Airplane $state={state} />
    {state === "reset" && children}
    {state === "pending" && "Sending email..."}
    {state === "fail" && "Failed"}
    {state === "sent" && "Sent!"}
  </GradientButton>
)

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
      .then(projectId => router.push(`/project/${projectId}`))
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

        <ActionSection tw="max-w-3xl">
          <h2 tw="text-4xl">Welcome</h2>

          <div tw="flex flex-col gap-6">
            {user ? (
              <p>Good to see you again, create a new project here.</p>
            ) : (
              <p>It's easy &mdash; no login required!</p>
            )}

            <GradientButton
              disabled={!ready}
              onClick={createNewProject}
              tw="h-24"
            >
              Get started
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
                <SendButton state={state} disabled={!ready} tw="p-4 border">
                  Link an email address
                </SendButton>
              </form>
            </>
          )}

          {user && (
            <>
              <Link href="/project/taskematic" passHref>
                <OutlineButton disabled={!ready} as="a">
                  🐶 Dog food
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
