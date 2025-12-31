import { useState } from "react";
import { api } from "../services/api";

const MedicamentForm = ({ clientId, onAdded }) => {
  const [nom, setNom] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nom.trim()) {
      setError("Le nom du médicament est requis");
      return;
    }

    setLoading(true);
    try {
      await api.createMedicament({
        id_client: clientId,
        nom_medoc: nom.trim(),
        stock_actuel: Number(stock) || 0,
      });
      setSuccess("Médicament ajouté avec succès");
      setNom("");
      setStock("");
      setTimeout(() => setSuccess(""), 3000);
      if (onAdded) onAdded();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erreur lors de l'ajout";
      setError(errorMsg);
      console.error("Médicament form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem" }}>❌ {error}</div>}
      {success && <div style={{ color: "#10b981", fontSize: "0.85rem", marginBottom: "0.5rem" }}>✓ {success}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Nom du médicament"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        />
        <input
          type="number"
          placeholder="0"
          value={stock}
          min="0"
          onChange={(e) => setStock(e.target.value)}
          disabled={loading}
          style={{
            width: "60px",
            padding: "0.5rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1.25rem",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default MedicamentForm;
