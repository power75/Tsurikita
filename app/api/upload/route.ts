import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    // 環境変数のデバッグ情報
    console.log('S3設定確認:', {
      bucketName: BUCKET_NAME,
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads'; // フォルダを指定可能
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが提供されていません' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（例：50MB制限）
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます（50MB以下）' },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'サポートされていないファイル形式です' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
    });

  } catch (error) {
    console.error('アップロードエラー詳細:', error);
    
    // エラーの詳細情報を返す
    let errorMessage = 'ファイルのアップロードに失敗しました';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 