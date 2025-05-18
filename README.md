# Amplify Form Builder

このリポジトリは、AWS Amplify を使用したフォーム作成サービスです。JSON Schemaを使ってフォームを生成し、動的なURLを生成します。

## プロジェクト概要

- GoogleフォームのようなフォーマットCSVのようなサービスを構築
- JSON Schemaによるフォーム定義
- AWS Lambdaによるバックエンド処理
- AWS Amplifyによるホスティングとユーザー認証
- react-jsonschema-formによるフォームレンダリング

## 環境構築手順

### 1. AWSバックエンドのデプロイ

CloudFormationを使ってバックエンドリソースをデプロイします：

```bash
# CloudFormationテンプレートをデプロイ
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yaml \
  --stack-name amplify-form-builder-stack \
  --parameter-overrides Stage=dev \
  --capabilities CAPABILITY_IAM
```

以下のリソースが作成されます：
- DynamoDBテーブル（Forms, Responses）
- Lambda関数（CreateForm, GetForm）
- API Gateway
- IAMロール

### 2. Amplifyフロントエンドの設定

#### 2.1. Amplify CLIのインストール

```bash
npm install -g @aws-amplify/cli
```

#### 2.2. Amplifyプロジェクトの初期化

```bash
amplify init
```

プロンプトに従って設定を行います：
- プロジェクト名: amplify-form-builder
- 環境名: dev
- デフォルトエディタ: お好みのエディタ
- アプリケーションタイプ: javascript
- フレームワーク: react
- ソースディレクトリパス: src
- ビルド出力ディレクトリパス: build
- ビルドコマンド: npm run build
- 開始コマンド: npm start

#### 2.3. Amplify認証の追加

```bash
amplify add auth
```

デフォルト設定を使用するか、カスタム設定を行います。

#### 2.4. 環境変数の設定

CloudFormationでデプロイしたリソース情報をReactアプリの環境変数として設定します。以下の情報を`.env`ファイルに追加します：

```
REACT_APP_AWS_REGION=<AWSリージョン>
REACT_APP_API_ENDPOINT=<API Gateway Endpoint>
```

CloudFormationのOutputsから値を取得します：

```bash
aws cloudformation describe-stacks \
  --stack-name amplify-form-builder-stack \
  --query "Stacks[0].Outputs"
```

### 3. Amplifyコンソールでのホスティング設定

#### 3.1. AWSコンソールからAmplifyサービスに移動

AWSコンソールで「Amplify」サービスに移動し、「ホスティング」>「新しいアプリをホスティング」を選択します。

#### 3.2. GitHubからリポジトリを接続

- GitHubを選択し、OAuth接続を行います
- リポジトリとブランチ（main）を選択します

#### 3.3. ビルド設定

- ビルド設定はamplify.ymlファイルが自動的に検出されます
- 環境変数として、CloudFormationで作成したリソースの情報を設定します:
  - `REACT_APP_AWS_REGION`: AWSリージョン
  - `REACT_APP_API_ENDPOINT`: API Gatewayのエンドポイント
  - `REACT_APP_USER_POOL_ID`: Amplify AuthのユーザープールID
  - `REACT_APP_USER_POOL_CLIENT_ID`: アプリクライアントID

#### 3.4. デプロイ

「保存してデプロイ」をクリックしてデプロイを開始します。

### 4. アプリケーションの使用方法

#### 4.1. 管理者ユーザーの作成

初回実行時に、以下のコマンドで管理者ユーザーを作成します：

```bash
aws cognito-idp sign-up \
  --client-id <アプリクライアントID> \
  --username admin@example.com \
  --password <パスワード> \
  --user-attributes Name=email,Value=admin@example.com

aws cognito-idp admin-confirm-sign-up \
  --user-pool-id <ユーザープールID> \
  --username admin@example.com
```

#### 4.2. アプリにアクセス

Amplifyコンソールに表示されるURLからアプリにアクセスします。例：
`https://main.xxxxxxxx.amplifyapp.com`

#### 4.3. フォームの作成と共有

1. ログイン後、「新規フォームを作成」ボタンをクリック
2. フォームのタイトル、説明、JSON Schemaを入力
3. 「フォームを作成」ボタンをクリック
4. 生成されたURLをコピーして共有

## フォーム作成の仕組み

1. ユーザーがJSON Schemaを定義
2. 「フォーム作成」ボタンクリックでAPI Gateway経由でLambda関数が呼び出される
3. Lambda関数がDynamoDBにフォーム情報を保存
4. フォームIDに基づいて一意のURLが生成される
5. フォームURLは以下の形式: `https://<AmplifyアプリID>.amplifyapp.com/forms/<formId>`

## JSON Schemaの例

```json
{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": {
      "type": "string",
      "title": "お名前"
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "メールアドレス"
    },
    "age": {
      "type": "integer",
      "title": "年齢",
      "minimum": 0
    },
    "comment": {
      "type": "string",
      "title": "コメント"
    }
  }
}
```

UI Schemaの例:

```json
{
  "comment": {
    "ui:widget": "textarea"
  }
}
```

## カスタマイズと拡張

- **フォームテンプレート**: よく使われるフォーム定義をテンプレートとして保存
- **レスポンス分析**: 収集したデータの分析ダッシュボード
- **通知機能**: フォーム送信時にメール通知
- **カスタムドメイン**: Route53と連携してカスタムドメインを設定

## トラブルシューティング

- **API接続エラー**: Lambda関数のロググループ（CloudWatch Logs）を確認
- **認証エラー**: Cognito User Poolの設定を確認
- **デプロイエラー**: Amplifyコンソールのビルドログを確認

## ライセンス

MIT
