import { forwardRef } from "react"
import tw, { styled } from "twin.macro"
import {
  Menu as ReactMenu,
  MenuItem as ReactMenuItem,
} from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import TrashIcon from "../icons/TrashIcon"
import DotsIcon from "../icons/DotsIcon"
import DescriptionIcon from "../icons/DescriptionIcon"

const StyledButton = styled.button`
  ${tw`m-2 p-2 w-10 h-10 rounded items-center`}
  ${tw`text-gray-400 hover:text-gray-500`}
`

const MenuButton = forwardRef((props, ref) => (
  <StyledButton ref={ref} {...props}>
    <DotsIcon />
  </StyledButton>
))

const MenuItem = tw(ReactMenuItem)`px-4`

const Menu = ({ node }) => {
  return (
    <ReactMenu align="end" menuButton={<MenuButton>Open menu</MenuButton>}>
      <MenuItem onClick={() => node.delete()}>
        <TrashIcon tw="w-4 h-4 mr-2" /> Delete
      </MenuItem>
      {!node.content && (
        <MenuItem onClick={() => node.setContent("A new description")}>
          <DescriptionIcon tw="w-4 h-4 mr-2" /> Add description
        </MenuItem>
      )}
    </ReactMenu>
  )
}

export default Menu
