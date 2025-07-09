import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/lib/s3';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

export async function uploadImageToS3(
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // バケット名の確認
    if (!BUCKET_NAME) {
      return {
        success: false,
        error: 'S3バケット名が設定されていません'
      };
    }
    // ファイルサイズチェック（50MB制限）
    if (file.size > 50 * 1024 * 1024) {
      return {
        success: false,
        error: 'ファイルサイズが大きすぎます（50MB以下）'
      };
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'サポートされていないファイル形式です'
      };
    }

    // ファイル名を生成（重複を避けるため）
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}.${fileExtension}`;

    // ファイルをバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    // S3にアップロード
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      // ACL: 'public-read', // ACLが無効なバケットのため削除
    });

    await s3Client.send(command);

    // アップロードされたファイルのURLを返す
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return {
      success: true,
      fileUrl,
      fileName,
    };

  } catch (error) {
    console.error('S3アップロードエラー:', error);
    return {
      success: false,
      error: 'ファイルのアップロードに失敗しました'
    };
  }
}

// プロフィール画像用のアップロード関数
export async function uploadProfileImage(file: File): Promise<UploadResult> {
  return uploadImageToS3(file, 'profiles');
}

// キャッチ画像用のアップロード関数
export async function uploadCatchImage(file: File): Promise<UploadResult> {
  return uploadImageToS3(file, 'catches');
}

// 釣り場画像用のアップロード関数
export async function uploadFishingSpotImage(file: File): Promise<UploadResult> {
  return uploadImageToS3(file, 'fishing-spots');
} 