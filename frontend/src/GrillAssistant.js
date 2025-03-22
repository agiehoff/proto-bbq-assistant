import React, { useState } from 'react';

const donenessLevels = ["Rare", "Medium Rare", "Medium", "Medium Well", "Done"];
const grillTypes = ["Gas", "Kohle", "Elektro"];

export default function GrillAssistant() {
  const [grillType, setGrillType] = useState("");
  const [meat, setMeat] = useState("");
  const [meatThickness, setMeatThickness] = useState("");
  const [meatWeight, setMeatWeight] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [sizzleZone, setSizzleZone] = useState("nein");
  const [thermometer, setThermometer] = useState("nein");
  const [doneness, setDoneness] = useState(2);
  const [recipe, setRecipe] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setImageUrl(null);

    const prompt = `
      Du bist ein erfahrener Grillmeister.
      1. Berechne exakt die Garzeit für:
      - Fleischstück: ${meat}
      - Dicke: ${meatThickness} cm
      - Gewicht: ${meatWeight} Gramm
      - Grilltyp: ${grillType}
      - Garstufe: ${donenessLevels[doneness]}
      - SizzleZone: ${sizzleZone}
      - Fleischthermometer: ${thermometer}
      Gib die Garzeit exakt in Minuten an.
      2. Erstelle danach ein Grillrezept mit NUR diesen Zutaten: ${meat}, ${ingredients}. Nur Salz/Pfeffer zusätzlich erlaubt.
      Abschnitt 1: "⏱️ Garzeit"
      Abschnitt 2: "🍽️ Rezept"
    `;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/get-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setRecipe(data.recipe);

      const imagePrompt = `Gegrilltes ${meat} (${donenessLevels[doneness]}) mit Zutaten: ${ingredients} auf ${grillType}.`;
      const imgRes = await fetch(`${process.env.REACT_APP_API_URL}/api/get-recipe-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const imgData = await imgRes.json();
      setImageUrl(imgData.imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20, backgroundColor: "#f8f8f8" }}>
      <div style={{ maxWidth: 600, margin: "auto", background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{textAlign: "center"}}>🔥 Grill-Assistent</h2>

        {/* Grilltyp als Single Choice */}
        <div style={{ marginBottom: 15 }}>
          <label>Grilltyp wählen:</label><br />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            {grillTypes.map(type => (
              <button
                key={type}
                onClick={() => setGrillType(type)}
                style={{
                  flex: 1,
                  padding: "5px 0",
                  background: grillType === type ? "#2196F3" : "#ddd",
                  color: grillType === type ? "#fff" : "#333",
                  border: "none",
                  borderRadius: 5,
                  marginRight: 5,
                  cursor: "pointer"
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Input label="Fleischstück" value={meat} onChange={setMeat} />
        <Input label="Dicke (cm)" value={meatThickness} onChange={setMeatThickness} />
        <Input label="Gewicht (g)" value={meatWeight} onChange={setMeatWeight} />
        <Input label="Zutaten" value={ingredients} onChange={setIngredients} />

        <Toggle label="SizzleZone verwenden?" value={sizzleZone} setValue={setSizzleZone} />
        <Toggle label="Fleischthermometer?" value={thermometer} setValue={setThermometer} />

        <label>Garstufe: {donenessLevels[doneness]}</label>
        <input type="range" min={0} max={4} value={doneness} onChange={e => setDoneness(+e.target.value)} style={{ width: "100%" }} />

        <button onClick={fetchRecipe} style={{ width: "100%", padding: 10, marginTop: 20, backgroundColor: "#ff5722", color: "#fff", border: "none", borderRadius: 5 }}>
          🍽️ Rezept generieren
        </button>

        {loading && <p>⏳ Lädt...</p>}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}
        {recipe && <pre style={{ background: "#f0f0f0", padding: 15, borderRadius: 8, whiteSpace: "pre-wrap" }}>{recipe}</pre>}
        {imageUrl && <img src={imageUrl} style={{ width: "100%", borderRadius: 8, marginTop: 15 }} />}
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 15 }}>
    <label>{label}</label>
    <input 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      style={{
        width: "100%", 
        padding: 10, 
        borderRadius: 5, 
        border: "1px solid #ccc",
        marginTop: 5, 
        boxSizing: "border-box"
      }} 
    />
  </div>
);

const Toggle = ({ label, value, setValue }) => (
  <div style={{ marginBottom: 15 }}>
    <label>{label}</label><br />
    <div style={{ display: "flex", marginTop: 5 }}>
      <button 
        onClick={() => setValue('ja')} 
        style={{
          flex: 1,
          padding: 5, 
          background: value === 'ja' ? '#4caf50' : '#ddd', 
          color: "#fff", 
          border: "none", 
          borderRadius: 5, 
          marginRight: 5
        }}
      >
        Ja
      </button>
      <button 
        onClick={() => setValue('nein')} 
        style={{
          flex: 1,
          padding: 5, 
          background: value === 'nein' ? '#f44336' : '#ddd', 
          color: "#fff", 
          border: "none", 
          borderRadius: 5
        }}
      >
        Nein
      </button>
    </div>
  </div>
);
