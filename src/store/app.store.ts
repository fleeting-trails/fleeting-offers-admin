import { writable } from 'svelte/store'

// Define initial state
const initialState: Store.AppStore = {
  theme: 'light',
  shortcuts: [],
  sidenavOpenState: 'expanded',
  auth: {
    isLoggedIn: false,
    user: null,
    token: null,
    permissions: null,
  },
}

// Create the writable store with typed initial state
const appStore = writable<Store.AppStore>(initialState)

export { appStore }
