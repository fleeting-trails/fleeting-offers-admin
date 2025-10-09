import { writable } from 'svelte/store'

// Define initial state
const initialState: Store.AppStore = {
  theme: 'light',
  shortcuts: [],
  sidenavOpenState: 'expanded',
}

// Create the writable store with typed initial state
const appStore = writable<Store.AppStore>(initialState)

export { appStore }
