import { createGlobalStyle } from "styled-components"
import { useTheme } from "@chakra-ui/react"

const HtmlBackground = createGlobalStyle`
  html {
    background: ${({ color }) => color} !important;
  }
  body { background-color: transparent !important;}
`

const GradientBackground = () => {
  const theme = useTheme()
  return <HtmlBackground color={theme.colors.brandGradient} />
}

export default GradientBackground
