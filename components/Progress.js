import "twin.macro"
import { CircularProgressbar } from "react-circular-progressbar"
import { observer } from "mobx-react-lite"
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

const Progress = observer(({ node, showBoolean, onClick, ...props }) => {
  const percentage = node.progress
  const fg = colorForPercentage(percentage)
  const doneChildren = node.children.filter(n => n.done).length
  const text = showBoolean ? "" : `${doneChildren}/${node.children.length}`

  return (
    <div tw="cursor-pointer relative" role="button" onClick={onClick}>
      <CircularProgressbar
        value={percentage}
        text={text}
        maxValue={1}
        strokeWidth={9}
        styles={{
          text: { fontSize: "28px", fill: fg },
          path: { stroke: fg },
          trail: { stroke: gray },
        }}
        {...props}
      />
      {showBoolean && percentage === 1 && (
        <Tick tw="h-6 w-6 absolute inset-0 m-auto text-green-500" />
      )}
    </div>
  )
})

export default Progress
