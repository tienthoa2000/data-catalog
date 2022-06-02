// クリップJSONにデータを追加するメソッド
import { Clip, ClipFolder } from '~/store/clipModule'

export const insertClipJson = (
  ownClip: (ClipFolder | Clip)[] | null,
  selectedItem: any,
  clipDescription: string | null
) => {
  if (!selectedItem) return []
  let copyOwnClip: (ClipFolder | Clip)[]
  if (ownClip && ownClip?.length > 0) {
    copyOwnClip = [...ownClip]
  } else {
    copyOwnClip = []
  }
  copyOwnClip.unshift({
    id: selectedItem.id,
    name: selectedItem.name,
    type: 'data',
    label: selectedItem.label,
    logicalName: getLogicalName(selectedItem),
    location: selectedItem.values.locationName,
    wsOrDbScm: getWsOrDbScm(selectedItem),
    clipDesc: clipDescription,
  })
  return copyOwnClip
}

const getLogicalName = (selectedItem: any) => {
  if (!selectedItem) return
  switch (selectedItem.label) {
    case 'table':
      return selectedItem.values?.table?.logicalName
    case 'view':
      return selectedItem.values?.view?.logicalName
    case 'dataset':
      return selectedItem.values?.dataset?.logicalName
    case 'report':
      return selectedItem.values?.report?.logicalName
    case 'dashboard':
      return selectedItem.values?.dashboard?.logicalName
  }
}

const getWsOrDbScm = (selectedItem: any) => {
  if (!selectedItem) return
  const label = selectedItem.label
  if (!label) return
  if (label === 'table' || label === 'view') {
    return (
      selectedItem.values?.location?.name +
      ' / ' +
      selectedItem.values?.schema?.name
    )
  } else if (label === 'dataset') {
    return selectedItem.values?.dataset?.workspace?.workspaceName
  } else if (label === 'report') {
    return selectedItem.values?.report?.workspace?.workspaceName
  } else if (label === 'dashboard') {
    return selectedItem.values?.dashboard?.workspace?.workspaceName
  } else {
    return ''
  }
}
