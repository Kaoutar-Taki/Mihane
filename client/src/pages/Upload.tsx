import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Link, useNavigate } from "react-router-dom";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setText(""); // reset
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });
      const extractedText = result.data.text;
      setText(extractedText);

      // 👉 Navigate vers la page de validation avec le texte OCR
      navigate("/validate", { state: { text: extractedText } });
    } catch (err) {
      console.error("OCR error:", err);
      setText("Erreur OCR 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <Link to="/cards" className="text-blue-600 underline">
        Voir mes cartes enregistrées
      </Link>

      <h2 className="text-2xl font-bold">📤 Upload Carte Visite</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <>
          <img src={preview} alt="Preview" className="w-full border rounded" />
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Analyse..." : "Analyser"}
          </button>
        </>
      )}
      {text && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Résultat OCR:</h3>
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      )}
    </div>
  );
};

export default Upload;
