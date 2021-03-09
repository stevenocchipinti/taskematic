import { makeAutoObservable } from "mobx"

class UiStore {
  rootStore
  cursor = null

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  setCursor(node) {
    this.cursor = node
  }
}

export default UiStore
