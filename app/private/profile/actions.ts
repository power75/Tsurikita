'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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

    // ファイルサイズのチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('ファイルサイズは5MB以下にしてください')
    }

    // ファイル形式のチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('JPEG、PNG、またはGIF形式の画像のみアップロード可能です')
    }

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 一意のファイル名を生成（ユーザーID + タイムスタンプ）
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    console.log('アップロード開始:', {
      bucket: 'avatar',
      fileName,
      fileType: file.type,
      fileSize: file.size
    })

    // ストレージにアップロード
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatar')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('アップロードエラー詳細:', {
        error: uploadError,
        message: uploadError.message
      })
      
      if (uploadError.message.includes('permission denied')) {
        throw new Error('ファイルのアップロード権限がありません。管理者に連絡してください。')
      }
      if (uploadError.message.includes('bucket not found')) {
        throw new Error('ストレージバケットが見つかりません。管理者に連絡してください。')
      }
      throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`)
    }

    if (!uploadData) {
      throw new Error('アップロードに失敗しました。データが正しく保存されませんでした。')
    }

    console.log('アップロード成功:', uploadData)

    // アップロードしたファイルのURLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('avatar')
      .getPublicUrl(fileName)

    if (!publicUrl) {
      throw new Error('アップロードしたファイルのURLを取得できませんでした。')
    }

    console.log('パブリックURL取得:', publicUrl)

    // プロフィールを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ icon_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('プロフィール更新エラー詳細:', updateError)
      throw new Error(`プロフィールの更新に失敗しました: ${updateError.message}`)
    }

    revalidatePath('/private/profile')
    return { iconUrl: publicUrl }
  } catch (error) {
    console.error('アイコン更新エラー:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('予期せぬエラーが発生しました')
  }
}