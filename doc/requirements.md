# フォーム作成サービス要件定義書

## プロジェクト概要
AWS Amplify と Lambda を活用した、Googleフォームのようなフォーム作成・共有サービスの開発。ユーザーはJSON Schemaを定義することでフォームを作成し、自動生成されたURLを通じてフォームを共有できる。

## 主要機能

### 1. フォーム管理画面
- ユーザー認証（Amplify Auth）
- フォーム一覧表示
- フォーム作成機能
  - JSON Schemaの入力/編集
  - フォームタイトル・説明の設定
- フォーム削除機能

### 2. フォーム作成エンジン
- JSON Schemaをベースにしたフォーム定義
- フォームごとに一意のIDとURLを自動生成
- react-jsonschema-formを使用したフォームレンダリング
- フォーム定義のデータストア（DynamoDB）

### 3. フォーム表示機能
- 生成されたURLでのフォーム公開
- モバイル対応レスポンシブデザイン
- フォーム送信処理

## 技術スタック

### フロントエンド
- React.js
- react-jsonschema-form
- AWS Amplify UI コンポーネント

### バックエンド
- AWS Lambda
- Amazon DynamoDB
- AWS Amplify（ホスティング、認証）
- API Gateway

## アーキテクチャ概要

### フォーム作成フロー
1. 管理者がJSON Schemaを入力/編集
2. 「フォーム作成」ボタンをクリック
3. Lambda関数がリクエストを処理
4. フォームIDを生成・DynamoDBに保存
5. 一意のURL（`https://[AmplifyアプリID].amplifyapp.com/forms/[フォームID]`）を生成
6. URLを管理者に返却

### フォーム表示フロー
1. ユーザーが生成されたURLにアクセス
2. AmplifyホスティングからSPAが読み込まれる
3. URLからフォームIDを抽出
4. API経由でDynamoDBからJSON Schemaを取得
5. react-jsonschema-formでフォームをレンダリング
6. ユーザーがフォームに入力・送信
7. 回答データがDynamoDBに保存

## データモデル

### Form テーブル
- `formId`: 一意のフォームID（パーティションキー）
- `title`: フォームのタイトル
- `description`: フォームの説明
- `jsonSchema`: フォームのJSON Schema定義
- `uiSchema`: UI表示のためのカスタマイズ（オプション）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `ownerId`: 作成者のID
- `status`: フォームのステータス（アクティブ/非アクティブ）

### Response テーブル
- `responseId`: 回答ID（パーティションキー）
- `formId`: フォームID（ソートキー）
- `data`: 回答データ（JSON）
- `submittedAt`: 提出日時
- `ipAddress`: 提出元IPアドレス（オプション）

## フェーズ1実装範囲（MVP）
- 管理画面からのフォーム作成機能
- JSON Schemaを指定してフォームを生成
- フォームごとに一意のURLを自動生成
- 基本的なフォーム表示・送信機能

## 非機能要件
- セキュリティ: AWS IAMによる適切なアクセス制御
- スケーラビリティ: サーバーレスアーキテクチャによる自動スケーリング
- パフォーマンス: CloudFrontによるコンテンツ配信の高速化
- 可用性: マルチAZ構成によるデータの冗長性確保

## 今後の拡張可能性
- フォームテンプレート機能
- 回答データの分析ダッシュボード
- ファイルアップロード対応
- 回答通知機能（Email/SMS）
- カスタムドメイン対応