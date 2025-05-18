# Amplify Form Builder Frontend

このリポジトリは、AWS Amplify を使用したフォーム作成サービスのフロントエンドコードを含んでいます。

## 機能

- 管理画面からJSON Schemaを使用したフォーム作成
- 作成されたフォームの一意のURL生成
- react-jsonschema-formを使用したフォームレンダリング
- AWS Amplify でのホスティング

## 技術スタック

- React.js
- AWS Amplify
- react-jsonschema-form
- AWS Lambda & DynamoDB（バックエンド）

## 開発環境のセットアップ

### 前提条件

- Node.js (v16以上)
- npm または yarn
- AWS アカウント
- AWS CLI（設定済み）
- Amplify CLI

### インストール方法

1. リポジトリをクローン：
   ```bash
   git clone https://github.com/okayus/amplify-form-builder.git
   cd amplify-form-builder
   ```

2. 依存関係をインストール：
   ```bash
   npm install
   ```

3. CloudFormationスタックのデプロイ：
   ```bash
   aws cloudformation deploy --template-file infrastructure/cloudformation.yaml --stack-name amplify-form-builder-stack --parameter-overrides Stage=dev --capabilities CAPABILITY_IAM
   ```

4. Amplifyプロジェクトの初期化：
   ```bash
   amplify init
   ```

5. ローカル開発サーバーの起動：
   ```bash
   npm start
   ```

## フォーム作成の使い方

1. 管理画面にアクセス
2. 「新規フォーム作成」ボタンをクリック
3. フォームのタイトルと説明を入力
4. JSON Schemaを入力
5. 「作成」ボタンをクリック
6. 生成されたURLを使用してフォームを共有

## アーキテクチャ

フロントエンドは React.js + AWS Amplify で構築され、バックエンドは CloudFormation でデプロイされる Lambda + DynamoDB + API Gateway で構成されています。

詳細なアーキテクチャについては、`doc/requirements.md` を参照してください。