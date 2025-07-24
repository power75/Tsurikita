"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { updateIcon } from "./actions";
import Image from 'next/image'

interface IconFormProps {
  initialIcon: string | null;
}

export function IconForm({ initialIcon }: IconFormProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [currentIcon, setCurrentIcon] = useState<string | null>(initialIcon)
    const [error, setError] = useState<string | null>(null)
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // エラー状態をリセット
      setError(null)
  
      setIsUploading(true)
      const formData = new FormData()
      formData.append('icon', file)
  
      try {
        const result = await updateIcon(formData)
        if (result?.iconUrl) {
          setCurrentIcon(result.iconUrl)
        }
      } catch (error) {
        console.error('アップロードエラー:', error)
        // エラーメッセージをより詳細に表示
        let errorMessage = 'アップロードに失敗しました'
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === 'string') {
          errorMessage = error
        }
        setError(errorMessage)
      } finally {
        setIsUploading(false)
      }
    }

    const handleButtonClick = () => {
      const fileInput = document.getElementById('icon-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.click()
      }
    }
  
    return (
      <div className="flex flex-col items-center gap-4">
        {currentIcon && (
          <div className="relative w-24 h-24">
            <Image
              src={currentIcon}
              alt="プロフィールアイコン"
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="icon-upload"
          disabled={isUploading}
          aria-label="アイコン画像を選択"
        />
        <div className="flex flex-col items-center gap-2">
          
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={isUploading}
            aria-label={isUploading ? 'アップロード中...' : 'アイコンを変更'}
            title={isUploading ? 'アップロード中...' : 'アイコンを変更'}
            onClick={handleButtonClick}
          >
            {isUploading ? 'アップロード中...' : 'アイコンを変更'}
          </Button>
          <p className="text-xs text-gray-400 mb-1">※ jpeg, png, gif, webp 形式のみ対応（50MB以下）</p>
          {error && (
            <div className="text-red-500 text-sm max-w-xs text-center">
              <p className="font-semibold">エラーが発生しました:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }