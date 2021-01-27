import tw from "twin.macro"
import { observer } from "mobx-react-lite"
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import tailwind from "../lib/tailwind"

const Tick = props => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.86581 34.0433C13.1544 38.0796 20.1127 45.1851 23.0558 48.2333L55.2199 16.0693"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const green = tailwind.theme.colors.green[500]
const blue = tailwind.theme.colors.blue[400]
const gray = tailwind.theme.colors.gray[200]

const colorForPercentage = percentage => {
  if (percentage === 1) return green
  if (percentage === 0) return gray
  return blue
}

const Container = tw.div`cursor-pointer relative`

const Progress = observer(({ node, onClick, ...props }) => {
  const fg = colorForPercentage(node.progress)
  const text = node.isLeaf ? "" : `${(node.progress * 100).toFixed(0)}%`

  return (
    <Container role="button" onClick={onClick}>
      <CircularProgressbar
        value={node.progress}
        text={text}
        minValue={0}
        maxValue={1}
        strokeWidth={9}
        styles={{
          text: { fontSize: "26px", fill: fg },
          path: { stroke: fg },
          trail: { stroke: gray },
        }}
        {...props}
      />
      {node.isLeaf && node.progress === 1 && (
        <Tick tw="h-6 w-6 absolute inset-0 m-auto text-green-500" />
      )}
    </Container>
  )
})

export default Progress
