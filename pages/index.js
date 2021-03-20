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

const GradientButton = styled.button`
  background-image: linear-gradient(
    45deg,
    #e96443 0%,
    #904e95 51%,
    #e96443 100%
  );
  padding: 1rem 3rem;
  text-align: center;
  text-transform: uppercase;
  background-size: 200% auto;
  ${tw`shadow rounded-lg`}

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow 0.2s, background-position 0.5s;
  }

  :focus {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
    outline: none;
  }

  :hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300`}
    background-position: left center;
  }
`

const OutlineButton = styled.button`
  ${tw`p-4 rounded-lg border text-center`}

  @media (prefers-reduced-motion: no-preference) {
    transition: box-shadow 0.2s, background-color 0.3s;
  }

  :focus {
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
    outline: none;
  }

  :hover {
    background-color: #fff2;
  }

  :disabled {
    ${tw`opacity-75 text-gray-300 bg-transparent`}
  }
`

const Input = styled.input`
  ${tw`rounded-lg text-gray-700 p-3`}
  ${tw`opacity-50 hover:opacity-75 focus:opacity-100`}
  ${tw`outline-none shadow transition duration-300`}
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

const LandingPage = observer(() => {
  const [email, setEmail] = useState("")
  const router = useRouter()
  const projectStore = useProjectStore()
  const userStore = useUserStore()
  const { user, ready } = userStore

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
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                ></Input>
                <GradientButton disabled={!ready}>Sign in / up</GradientButton>
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
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
                <GradientButton disabled={!ready} tw="p-4 border">
                  Link an email address
                </GradientButton>
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
              <OutlineButton
                disabled={!ready}
                onClick={() => userStore.signOut()}
              >
                🚪 Sign out
              </OutlineButton>
            </>
          )}
        </ActionSection>
      </Layout>
    </main>
  )
})

export default LandingPage
