"use client";

import { useState } from "react";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";

const MainLayout: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Function to handle image generation process
  const handleGenerate = async () => {
    if (!prompt || !baseImage) {
      setError("Please upload an image and enter a prompt.");
      return;
    }
    setError(null);
    setLoading(true);
    setStyledImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, baseImage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await res.json();
      setStyledImage(data.styledImageData);
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header */}
      <Header />

      {/* Panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* LeftPanel - 45% width */}
        <div className="w-[45%] overflow-auto">
          <LeftPanel
            baseImage={baseImage}
            setBaseImage={setBaseImage}
            styledImage={styledImage}
            setStyledImage={setStyledImage}
            loading={loading}
            setLoading={setLoading}
          />
        </div>

        {/* RightPanel - 55% width */}
        <div className="w-[55%] overflow-auto px-6 py-4">
          {/* Prompt input */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            rows={6}
            className="w-full p-3 border rounded resize-none mb-4 dark:bg-gray-800 dark:text-white"
            disabled={loading}
          />

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Styled Image"}
          </button>

          {/* Error display */}
          {error && (
            <p className="text-red-600 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          {/* Additional RightPanel content can go here */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
