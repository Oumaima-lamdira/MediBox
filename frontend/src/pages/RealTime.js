import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { socket, connectSocket, disconnectSocket } from "../services/socket";

const RealTime = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [ledStatus, setLedStatus] = useState("correcte");
  const [todayPlannings, setTodayPlannings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    connectSocket();
    loadTodayPlannings();

    // Actualiser les plannings tous les 30 secondes
    const interval = setInterval(loadTodayPlannings, 30000);

    // Écoute les mises à jour de l'horloge
    socket.on("clock-update", (data) => {
      setCurrentTime(data.time);
    });

    return () => {
      disconnectSocket();
      clearInterval(interval);
    };
  }, []);

  const loadTodayPlannings = async () => {
    try {
      setLoading(true);
      const clientId = localStorage.getItem("clientId");
      const response = await api.getTodayPlannings({ clientId });
      setTodayPlannings(response.data || []);
    } catch (error) {
      console.error("Erreur:", error);
      setTodayPlannings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pris: { label: "Pris", color: "#10b981" },
      "en-attente": { label: "À prendre", color: "#f59e0b" },
      "en-retard": { label: "En retard", color: "#ef4444" },
      oublie: { label: "Oublié", color: "#ef4444" },
    };
    return badges[status] || badges["en-attente"];
  };

  return (
    <div style={{ padding: "2rem", background: "#f0f4f8", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        {/* Horloge */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <div style={{ fontSize: "3.5rem", fontWeight: "700", color: "#2563eb", fontFamily: "'Courier New'" }}>
            {currentTime || "00:00:00"}
          </div>
        </div>

        {/* Indicateur LED */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "1.5rem", fontWeight: "600" }}>Indicateur LED</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "6px solid #10b981",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
              }}
            >
              🟢
            </div>
            <div>
              <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></span>
                <span style={{ fontSize: "0.9rem" }}>Correcte</span>
              </div>
              <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></span>
                <span style={{ fontSize: "0.9rem" }}>À prendre</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></span>
                <span style={{ fontSize: "0.9rem" }}>Critique</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* État du Médicament */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", fontWeight: "600" }}>État du Médicament</h3>
        
        {/* Légende des couleurs */}
        <div
          style={{
            background: "#f9fafb",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            ></span>
            <span style={{ fontSize: "0.9rem", color: "#333" }}>Pris ✓</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid #f59e0b",
                background: "white",
              }}
            ></span>
            <span style={{ fontSize: "0.9rem", color: "#333" }}>À prendre ⏱</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid #ef4444",
                background: "white",
              }}
            ></span>
            <span style={{ fontSize: "0.9rem", color: "#333" }}>En retard / Oublié ⚠</span>
          </div>
        </div>

        {/* Boutons d'état */}
        {todayPlannings.length === 0 ? (
          <p style={{ color: "#999" }}>Aucune prise prévue aujourd'hui</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {todayPlannings.map((intake, index) => {
              const badge = getStatusBadge(intake.statut);
              const isTaken = intake.statut === "pris";
              return (
                <button
                  key={index}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: `2px solid ${badge.color}`,
                    background: isTaken ? badge.color : "white",
                    color: isTaken ? "white" : badge.color,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                  }}
                >
                  {isTaken ? "✓" : intake.statut === "en-attente" ? "⏱" : "⚠"} {intake.medicine} ({intake.time})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Prises du jour */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontWeight: "600" }}>Prises du jour</h3>
          <button
            onClick={loadTodayPlannings}
            style={{
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "500",
            }}
          >
            Actualiser
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#999", textAlign: "center", padding: "1rem" }}>Chargement...</p>
        ) : todayPlannings.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center", padding: "1rem" }}>
            Aucune prise prévue aujourd'hui
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {todayPlannings.map((intake, index) => {
              const badge = getStatusBadge(intake.statut);
              const performanceColor = 
                intake.performance === 1.0 ? "#10b981" :
                intake.performance >= 0.7 ? "#f59e0b" :
                intake.performance >= 0.5 ? "#f97316" :
                "#ef4444";
              
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    background: "#fafbfc",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🕐</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {intake.time}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      💊 {intake.medicine}
                    </div>
                    {intake.performance !== undefined && intake.performance !== null && (
                      <div style={{ fontSize: "0.8rem", color: performanceColor, marginTop: "0.25rem", fontWeight: "500" }}>
                        Performance: {(intake.performance * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                  {intake.countdown && (
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#fff3cd",
                        color: "#856404",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      ⏱ {intake.countdown}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "0.4rem 0.75rem",
                      background: badge.color,
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {badge.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTime;
