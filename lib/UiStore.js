import { createContext, useContext } from "react"
import { makeAutoObservable } from "mobx"

class UiStore {
  cursor = null

  constructor() {
    makeAutoObservable(this)
  }

  setCursor(node) {
    this.cursor = node
  }
}

const Context = createContext(null)

const UiStoreProvider = ({ children }) => {
  return <Context.Provider value={new UiStore()}>{children}</Context.Provider>
}

const useUiStore = () => useContext(Context)

export { UiStoreProvider, useUiStore }
