"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2, ImageIcon, X } from "lucide-react";
import SafeImage from "./SafeImage";

interface UploadButtonProps {
  endpoint: "profileImage" | "projectImages";
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

export default function UploadButton({
  endpoint,
  value = [],
  onChange,
  maxFiles = 1,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setError(null);
      
      const newUrls = res.map((file) => file.url);
      onChange([...value, ...newUrls]);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setError(error.message);
    },
  });
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (value.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'} allowed`);
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    await startUpload(files);
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      {/* Existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative aspect-video rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <SafeImage
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
                width={200}
                height={150}
                priority={index === 0} 
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload button */}
      {value.length < maxFiles && (
        <>
          <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            ) : (
              <>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="mb-3 h-8 w-8 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or WEBP
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  multiple={maxFiles > 1}
                />
              </>
            )}
          </label>
          
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </>
      )}
    </div>
  );
} 