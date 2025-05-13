import { useEffect, useState } from "react";
import axios from "axios";

type Card = {
  nom: string;
  telephone: string;
  email: string;
  site: string;
  reseaux: string;
  notes: string;
};

const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/cards")
      .then((res) => setCards(res.data))
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Rechercher une carte..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {cards.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucune carte enregistrée pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {card.nom || "Nom inconnu"}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📞 {card.telephone || "Non précisé"}</p>
                  <p>📧 {card.email || "Non précisé"}</p>
                  <p>🌐 {card.site || "Non précisé"}</p>
                  <p>🔗 {card.reseaux || "Non précisé"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
