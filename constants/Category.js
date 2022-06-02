const category = {
  TABLE: 'table',
  VIEW: 'view',
  COLUMN: 'column',
  DASHBOARD: 'dashboard',
  REPORT: 'report',
  DATASET: 'dataset'
}

function getCategoryText(code) {
  switch (code) {
    case category.TABLE:
      return 'テーブル'
    case category.VIEW:
      return 'ビュー'
    case category.COLUMN:
      return 'カラム'
    case category.DASHBOARD:
      return 'ダッシュボード'
    case category.REPORT:
      return 'レポート'
    case category.DATASET:
      return 'データセット'
    default:
      return ''
  }
}

// 先頭大文字のLabelを返す関数 (アッパーキャメルケース)
function getCategoryUCC(code) {
  switch (code) {
    case category.TABLE:
      return 'Tables'
    case category.VIEW:
      return 'Views'
    case category.COLUMN:
      return 'Columns'
    case category.DASHBOARD:
      return 'Dashboards'
    case category.REPORT:
      return 'Reports'
    case category.DATASET:
      return 'Datasets'
    default:
      return ''
  }
}

export const Category = {
  ...category,
  getCategoryText,
  getCategoryUCC
}
