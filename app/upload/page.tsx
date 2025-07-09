'use client';

import ImageUpload from '@/components/ImageUpload';

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">S3画像アップロード</h1>
        <p className="text-gray-600 mb-4">
          全ての画像はAWS S3に保存されます
        </p>
        <ImageUpload 
          onUploadSuccess={(fileUrl) => {
            console.log('S3アップロード成功:', fileUrl);
          }}
          onUploadError={(error) => {
            console.error('S3アップロードエラー:', error);
          }}
        />
      </div>
    </div>
  );
} 