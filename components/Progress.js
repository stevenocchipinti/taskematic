import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

import tailwind from "../lib/tailwind"

const green = tailwind.theme.colors.green[500]
const blue = tailwind.theme.colors.blue[400]
const gray = tailwind.theme.colors.gray[200]

const Progress = ({ percentage, showBoolean, ...props }) => {
  const done = percentage === 1
  const fg = done ? green : blue
  const text = showBoolean
    ? done
      ? "✅"
      : ""
    : `${(percentage * 100).toFixed(0)}%`

  return (
    <CircularProgressbar
      value={percentage}
      text={text}
      maxValue={1}
      strokeWidth={9}
      styles={{
        text: { fontSize: "26px", fill: fg },
        path: { stroke: fg },
        trail: { stroke: gray },
      }}
      {...props}
    />
  )
}

export default Progress
