'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME, testS3Connection } from '@/lib/s3'

export async function updateUsername(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ログインしてください')
  }

  const username = formData.get('username') as string

  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', user.id)

  if (error) {
    throw new Error('ユーザー名の更新に失敗しました')
  }

  revalidatePath('/private/profile')
}

export async function updateIcon(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('ログインしてください')
    }

    const file = formData.get('icon') as File
    if (!file) {
      throw new Error('ファイルが選択されていません')
    }

    console.log('S3アップロード開始:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      bucketName: BUCKET_NAME,
      region: process.env.AWS_REGION
    })

    // S3接続テスト（本番環境でのみ）
    if (process.env.NODE_ENV === 'production') {
      const connectionTest = await testS3Connection()
      if (!connectionTest) {
        throw new Error('S3への接続に失敗しました。環境変数を確認してください。')
      }
    }

    // ファイルサイズチェック（50MB制限）
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('ファイルサイズが大きすぎます（50MB以下）')
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('サポートされていないファイル形式です')
    }

    // ファイル名を生成（重複を避けるため）
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `upload/profiles/${timestamp}.${fileExtension}`

    // ファイルをバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer())

    // S3にアップロード
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })

    await s3Client.send(command)

    // アップロードされたファイルのURLを生成
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    console.log('S3アップロード成功:', fileUrl)

    // プロフィールを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ icon_url: fileUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('プロフィール更新エラー詳細:', updateError)
      throw new Error(`プロフィールの更新に失敗しました: ${updateError.message}`)
    }

    revalidatePath('/private/profile')
    return { iconUrl: fileUrl }
  } catch (error) {
    console.error('アイコン更新エラー:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('予期せぬエラーが発生しました')
  }
}