import type { ModuleType } from '$lib/types/roles'

declare global {
  namespace Core {
    export type NavSubmodule = {
      id: string
      label: string
      description: string
      tags: string[]
    }

    export type NavModule = {
      id: string
      label: string
      icon: ComponentType
      description: string
      tags: string[]
      permissionLabel?: ModuleType
      submodule: NavSubmodule[]
    }

    export type NavSection = {
      id: string
      label: string
      description: string
      tags: string[]
      module: NavModule[]
    }

    export type NavTree = NavSection[]
  }
}

export {}
