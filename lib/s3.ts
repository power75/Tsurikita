import { S3Client } from '@aws-sdk/client-s3';

// 環境変数の確認
const requiredEnvVars = {
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};

// 本番環境でのみ環境変数の確認をログ出力
if (process.env.NODE_ENV === 'production') {
  console.log('S3環境変数確認:', {
    hasRegion: !!requiredEnvVars.AWS_REGION,
    hasAccessKey: !!requiredEnvVars.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!requiredEnvVars.AWS_SECRET_ACCESS_KEY,
    hasBucketName: !!requiredEnvVars.AWS_S3_BUCKET_NAME,
    bucketName: requiredEnvVars.AWS_S3_BUCKET_NAME,
    region: requiredEnvVars.AWS_REGION,
  });
}

// 必須環境変数のチェック
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('S3設定エラー: 以下の環境変数が設定されていません:', missingVars);
}

export const s3Client = new S3Client({
  region: requiredEnvVars.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: requiredEnvVars.AWS_ACCESS_KEY_ID!,
    secretAccessKey: requiredEnvVars.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = requiredEnvVars.AWS_S3_BUCKET_NAME!;

// S3クライアントの接続テスト関数
export async function testS3Connection() {
  try {
    const { ListBucketsCommand } = await import('@aws-sdk/client-s3');
    const command = new ListBucketsCommand({});
    await s3Client.send(command);
    console.log('S3接続テスト成功');
    return true;
  } catch (error) {
    console.error('S3接続テスト失敗:', error);
    return false;
  }
} 