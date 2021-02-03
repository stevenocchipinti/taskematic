import { useEffect, useRef, useState } from "react"
import tw, { styled } from "twin.macro"

const Title = tw.h2`text-lg text-gray-600 font-semibold mb-4 align-top`
const TitleInput = styled.input`
  ${tw`w-full text-lg text-gray-600 font-semibold`}
  ${tw`py-1 px-2 mb-3 -mt-1 -mx-2`}
`

const EditableTitle = ({ onChange, value }) => {
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
    <form onSubmit={onSubmit}>
      <TitleInput
        ref={inputRef}
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        onBlur={onBlur}
      />
    </form>
  ) : (
    <Title onClick={() => setEditable(true)}>{value}</Title>
  )
}

export default EditableTitle
