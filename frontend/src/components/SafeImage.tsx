"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackWidth?: number;
  fallbackHeight?: number;
}

export default function SafeImage({
  fallbackWidth,
  fallbackHeight,
  className,
  alt,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    setError(true);
  };
  
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ 
          width: fallbackWidth || props.width || '100%', 
          height: fallbackHeight || props.height || '100%' 
        }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" aria-label={alt} />
      </div>
    );
  }
  
  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
} 