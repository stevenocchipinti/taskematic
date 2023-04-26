import tw, { styled } from "twin.macro"
import { keyframes } from "styled-components"
import X from "../icons/X"

const slideIn = keyframes`
  0% { transform: translateX(-30px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`

export const Container = styled.div`
  scroll-snap-align: center;
  scroll-snap-stop: always;
  ${tw`flex flex-col items-end last:pr-3`}
`

export const Column = styled.div`
  ${tw`mx-3 my-6 mb-6`}
  ${tw`bg-white rounded shadow`}
  animation: ${slideIn} 0.2s ease-in-out;
  width: min(22rem, 100vw);
`

export const List = styled.ul`
  ${tw`rounded transition`}
  min-height: 64px;
  ${({ isDraggingOver }) => isDraggingOver && `min-height: 150px;`}
  ${({ isDraggingOver }) => isDraggingOver && tw`shadow-inner bg-gray-100`}
  :empty {
    ${tw`border bg-gray-50 text-gray-400 text-sm`}
    ${tw`flex items-center justify-center`}
    ::after {
      display: block;
      content: "No sub-tasks yet";
    }
  }
`

export const ColumnHeader = tw.div`flex justify-between align-top`

export const ColumnBody = tw.div`pb-2 px-4`

export const ColumnFooter = tw.div`flex p-4 pt-0 gap-2`

const RoundButton = styled.button`
  ${tw`w-8 h-8 p-2 mb-12 mx-4`}
  ${tw`text-gray-400 bg-white shadow rounded-full`}
`
export const BackButton = props => (
  <RoundButton {...props}>
    <X />
  </RoundButton>
)
