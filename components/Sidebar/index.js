import tw, { styled } from "twin.macro"
import { observer } from "mobx-react-lite"
import Link from "next/link"

import UserIcon from "../icons/UserIcon"
import Logo from "../Logo"
import Progress from "../Progress"

const StyledLink = styled.a`
  ${tw`opacity-70 hover:opacity-100 transition duration-300`}
`

const LogoLink = ({ children, ...props }) => (
  <Link passHref {...props}>
    <StyledLink>{children}</StyledLink>
  </Link>
)

const Title = tw.h1`mt-12 text-3xl text-center`

const Nav = styled.nav`
  ${tw`flex flex-col items-center flex-shrink-0 shadow`}
  ${tw`text-gray-200`}
  width: min(22rem, 100vw);
  scroll-snap-align: center;
  background: linear-gradient(45deg, #192c4e, #111b2b);
`

const NavHeader = tw.div`self-stretch mt-2 px-4 flex items-center justify-between`

const Taskematic = styled.h2`
  letter-spacing: 0.25rem;
  ${tw`font-light mt-1`}
`

const Sidebar = observer(({ project }) => (
  <Nav>
    <NavHeader>
      <LogoLink href="/projects">
        <Logo tw="flex-shrink-0 w-12 h-12" />
      </LogoLink>
      <LogoLink href="/projects">
        <Taskematic>Taskematic</Taskematic>
      </LogoLink>
      <LogoLink href="/">
        <UserIcon tw="w-8 h-8 my-2 ml-4" />
      </LogoLink>
    </NavHeader>

    <Title tw="opacity-70">{project?.title}</Title>

    <Progress
      tw="h-48 w-48 m-12 flex-none"
      node={project?.root}
      variant="meter"
      loading={!project?.ready}
    />
  </Nav>
))

export default Sidebar
