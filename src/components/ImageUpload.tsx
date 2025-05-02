'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTimer } from '@/context/TimerContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageIcon, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageUpload() {
  const { backgroundImage, setBackgroundImage } = useTimer();
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShowPreview(true);
  }, []);

  const handleImageChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  }, []);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Drag and drop</span> or{" "}
            <label
              htmlFor="background-image"
              className="text-primary cursor-pointer hover:underline"
            >
              click to upload
            </label>
          </div>
          <Input
            id="background-image"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
            className="hidden"
          />
        </div>
      </div>
      {showPreview && backgroundImage && (
        <div className="mt-2 space-y-2">
          <div className="text-sm text-muted-foreground">
            Image selected. Will be shown in fullscreen mode.
          </div>
          <div className="relative w-48 aspect-video rounded-md overflow-hidden border group">
            <img
              src={backgroundImage}
              alt="Background preview"
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => setBackgroundImage(null)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Trash2 className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 