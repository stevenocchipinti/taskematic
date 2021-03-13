import { GlobalStyles } from "twin.macro"
import tw from "twin.macro"
import "typeface-montserrat"
import { RootStoreProvider } from "../lib/stores"

const Container = tw.div`flex flex-col min-h-screen text-gray-700`

const App = ({ Component, pageProps }) => (
  <RootStoreProvider>
    <Container>
      <GlobalStyles />
      <Component {...pageProps} />
    </Container>
  </RootStoreProvider>
)

export default App
