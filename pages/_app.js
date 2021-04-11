import tw, { styled } from "twin.macro"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import "typeface-montserrat"
import { RootStoreProvider } from "../lib/stores"

const theme = extendTheme({
  colors: {
    brandGradient: `linear-gradient(
          to right top,
          #051937,
          #004d7a,
          #008793,
          #00bf72,
          #a8eb12
        )`,
  },
  fonts: {
    heading: "Montserrat, sans-serif",
    body: "Montserrat, sans-serif",
  },
  styles: {
    global: ({ colorMode }) => ({
      "html, body": {
        height: "100%",
        backgroundColor: colorMode === "dark" ? "gray.500" : "gray.50",
      },
    }),
  },
})

const App = ({ Component, pageProps }) => (
  <RootStoreProvider>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </RootStoreProvider>
)

export default App
