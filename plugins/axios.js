export default function({ app, $axios, redirect, store }) {
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    const message =
      error.response && error.response.data
        ? error.response.data.error || error.response.data.message
        : null
    // ステータスコードごとにエラーハンドリング
    if (code === 401)
      redirect({ path: '/error', query: { errorType: 'login' } })
    else if (code === 404) redirect('/error')
    else if (code === 422)
      // 準正常系の422エラーが今後追加された時は、message等によって処理を分けて、エラー画面へはリダイレクトさせないような制御を入れる。
      redirect('/error')
    else if (code === 500) redirect('/error')
    else redirect('/error')
  })
}
