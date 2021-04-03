import { useEffect, useRef } from "react"

const useSound = soundUrl => {
  const soundRef = useRef(null)

  useEffect(() => {
    soundRef.current = new Audio(soundUrl)
  }, [])

  return () => soundRef.current.play()
}

export default useSound
