import { useState } from "react";
import LeftPanel from "./LeftPanel";

function GeneratorContainer() {
  const [prompt, setPrompt] = useState("");
  const [baseImage, setBaseImage] = useState(null);
  const [styledImage, setStyledImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setStyledImage(data.styledImageData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <textarea
        placeholder="Enter your prompt here"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        rows={3}
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Styled Image
      </button>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <LeftPanel
        baseImage={baseImage}
        setBaseImage={setBaseImage}
        styledImage={styledImage}
        setStyledImage={setStyledImage}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}

export default GeneratorContainer;
