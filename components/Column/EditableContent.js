import tw, { styled } from "twin.macro"
import { useState, useEffect, useRef } from "react"
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

const Actions = tw.div`flex mb-6 gap-2 justify-end text-sm`

const Button = tw.button`rounded py-2 px-4`
const SaveButton = tw(Button)`bg-green-400 text-white`
const CancelButton = tw(Button)`border text-gray-600`

const Content = tw.p`text-sm text-gray-600 mb-4`

const ContentEditor = styled(SimpleMDE)`
  ${tw`mb-2`}
  & {
    .CodeMirror {
      ${tw`rounded text-sm text-gray-600`}
      ${({ editable }) => !editable && tw`border-0`}
    }
    .editor-preview {
      ${tw`bg-white p-0`}
    }

    padding,
    ol,
    ul {
      padding-bottom: 1rem;
    }

    .cm-header-1,
    h1 {
      ${tw`text-2xl font-bold`}
    }
    .cm-header-2,
    h2 {
      ${tw`text-xl font-bold`}
    }
    .cm-header-3,
    h3 {
      ${tw`text-base font-bold`}
    }
    .cm-header-4,
    h4 {
      ${tw`text-sm font-bold`}
    }
    .cm-header-5,
    h5 {
      ${tw`text-xs font-bold`}
    }
    .cm-header-6,
    h6 {
      ${tw`text-xs font-semibold`}
    }
  }
`

const EditableContent = ({ value, onChange }) => {
  const [editable, setEditable] = useState(false)
  const [newContent, setNewContent] = useState(value)

  const mdeRef = useRef(null)
  useEffect(() => {
    console.log(mdeRef.current.isPreviewActive(), editable)
    if (mdeRef.current && mdeRef.current.isPreviewActive() !== !editable) {
      console.log("toggling")
      mdeRef.current.togglePreview()
    }
  }, [editable, mdeRef])

  const onSubmit = e => {
    e.preventDefault()
    onChange(newContent)
    setEditable(false)
  }

  const onCancel = e => {
    setEditable(false)
  }

  return (
    <form onSubmit={onSubmit}>
      <ContentEditor
        value={value}
        editable={editable}
        onClick={() => setEditable(true)}
        onChange={newValue => setNewContent(newValue)}
        getMdeInstance={instance => {
          mdeRef.current = instance
        }}
        options={{ status: false, toolbar: false, minHeight: "0" }}
      />
      {editable && (
        <Actions>
          <CancelButton onClick={onCancel} type="button">
            Cancel
          </CancelButton>
          <SaveButton>Save</SaveButton>
        </Actions>
      )}
    </form>
  )
  // <Content onClick={() => setEditable(true)}>{value}</Content>
}

export default EditableContent
