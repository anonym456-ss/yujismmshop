import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [owner, setOwner] = useState(false);

  // 🔄 Lädt die Produkte aus der JSON-Datei
  useEffect(() => {
    fetch("/products.json")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fehler beim Laden:", err));
  }, []);

  const addProduct = () => {
    if (!owner) return alert("Nur Owner können Produkte hinzufügen!");
    const name = prompt("Name des neuen Produkts:");
    const price = parseFloat(prompt("Preis in Euro:"));
    const image = prompt("Dateiname des Bildes (z. B. dragon.png):");
    const desc = prompt("Beschreibung:");
    const newProduct = { id: Date.now(), name, price, image: /${image}, desc };
    setProducts([...products, newProduct]);
    alert("Produkt hinzugefügt (lokal). Um es für alle sichtbar zu machen, bitte in products.json auf GitHub eintragen!");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Yuji's Mega Service</h1>
      <p className="text-center mb-4">Dein Shop für exklusive Brainrot Pets & Lucky Blocks</p>

      {!owner && (
        <div className="text-center mb-6">
          <button
            onClick={() => {
              const code = prompt("Owner-Code eingeben:");
              if (code === "mediaweiden") setOwner(true);
              else alert("Falscher Code!");
            }}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Owner Login
          </button>
        </div>
      )}

      {owner && (
        <div className="text-center mb-6">
          <button onClick={addProduct} className="bg-green-600 px-4 py-2 rounded">
            Neues Produkt hinzufügen
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-neutral-800 rounded-2xl p-4 shadow-lg text-center">
            <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-xl mb-3" />
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-400">{p.desc}</p>
            <p className="text-lg font-bold mt-2">{p.price} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
