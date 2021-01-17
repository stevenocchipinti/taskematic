import { GlobalStyles } from "twin.macro"
import tw from "twin.macro"
import "typeface-montserrat"

const Container = tw.div`flex flex-col min-h-screen`

const App = ({ Component, pageProps }) => (
  <Container>
    <GlobalStyles />
    <Component {...pageProps} />
  </Container>
)

export default App
