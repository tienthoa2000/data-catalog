import { Category } from '../constants/Category'
import { ResultItem } from '~/store/resultModule'

export const fetchDetailHandling = async (store: any, item: ResultItem) => {
  if (!item) return
  if (!store) return
  console.log(item)
  switch (item?.label) {
    case Category.TABLE:
      await store.fetchTableDetail(item.id)
      break
    case Category.VIEW:
      await store.fetchViewDetail(item.id)
      break
    case Category.DASHBOARD:
      await store.fetchDashboardDetail(item.id)
      break
    case Category.REPORT:
      await store.fetchReportDetail(item.id)
      break
    case Category.DATASET:
      await store.fetchDatasetDetail(item.id)
      break
  }
}
