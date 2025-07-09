'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess?: (fileUrl: string) => void;
  onUploadError?: (error: string) => void;
}

export default function ImageUpload({ onUploadSuccess, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('ファイルを選択してください');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('画像のアップロードが完了しました');
        onUploadSuccess?.(data.fileUrl);
        setSelectedFile(null);
        // ファイル入力をリセット
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const errorMessage = data.error || 'アップロードに失敗しました';
        console.error('アップロードエラー詳細:', data);
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      }
    } catch (error) {
      console.error('アップロードエラー:', error);
      toast.error('アップロード中にエラーが発生しました');
      onUploadError?.('アップロード中にエラーが発生しました');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-input">画像ファイルを選択</Label>
        <Input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="mt-2"
        />
      </div>
      
      {selectedFile && (
        <div className="text-sm text-gray-600">
          選択されたファイル: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
      
      <Button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
        className="w-full"
      >
        {isUploading ? 'アップロード中...' : 'アップロード'}
      </Button>
    </div>
  );
} 