import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function parseText(text: string) {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+212|0)[5-7]\d{8}/;
  const siteRegex = /(https?:\/\/)?(www\.)?[\w.-]+\.\w+/i;
  const nomRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+/gm;

  return {
    nom: text.match(nomRegex)?.[0] || "",
    telephone: text.match(phoneRegex)?.[0] || "",
    email: text.match(emailRegex)?.[0] || "",
    site: text.match(siteRegex)?.[0] || "",
    reseaux: "",
    notes: text,
  };
}

const Validate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawText = location.state?.text || "";
  const parsed = parseText(rawText);

  const [formData, setFormData] = useState(parsed);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cards",
        formData
      );

      console.log("✅ Saved:", response.data);
      alert("Carte enregistrée !");
      navigate("/");
    } catch (error) {
      console.error("❌ Save error:", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">📝 Validation Carte Visite</h2>
      <div className="grid gap-3">
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="site"
          placeholder="Site Web"
          value={formData.site}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="reseaux"
          placeholder="Réseaux sociaux"
          value={formData.reseaux}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded p-2 h-32"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default Validate;
