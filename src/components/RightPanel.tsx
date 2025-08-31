"use client";

import React from "react";

interface RightPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  baseImage: string | null;
  setStyledImage: (img: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (msg: string | null) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  prompt,
  setPrompt,
  baseImage,
  setStyledImage,
  loading,
  setLoading,
  error,
  setError,
}) => {
  const handleGenerate = async () => {
    if (!baseImage) {
      setError("Please upload a base image first.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a style prompt.");
      return;
    }

    setError(null);
    setLoading(true);
    setStyledImage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, baseImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate styled image.");
      }

      const data = await response.json();

      if (data.styledImageData) {
        setStyledImage(data.styledImageData);
      } else {
        setError("No styled image returned from AI.");
      }
    } catch (error: any) {
      setError(error.message || "Error generating styled image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white dark:bg-gray-900 h-full">
      <label
        htmlFor="prompt"
        className="mb-2 font-semibold text-gray-700 dark:text-gray-300"
      >
        Describe your desired art style:
      </label>
      <textarea
        id="prompt"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="E.g., A dreamy watercolor sunset with pastel colors"
        className="mb-4 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
        disabled={loading}
      />

      <button
        onClick={handleGenerate}
        className="mt-auto px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate My Art Style"}
      </button>

      {error && (
        <p
          className="mt-4 text-red-600 font-medium"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default RightPanel;

