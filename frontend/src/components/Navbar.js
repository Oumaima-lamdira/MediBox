import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const clientName = localStorage.getItem("clientName") || "Utilisateur";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = () => {
    // Supprimer toutes les données de session
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("rememberMe");

    // Rediriger vers la page de connexion
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
          {/* Logo croix médicale */}
          <div style={{ position: "relative", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Barre verticale - vert clair */}
            <div
              style={{
                position: "absolute",
                width: "12px",
                height: "32px",
                background: "#85CE61",
                borderRadius: "6px",
                zIndex: 2,
              }}
            ></div>
            {/* Barre horizontale - bleu */}
            <div
              style={{
                position: "absolute",
                width: "32px",
                height: "12px",
                background: "#1890FF",
                borderRadius: "6px",
                zIndex: 1,
              }}
            ></div>
          </div>
          <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0052CC", letterSpacing: "0.5px" }}>MEDIBOX</span>
        </div>

        <ul className="nav-menu">
          <li>
            <Link to="/profile" className={isActive("/profile")}>
              Mon Profil
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive("/dashboard")}>
              Tableau de Bord
            </Link>
          </li>
          <li>
            <Link to="/realtime" className={isActive("/realtime")}>
              Temps réel
            </Link>
          </li>
          <li>
            <Link to="/control" className={isActive("/control")}>
              Commande à distance
            </Link>
          </li>
          <li>
            <Link to="/stats" className={isActive("/stats")}>
              Graphiques & Alertes
            </Link>
          </li>
        </ul>

        <div className="nav-user">
          <span className="user-name">Bonjour, {clientName.split(" ")[0]}</span>
          <div
            className="user-avatar"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            {initials}

            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{initials}</div>
                  <div>
                    <h4>{clientName}</h4>
                    <p>Patient</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/dashboard");
                  }}
                >
                  Mon Dashboard
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    // TODO: Implémenter la page de profil
                  }}
                >
                  Paramètres
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-name {
          margin-right: 0.75rem;
          font-weight: 500;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 250px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .dropdown-header h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }

        .dropdown-header p {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0.25rem 0;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.875rem;
          color: #374151;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: #fee2e2;
        }

        .dropdown-icon {
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .user-name {
            display: none;
          }

          .user-dropdown {
            right: -1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
