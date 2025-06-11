"use client"
import Image from 'next/image';
import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PLACEHOLDER_IMAGE = '/image/logo2.png';

type CatchImageProps = {
    catchId?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
};

const CatchImage: React.FC<CatchImageProps> = ({
    catchId,
    alt = '釣果画像',
    width = 400,
    height = 300,
    className = '',
}) => {
    const [imageUrl, setImageUrl] = React.useState<string>(PLACEHOLDER_IMAGE);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchImageUrl = async () => {
            if (!catchId) return;
            
            try {
                const { data, error } = await supabase
                    .from('catches')
                    .select('image_url')
                    .eq('id', catchId)
                    .single();

                if (error) {
                    console.error('画像URLの取得に失敗:', error);
                    return;
                }

                if (data?.image_url) {
                    setImageUrl(data.image_url);
                }
            } catch (err) {
                console.error('エラー:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImageUrl();
    }, [catchId]);

    if (loading) {
        return (
            <div className="relative w-full h-[300px] bg-gray-200 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[300px]">
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className={`object-cover ${className}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
};

export default CatchImage;