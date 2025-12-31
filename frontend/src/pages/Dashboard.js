import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [boxStatus, setBoxStatus] = useState({ online: true });
  const [nextIntake, setNextIntake] = useState(null);
  const [alertActive, setAlertActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // Rafraîchir toutes les secondes pour une mise à jour en temps réel
    const interval = setInterval(loadDashboardData, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const clientId = localStorage.getItem("clientId");
      console.log("ClientId:", clientId); // Debug
      const response = await api.getNextIntake(clientId);
      console.log('Données API reçues:', response.data); // Debug
      
      if (response.data && response.data.nextIntake && response.data.nextIntake.medicine) {
        setNextIntake(response.data.nextIntake);
      } else {
        // Données par défaut si l'API ne retourne rien
        setNextIntake({
          medicine: 'Aucun médicament',
          time: '--:--',
          countdown: '00:00:00'
        });
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
      // En cas d'erreur, afficher des données par défaut
      setNextIntake({
        medicine: 'Erreur de chargement',
        time: '--:--',
        countdown: '00:00:00'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = () => {
    setAlertActive(!alertActive);
  };

  const chartData = {
    labels: ['10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [
      {
        label: 'Tension',
        data: [105, 115, 110, 115, 105],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4
      },
      {
        label: 'Pulsations',
        data: [82, 85, 84, 82, 85],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Statut Medical Box */}
        <div className="card status-card">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#374151'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: '#10B981'
            }}>
              ✓
            </div>
            <h3 style={{ margin: 0, fontWeight: 600 }}>Statut Medical Box</h3>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            padding: '1rem 0'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              flexShrink: 0
            }}>
              ✓
            </div>
            <div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: 700, 
                color: '#10B981', 
                margin: '0 0 0.25rem 0',
                lineHeight: 1
              }}>
                En Ligne
              </h2>
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6B7280', 
                margin: 0 
              }}>
                Dispositif connecté
              </p>
            </div>
          </div>
        </div>

        {/* Prochaine Prise */}
        <div className="card next-intake-card">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: '#374151',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                💊
              </div>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Prochaine prise</h3>
            </div>
            <button
              onClick={loadDashboardData}
              style={{
                padding: '0.4rem 0.75rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}
            >
              Rafraîchir
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #E5E7EB',
                borderTopColor: '#3B82F6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              Chargement...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Médicament */}
              <div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: '#6B7280', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  Médicament :
                </p>
                <div style={{
                  padding: '0.875rem 1rem',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  color: '#1E40AF',
                  fontWeight: 500,
                  minHeight: '45px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {nextIntake?.medicine || 'Aucun médicament'}
                </div>
              </div>

              {/* Heure */}
              <div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: '#6B7280', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  Heure :
                </p>
                <div style={{
                  padding: '0.875rem 1rem',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  color: '#1E40AF',
                  fontWeight: 500,
                  minHeight: '45px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {nextIntake?.time || '--:--'}
                </div>
              </div>

              {/* Prochaine prise dans */}
              <div>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: '#6B7280', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  {nextIntake?.isPassee ? 'Prise il y a :' : 'Prochaine prise dans :'}
                </p>
                <div style={{
                  padding: '1rem',
                  background: nextIntake?.isPassee ? '#FEE2E2' : '#F9FAFB',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: nextIntake?.isPassee ? '#991B1B' : '#374151',
                  fontFamily: '"Courier New", monospace',
                  letterSpacing: '0.05em'
                }}>
                  {nextIntake?.countdown || '00:00:00'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'alerte */}
      <div className="alert-buttons">
        <button 
          className={`btn btn-success ${alertActive ? 'active' : ''}`}
          onClick={toggleAlert}
        >
          Activer alerte
        </button>
        <button 
          className={`btn btn-danger ${!alertActive ? 'active' : ''}`}
          onClick={toggleAlert}
        >
          Désactiver alerte
        </button>
      </div>

      {/* Graphique */}
      <div className="card chart-card">
        <h3>Aperçu des Mesures</h3>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Animation pour le spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;