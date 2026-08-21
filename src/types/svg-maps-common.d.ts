declare module 'svg-maps__common' {
  export interface Location {
    name: string
    id: string
    path: string
  }

  export interface Map {
    label: string
    viewBox: string
    locations: Location[]
  }
}
