import { writable } from 'svelte/store'

const initialState: Store.AppStore = {
  theme: 'light',
  shortcuts: [],
  sidenavOpenState: 'expanded',
  auth: {
    isLoggedIn: false,
    user: null,
  },
}
export const appStore = $state(initialState)
