export type pageLink = {
  svg: string
  path: string
  width: string | null
  height: string | null
}

export type pageLinkList = pageLink[]

export type Label = 'table' | 'view' | 'report' | 'dashboard' | 'dataset'
