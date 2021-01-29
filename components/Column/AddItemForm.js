import { useState } from "react"
import tw, { styled } from "twin.macro"

const PlusIcon = () => (
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
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
)

const Button = styled.button`
  ${tw`w-8 h-8 p-1 m-auto mr-1 absolute right-0 top-0 bottom-0 text-gray-400 hover:text-gray-500`}
  ${({ visible }) => !visible && tw`transition opacity-0 pointer-events-none`}
`

const Input = tw.input`h-10 py-2 pl-4 pr-9 text-sm w-full border rounded`

const AddItemForm = ({ onSubmit, ...props }) => {
  const [focused, setFocused] = useState(false)

  return (
    <div tw="relative flex-grow">
      <form onSubmit={onSubmit}>
        <Input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add new item"
          {...props}
        />
        <Button
          visible={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <PlusIcon />
        </Button>
      </form>
    </div>
  )
}

export default AddItemForm
