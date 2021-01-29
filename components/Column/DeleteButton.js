import tw, { styled } from "twin.macro"

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const StyledButton = styled.button`
  ${tw`w-10 h-10 border rounded p-2 items-center`}
  ${tw`text-gray-400 hover:text-gray-500`}
`

const DeleteButton = props => (
  <StyledButton {...props}>
    <TrashIcon />
  </StyledButton>
)

export default DeleteButton
