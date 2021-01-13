import { useEffect, useState } from "react"

export default function useClientSideOnly() {
  const [componentMounted, setComponentMounted] = useState(false)
  useEffect(() => setComponentMounted(true), [])
  return componentMounted
}
