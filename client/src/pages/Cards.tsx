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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📇 Cartes Sauvegardées</h2>
      {cards.length === 0 ? (
        <p>Aucune carte enregistrée pour le moment.</p>
      ) : (
        <div className="grid gap-4">
          {cards.map((card, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h3 className="text-lg font-semibold">{card.nom}</h3>
              <p>📞 {card.telephone}</p>
              <p>📧 {card.email}</p>
              <p>🌐 {card.site}</p>
              <p>🔗 {card.reseaux}</p>
              <p className="text-sm text-gray-600 mt-2">{card.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;
