import tw, { styled, GlobalStyles } from "twin.macro"
import { createGlobalStyle } from "styled-components"
import "typeface-montserrat"
import { RootStoreProvider } from "../lib/stores"

const Container = styled.div`
  ${tw`flex flex-col min-h-screen text-gray-700`}
`

const Theme = createGlobalStyle`
  html {
    font-family: "Montserrat", sans-serif;
    ${tw`bg-gray-100`}
    --brand-gradient: linear-gradient(
        to right top,
        #051937,
        #004d7a,
        #008793,
        #00bf72,
        #a8eb12
      );
  }
`

const App = ({ Component, pageProps }) => (
  <RootStoreProvider>
    <Container>
      <GlobalStyles />
      <Theme />
      <Component {...pageProps} />
    </Container>
  </RootStoreProvider>
)

export default App
