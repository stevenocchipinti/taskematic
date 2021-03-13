import { createContext, useContext } from "react"
import UiStore from "./UiStore"
import UserStore from "./UserStore"
import ProjectStore from "./ProjectStore"

class RootStore {
  constructor() {
    this.uiStore = new UiStore(this)
    this.userStore = new UserStore(this)
    this.projectStore = new ProjectStore(this)
  }
}

const Context = createContext(null)

const RootStoreProvider = ({ children }) => (
  <Context.Provider value={new RootStore()}>{children}</Context.Provider>
)

const useRootStore = () => useContext(Context)
const useUiStore = () => useContext(Context).uiStore
const useUserStore = () => useContext(Context).userStore
const useProjectStore = () => useContext(Context).projectStore

export {
  RootStoreProvider,
  useRootStore,
  useUiStore,
  useUserStore,
  useProjectStore,
}
