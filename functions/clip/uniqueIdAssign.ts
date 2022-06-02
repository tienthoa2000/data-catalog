// ユニークIDをクリップ情報に付与する関数
import { Clip, ClipFolder } from '~/store/clipModule'

export const uniqueIdAssign = (
  ownClip: (ClipFolder | Clip)[],
  beforeLastIndex: string
) => {
  if (!ownClip || ownClip?.length === 0) return []
  const processedClips: (ClipFolder | Clip)[] = ownClip?.map(
    (e: ClipFolder | Clip, index: number) => {
      const clipsLengthDigits = String(ownClip.length)?.length // indexの最大値(clips.lenghで取得)の桁数取得
      const uniqueId =
        beforeLastIndex + String(index + 1)?.padStart(clipsLengthDigits, '0') // ユニークID生成, padStartで桁数分ゼロパディングさせる
      if (e.type === 'folder') {
        return {
          uniqueId: uniqueId,
          name: e.name,
          type: e.type,
          children: uniqueIdAssign(e.children, uniqueId), // 再帰呼び出しする
        }
      } else {
        return {
          uniqueId: uniqueId,
          id: e.id,
          name: e.name,
          type: e.type,
          label: e.label,
          logicalName: e.logicalName,
          location: e.location,
          wsOrDbScm: e.wsOrDbScm,
          clipDesc: e.clipDesc,
        }
      }
    }
  )
  return processedClips
}
