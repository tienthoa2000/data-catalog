// 配列(Array<Number>)を比較し、値が全て一致していればtrue、そうでなければfalseを返す(配列データの順番指定無し)
export const useArrayNumberEqualNoOrderSpecified = (
  array1: number[],
  array2: number[]
) => {
  if (!Array.isArray(array1)) return false
  if (!Array.isArray(array2)) return false
  if (array1?.length !== array2?.length) return false
  return array1?.every((e) => array2?.includes(e))
}
