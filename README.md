# ローカル開発環境構築手順

## パッケージのインストール

```
$ npm install
```

## ローカルサーバ起動

```
$ npm run dev
```

#### ブラウザから以下URLにアクセス
http://localhost:3333/

# 開発時推奨の拡張機能

## VSCode

- Prettier
  https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

- Vetur
  https://marketplace.visualstudio.com/items?itemName=octref.vetur

## Chrome

- Vue.js devtools
  https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=ja

# npm run スクリプト

#### 使用方法

```
$ npm run スクリプト名
```

| Script        | Description                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| **dev**       | ローカル環境(開発時)                                                                                              |
| **build**     | 本番環境でのビルド(AppService側が自動で実行)                                                                     |
| **start**     | 本番環境でのアプリ起動(AppService側が自動で実行)                                                                 |
| **build:dev** | start&build時にNODE_ENV=developmentで起動したい場合のbuildスクリプト(developmentでログイン処理を回避できる) |
| **start:dev** | start&build時にNODE_ENV=developmentで起動したい場合のstartスクリプト(developmentでログイン処理を回避できる) |
| **apimock**   | APIのモックサーバ起動                                                                                            |
| **test**      | テストを走らせるスクリプト(現状、テストコードは不十分)                                                            |
