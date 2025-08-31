"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LeftPanelProps {
  baseImage: string | null;
  setBaseImage: (img: string | null) => void;
  styledImage: string | null;
  setStyledImage: (img: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const MAX_WIDTH = 900;
const MAX_HEIGHT = 600;

const LeftPanel: React.FC<LeftPanelProps> = ({
  baseImage,
  setBaseImage,
  styledImage,
  setStyledImage,
  loading,
  setLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [viewSize, setViewSize] = useState<{ width: number; height: number }>({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });

  const resizeImageDimensions = (imgWidth: number, imgHeight: number) => {
    let width = imgWidth;
    let height = imgHeight;

    if (width > MAX_WIDTH) {
      height = (MAX_WIDTH / width) * height;
      width = MAX_WIDTH;
    }
    if (height > MAX_HEIGHT) {
      width = (MAX_HEIGHT / height) * width;
      height = MAX_HEIGHT;
    }
    return { width, height };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(false);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          const img = new Image();
          img.onload = () => {
            const { width, height } = resizeImageDimensions(img.width, img.height);
            setViewSize({ width, height });
            setPreview(event.target!.result);
            setBaseImage(event.target!.result);
            setStyledImage(null);
          };
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (loading) return; // Prevent removing while loading
    setBaseImage(null);
    setStyledImage(null);
    setPreview(null);
  };

  const handleDownload = () => {
    if (!styledImage) return;
    const link = document.createElement("a");
    link.href = styledImage;
    link.download = "styled-image.jpg";
    link.click();
  };

  useEffect(() => {
    if (styledImage) {
      setPreview(styledImage);
    } else if (!baseImage) {
      setPreview(null);
    }
  }, [styledImage, baseImage]);

  return (
    <div className="flex flex-col items-center justify-start p-6 h-full bg-gray-50 dark:bg-gray-900">
      <button
        onClick={handleUploadClick}
        disabled={loading}
        className="mb-4 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50"
      >
        Upload Image
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      <div
        className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md flex items-center justify-center overflow-hidden p-2 max-w-full max-h-[calc(100vh-8rem)]"
        style={{ width: "100%", height: "auto" }}
      >
        {!loading && preview && (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={preview}
                src={preview}
                alt="Preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="object-contain max-w-full max-h-full rounded select-none"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </AnimatePresence>

            <button
              onClick={handleRemoveImage}
              disabled={loading}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow"
              aria-label="Remove uploaded image"
              title="Remove uploaded image"
            >
              &times;
            </button>
          </>
        )}

        {!loading && !preview && (
          <div
            className="text-gray-500 dark:text-gray-400 text-center select-none flex items-center justify-center"
            style={{
              minHeight: "450px",
              width: "100%",
              padding: "1rem",
            }}
          >
            No image uploaded yet.
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-700 dark:text-gray-300 font-medium select-none">
            Generating image, please wait...
          </div>
        )}
      </div>

      {styledImage && !loading && (
        <button
          onClick={handleDownload}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Download Styled Image
        </button>
      )}
    </div>
  );
};

export default LeftPanel;
