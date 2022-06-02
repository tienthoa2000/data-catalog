// 配列(Array<Number>)を比較し、値が全て一致していればtrue、そうでなければfalseを返す(配列データの順番まで厳密にチェック)
export const useArrayEqual = (array1: number[], array2: number[]) => {
  if (!Array.isArray(array1)) return false
  if (!Array.isArray(array2)) return false
  if (array1?.length !== array2?.length) return false
  return array1?.every((e, i) => e === array2[i])
}
