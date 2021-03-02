import { GlobalStyles } from "twin.macro"
import tw from "twin.macro"
import "typeface-montserrat"
import { UserStoreProvider } from "../lib/UserStore"

const Container = tw.div`flex flex-col min-h-screen text-gray-700`

const App = ({ Component, pageProps }) => (
  <UserStoreProvider>
    <Container>
      <GlobalStyles />
      <Component {...pageProps} />
    </Container>
  </UserStoreProvider>
)

export default App
