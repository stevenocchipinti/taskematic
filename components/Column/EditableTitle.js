import { useEffect, useRef, useState } from "react"
import tw, { styled } from "twin.macro"

const Title = styled.h2`
  ${tw`text-lg text-gray-600 font-semibold align-top`}
  ${tw`m-2 p-2 pb-1 pr-0 mr-0`}
`
const TitleInput = styled.input`
  ${tw`w-full text-lg text-gray-600 font-semibold`}
  ${tw`m-2 p-2 pb-1 pr-0 mr-0`}
`

const EditableTitle = ({ onChange, value, ...props }) => {
  const [editable, setEditable] = useState(false)
  const [newTitle, setNewTitle] = useState(value)

  const inputRef = useRef(null)
  useEffect(() => {
    if (editable && inputRef.current) inputRef.current.focus()
  }, [editable])

  const onSubmit = e => {
    e.preventDefault()
    onChange(newTitle)
    setEditable(false)
  }

  const onBlur = e => {
    onChange(newTitle)
    setEditable(false)
  }

  return editable ? (
    <form onSubmit={onSubmit} {...props}>
      <TitleInput
        ref={inputRef}
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onBlur={onBlur}
      />
    </form>
  ) : (
    <Title onClick={() => setEditable(true)} {...props}>
      {value}
    </Title>
  )
}

export default EditableTitle
