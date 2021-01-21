import { GlobalStyles } from "twin.macro"
import tw from "twin.macro"
import "typeface-montserrat"

const Container = tw.div`flex flex-col min-h-screen text-gray-700`

const App = ({ Component, pageProps }) => (
  <Container>
    <GlobalStyles />
    <Component {...pageProps} />
  </Container>
)

export default App
