import tw, { styled } from "twin.macro"
import { useState } from "react"
import marked from "marked"
import DOMPurify from "dompurify"
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

import TrashIcon from "../icons/TrashIcon"
import MarkdownStyles from "./MarkdownStyles"

const Actions = tw.div`flex mb-6 gap-2 justify-end text-sm`

const Button = tw.button`rounded py-2 px-4`
const SaveButton = tw(Button)`bg-green-400 text-white`
const CancelButton = tw(Button)`border text-gray-600`
const ClearButton = tw(Button)`p-2 border text-gray-600`

const StyledContent = tw.div`text-sm text-gray-600 mb-4`

const Content = ({ children, ...props }) => {
  const markedOptions = {
    breaks: true,
    headerIds: false,
  }
  return (
    <StyledContent
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(marked(children, markedOptions)),
      }}
      className="markdown-body"
      {...props}
    />
  )
}

const ContentEditor = styled(SimpleMDE)`
  ${tw`mb-2`}
  & {
    .CodeMirror {
      ${tw`rounded text-sm text-gray-600`}
    }
    .editor-preview {
      ${tw`bg-white p-0`}
    }
  }
`

const EditableContent = ({ value, onChange }) => {
  const [editable, setEditable] = useState(false)
  const [newContent, setNewContent] = useState(value)

  const onSubmit = e => {
    e.preventDefault()
    onChange(newContent)
    setEditable(false)
  }

  const onCancel = e => {
    setEditable(false)
  }

  const onClear = e => {
    e.preventDefault()
    onChange("")
    setEditable(false)
  }

  return (
    <MarkdownStyles>
      <form onSubmit={onSubmit}>
        {editable ? (
          <>
            <ContentEditor
              value={value}
              onChange={newValue => setNewContent(newValue)}
              options={{ status: false, toolbar: false, minHeight: "0" }}
            />
            <Actions>
              <ClearButton aria-label="Clear" onClick={onClear} type="button">
                <TrashIcon tw="w-5 h-4" />
              </ClearButton>
              <CancelButton onClick={onCancel} type="button">
                Cancel
              </CancelButton>
              <SaveButton>Save</SaveButton>
            </Actions>
          </>
        ) : (
          <Content onClick={() => setEditable(true)}>{value}</Content>
        )}
      </form>
    </MarkdownStyles>
  )
}

export default EditableContent
