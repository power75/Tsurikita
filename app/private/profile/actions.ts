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

    console.log('S3アップロード開始:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    })

    // APIルートを使用してS3にアップロード
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('folder', 'upload/profiles') // プロフィール画像用フォルダ

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'ファイルのアップロードに失敗しました')
    }

    console.log('S3アップロード成功:', data.fileUrl)

    // プロフィールを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ icon_url: data.fileUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('プロフィール更新エラー詳細:', updateError)
      throw new Error(`プロフィールの更新に失敗しました: ${updateError.message}`)
    }

    revalidatePath('/private/profile')
    return { iconUrl: data.fileUrl }
  } catch (error) {
    console.error('アイコン更新エラー:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('予期せぬエラーが発生しました')
  }
}