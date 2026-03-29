namespace Store {
  type AppStore = {
    theme: Utils.ThemeColorSchemes
    shortcuts: NavItem[]
    sidenavOpenState: SidenavOpenStates
    auth: AuthState
  }
  type NavItem = {
    id: string
    url: string
    label: string
    icon: Utils.AppComponent
    description?: string
    tags?: [string]
  }
  type SidenavOpenStates = 'expanded' | 'collapsed' | 'hidden'
  type AuthState = {
    isLoggedIn: boolean
    user: any | null
    token?: string | null
    permissions?: Record<string, any> | null
  }
}
