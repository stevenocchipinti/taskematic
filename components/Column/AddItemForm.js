import { forwardRef, useRef, useState, useImperativeHandle } from "react"
import tw, { styled } from "twin.macro"
import PlusIcon from "../icons/PlusIcon"

const Button = styled.button`
  ${tw`w-8 h-8 p-1 m-auto mr-1 absolute right-0 top-0 bottom-0`}
  ${tw`text-gray-400 hover:text-gray-500`}
`

const Input = tw.input`h-10 py-2 pl-4 pr-9 text-sm w-full border rounded`

const AddItemForm = forwardRef(({ onSubmit: userOnSubmit }, ref) => {
  const internalRef = useRef(null)
  useImperativeHandle(ref, () => internalRef.current, [])

  const [newItem, setNewItem] = useState("")

  const onSubmit = e => {
    e.preventDefault()
    newItem && userOnSubmit(newItem)
    setNewItem("")
    internalRef?.current?.focus()
  }

  return (
    <div tw="relative flex-grow">
      <form onSubmit={onSubmit}>
        <Input
          placeholder="Add new item"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          ref={internalRef}
        />
        <Button aria-label="Add new item">
          <PlusIcon />
        </Button>
      </form>
    </div>
  )
})

export default AddItemForm
