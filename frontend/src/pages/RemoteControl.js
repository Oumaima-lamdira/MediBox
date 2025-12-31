import { useEffect, useState } from "react";
import { api } from "../services/api";

const RemoteControl = () => {
  const [message, setMessage] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCommandHistory();
  }, []);

  const loadCommandHistory = async () => {
    try {
      const response = await api.getCommandHistory();
      setCommandHistory(response.data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleActivateBuzzer = async () => {
    setLoading(true);
    try {
      const response = await api.activateBuzzer();
      setMessage({
        type: "success",
        text: response.data.message,
      });
      loadCommandHistory();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de l'activation du buzzer",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleActivateLED = async () => {
    setLoading(true);
    try {
      const response = await api.activateLED();
      setMessage({
        type: "success",
        text: response.data.message,
      });
      loadCommandHistory();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de l'activation de la LED",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const getStatusIcon = (status) => {
    return status === "success" ? "✓" : "✗";
  };

  const getStatusClass = (status) => {
    return status === "success" ? "badge-success" : "badge-danger";
  };

  return (
    <div className="remote-control-page">
      <div className="control-grid">
        {/* Bouton Buzzer */}
        <div className="card control-card">
          <div className="control-icon buzzer-icon">
            <div className="buzzer-animation">🔔</div>
          </div>
          <button
            className="btn btn-danger btn-lg"
            onClick={handleActivateBuzzer}
            disabled={loading}
          >
            {loading ? "Activation..." : "Activer Buzzer"}
          </button>
        </div>

        {/* Bouton LED */}
        <div className="card control-card">
          <div className="control-icon led-icon">
            <div className="led-animation">💡</div>
          </div>
          <button
            className="btn btn-success btn-lg"
            onClick={handleActivateLED}
            disabled={loading}
          >
            {loading ? "Activation..." : "Activer LED"}
          </button>
        </div>
      </div>

      {/* Message de confirmation */}
      {message && (
        <div className={`alert alert-${message.type}`}>
          <span className="alert-icon">
            {message.type === "success" ? "✓" : "⚠"}
          </span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage(null)}>
            ✕
          </button>
        </div>
      )}

      {/* Historique des commandes */}
      <div className="card history-card">
        <h3>Historique des Commandes Récentes</h3>
        <table className="command-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Commande</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {commandHistory.map((cmd) => (
              <tr key={cmd.id}>
                <td>
                  <span className="table-icon">📅</span>
                  {cmd.date}
                </td>
                <td>{cmd.time}</td>
                <td>
                  <span className="command-icon">
                    {cmd.command.includes("LED") ? "💡" : "🔔"}
                  </span>
                  {cmd.command}
                </td>
                <td>
                  <span className={`badge ${getStatusClass(cmd.status)}`}>
                    {getStatusIcon(cmd.status)}{" "}
                    {cmd.status === "success" ? "Succès" : "Erreur"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RemoteControl;
