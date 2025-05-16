import Image from 'next/image';
import React from 'react';
const PLACEHOLDER_IMAGE = '/image/logo2.png';
type CatchImageProps = {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
};

const CatchImage: React.FC<CatchImageProps> = ({
    src,
    alt = "placeholder",
    width = 350,
    height = 200,
    className = '',
}) => (
    <div className={`flex items-center justify-center w-full max-w-md mx-autop px-3 ${className}`}>
        <Image
            src={src && src.trim() !== '' ? src : PLACEHOLDER_IMAGE}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            priority
        />
    </div>
);

export default CatchImage;