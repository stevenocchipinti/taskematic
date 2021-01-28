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
  ${tw`w-8 h-8 p-1 m-auto mr-1 absolute right-0 top-0 bottom-0 text-gray-400`}
  ${({ visible }) => !visible && tw`transition opacity-0 pointer-events-none`}
`

const AddItemForm = ({ onSubmit, ...props }) => {
  const [focused, setFocused] = useState(false)

  return (
    <form onSubmit={onSubmit}>
      <div tw="mt-2 relative">
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Add new item"
          tw="h-10 py-2 pl-4 pr-9 text-sm w-full border rounded"
          {...props}
        />
        <Button
          visible={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <PlusIcon />
        </Button>
      </div>
    </form>
  )
}

export default AddItemForm
