import { useState, useEffect } from "react";
import { api } from "../services/api";

const defaultDays = [1, 2, 3, 4, 5];

const PlanningForm = ({ meds = [], defaultMedId = null, editingPlanning = null, onAdded }) => {
  const [medId, setMedId] = useState(defaultMedId || (meds[0] && meds[0].id_medoc) || "");
  const [time, setTime] = useState("09:00");
  const [jours, setJours] = useState(defaultDays);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editingPlanning) {
      setMedId(editingPlanning.id_medoc || "");
      setTime(editingPlanning.heure_prevue || "09:00");
      const joursArray = editingPlanning.jours_semaine
        ? editingPlanning.jours_semaine.split(",").map(Number)
        : defaultDays;
      setJours(joursArray);
    }
  }, [editingPlanning]);

  const toggleJour = (d) => {
    setJours((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!medId || !time || jours.length === 0) {
      setError("Veuillez remplir tous les champs et sélectionner au moins un jour");
      return;
    }

    setLoading(true);
    try {
      const joursStr = jours.join(",");
      
      if (editingPlanning) {
        // Mettre à jour le planning existant
        await api.updatePlanning(editingPlanning.id_planning, {
          heure_prevue: time,
          jours_semaine: joursStr,
          actif: true,
        });
        setSuccess("Planning modifié avec succès");
      } else {
        // Créer un nouveau planning
        await api.createPlanning({
          id_medoc: medId,
          heure_prevue: time,
          jours_semaine: joursStr,
        });
        setSuccess("Planning créé avec succès");
      }
      
      setTimeout(() => setSuccess(""), 3000);
      if (onAdded) onAdded();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Erreur lors de l'opération";
      setError(errorMsg);
      console.error("Planning form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem" }}>❌ {error}</div>}
      {success && <div style={{ color: "#10b981", fontSize: "0.85rem", marginBottom: "0.5rem" }}>✓ {success}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontWeight: "500", minWidth: "100px" }}>Médicament</label>
          <select
            value={medId}
            onChange={(e) => setMedId(e.target.value)}
            disabled={loading || editingPlanning}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
              cursor: loading || editingPlanning ? "not-allowed" : "pointer",
              background: editingPlanning ? "#f3f4f6" : "white",
            }}
          >
            <option value="">Sélectionnez un médicament</option>
            {meds.map((m) => (
              <option key={m.id_medoc} value={m.id_medoc}>
                {m.nom_medoc}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontWeight: "500", minWidth: "100px" }}>Heure prévue</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "0.9rem",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "500", marginBottom: "0.5rem", display: "block" }}>Jours</label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              [0, "Dim"],
              [1, "Lun"],
              [2, "Mar"],
              [3, "Mer"],
              [4, "Jeu"],
              [5, "Ven"],
              [6, "Sam"],
            ].map(([d, label]) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleJour(d)}
                disabled={loading}
                style={{
                  padding: "0.35rem 0.75rem",
                  background: jours.includes(d) ? "#4f46e5" : "#f3f4f6",
                  color: jours.includes(d) ? "white" : "#374151",
                  border: "none",
                  borderRadius: "6px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "500",
                  fontSize: "0.85rem",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            background: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
          }}
        >
          {loading ? (editingPlanning ? "Modification..." : "Création...") : (editingPlanning ? "Modifier le planning" : "Créer le planning")}
        </button>
      </form>
    </div>
  );
};

export default PlanningForm;
