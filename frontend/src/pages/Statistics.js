import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react"; // <-- ajouté
import { Bar, Doughnut } from "react-chartjs-2";
import { api } from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("today");
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    loadStatistics();
    loadHistory();
  }, [clientId]);

  const loadStatistics = async () => {
    try {
      const response = await api.getHistoriqueStats({ clientId });
      console.log("Stats:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("Erreur stats:", error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await api.getIntakeHistory(clientId);
      console.log("History:", response.data);
      setHistory(response.data);
    } catch (error) {
      console.error("Erreur history:", error);
    }
  };

  const barChartData = stats && stats.weeklyData
    ? {
        labels: stats.weeklyData.map((d) => d.day),
        datasets: (stats.medicaments || []).length > 0
          ? (stats.medicaments || []).map((med, index) => {
              const colors = [
                "rgb(37, 99, 235)",
                "rgb(16, 185, 129)",
                "rgb(239, 68, 68)",
                "rgb(245, 158, 11)",
                "rgb(168, 85, 247)",
                "rgb(236, 72, 153)",
              ];
              return {
                label: med,
                data: stats.weeklyData.map((d) => d[med] || 0),
                backgroundColor: colors[index % colors.length],
                borderRadius: 8,
              };
            })
          : [
              {
                label: "Aucun médicament",
                data: stats.weeklyData.map(() => 0),
                backgroundColor: "rgb(209, 213, 219)",
                borderRadius: 8,
              },
            ],
      }
    : null;

  const doughnutData = stats
    ? {
        labels: ["En attente", "Pris à temps", "En retard", "Oubliés"],
        datasets: [
          {
            data: [
              stats.details?.enAttente || 0,
              stats.taken || 0,
              stats.details?.enRetard || 0,
              stats.missed || 0
            ],
            backgroundColor: [
              "rgb(209, 213, 219)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)"
            ],
            borderWidth: 0,
          },
        ],
      }
    : null;

  const getAlertClass = (alert) => {
    const classes = {
      retard: "badge-warning",
      critique: "badge-danger",
      attention: "badge-info",
    };
    return classes[alert] || "badge-info";
  };

  const getAlertLabel = (alert) => {
    const labels = {
      retard: "Retard de prise",
      critique: "Prise critique",
      attention: "Attention",
    };
    return labels[alert] || alert;
  };

  return (
    <div className="statistics-page">
      {/* Filtres */}
      <div className="filter-bar">
        <span>Filtrer par Date</span>
        <input type="date" defaultValue="2024-04-14" />
        <span>-</span>
        <input type="date" defaultValue="2024-04-20" />
        <button className="btn btn-primary btn-sm">Filtrer</button>

        <div className="filter-quick">
          <button
            className={filter === "today" ? "active" : ""}
            onClick={() => setFilter("today")}
          >
            Aujourd'hui
          </button>
          <button
            className={filter === "week" ? "active" : ""}
            onClick={() => setFilter("week")}
          >
            Cette semaine
          </button>
          <button
            className={filter === "30days" ? "active" : ""}
            onClick={() => setFilter("30days")}
          >
            30 jours
          </button>
          <button
            className={filter === "90days" ? "active" : ""}
            onClick={() => setFilter("90days")}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* Performance Globale */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
              Taux d'observance
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#2563eb", marginBottom: "0.5rem" }}>
              {stats.successRate || 0}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              {stats.taken || 0} / {(stats.details?.total || 0) - (stats.details?.enAttente || 0)} prises
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
              Performance globale
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color:
                  stats.successRate >= 80
                    ? "#10b981"
                    : stats.successRate >= 60
                    ? "#f59e0b"
                    : "#ef4444",
                marginBottom: "0.5rem",
              }}
            >
              {stats.successRate || 0}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              Score moyen des prises
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
              Oublis
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#ef4444", marginBottom: "0.5rem" }}>
              {stats.missed || 0}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#999" }}>
              Prises oubliées
            </div>
          </div>

          {stats.details?.enRetard > 0 && (
            <div
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                En retard
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b", marginBottom: "0.5rem" }}>
                {stats.details?.enRetard || 0}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#999" }}>
                Prises avec retard
              </div>
            </div>
          )}
        </div>
      )}

      <div className="stats-grid">
        {/* Graphique des prises */}
        <div className="card chart-card">
          <h3>Prises par jour</h3>
          {barChartData && (
            <Bar
              data={barChartData}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          )}
        </div>

        {/* Taux de réussite */}
        <div className="card success-rate-card">
          <h3>Taux de Réussite</h3>
          <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>Répartition des prises du jour</p>
          {stats && doughnutData && (
            <div className="doughnut-container">
              <Doughnut
                data={doughnutData}
                options={{ responsive: true, cutout: "75%", plugins: { legend: { display: false } } }}
              />
              <div className="doughnut-center">
                <span className="percentage" style={{ fontSize: "2rem", fontWeight: "700", color: "#10b981" }}>{stats.details?.total || 0}</span>
                <span className="label" style={{ fontSize: "0.9rem", color: "#666" }}>Total</span>
              </div>
            </div>
          )}
          {stats && (
            <div className="legend-custom" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
              <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", background: "#d1d5db", borderRadius: "2px" }}></span>
                <span style={{ fontSize: "0.9rem" }}>En attente: {stats.details?.enAttente || 0}</span>
              </div>
              <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "2px" }}></span>
                <span style={{ fontSize: "0.9rem" }}>Pris à temps: {stats.taken || 0}</span>
              </div>
              <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", background: "#f59e0b", borderRadius: "2px" }}></span>
                <span style={{ fontSize: "0.9rem" }}>En retard: {stats?.details?.enRetard || 0}</span>
              </div>
              <div className="legend-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "2px" }}></span>
                <span style={{ fontSize: "0.9rem" }}>Oubliés: {stats?.missed || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="card alerts-card">
        <div className="alerts-header">
          <h3>Liste des Alertes</h3>
          <div className="alert-filters">
            <button className="filter-chip active">
              Toutes <span className="chip-count">12</span>
            </button>
            <button className="filter-chip">
              <span className="chip-dot warning"></span>
              Attention <span className="chip-count">3</span>
            </button>
            <button className="filter-chip">
              <span className="chip-dot danger"></span>
              Retard <span className="chip-count">8</span>
            </button>
            <button className="filter-chip">
              <span className="chip-dot critical"></span>
              Critique <span className="chip-count">1</span>
            </button>
          </div>
        </div>

        <table className="alerts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Médicament</th>
              <th>Alerte</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className="table-icon">📅</span>
                  {item.date}
                </td>
                <td>{item.time}</td>
                <td>
                  <span className="table-icon">💊</span>
                  {item.medicine}
                </td>
                <td>
                  <span className={`badge ${getAlertClass(item.alert)}`}>
                    ⚠ {getAlertLabel(item.alert)}
                  </span>
                  <span className="delay-time">{item.delay}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
