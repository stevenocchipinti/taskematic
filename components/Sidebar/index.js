import tw, { styled } from "twin.macro"
import Logo from "./Logo"
import Progress from "../Progress"
import { observer } from "mobx-react-lite"

const LogoLink = styled.a`
  font-family: "Montserrat", sans-serif;
  ${tw`flex items-start w-full pt-3 px-4`}
  ${tw`opacity-70 hover:opacity-100`}
  ${tw`transition duration-300`}
`

const Title = tw.h1`flex-grow mt-4 ml-4 text-3xl`

const Nav = styled.nav`
  ${tw`flex flex-col items-center flex-shrink-0 mr-3 shadow`}
  ${tw`bg-gray-800 text-gray-200`}
  width: min(22rem, 100vw);
  scroll-snap-align: center;
`

const Sidebar = observer(({ root }) => (
  <Nav>
    <LogoLink href="/">
      <Logo tw="flex-shrink-0" />
      <Title>Taskematic</Title>
    </LogoLink>

    <Progress tw="h-48 w-48 m-12 flex-none" node={root} variant="meter" />
  </Nav>
))

export default Sidebar
