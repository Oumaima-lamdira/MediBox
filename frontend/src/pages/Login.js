import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Utiliser l'API de login du backend
      const response = await api.login(formData.email, formData.password);
      
      if (response.data.success) {
        const client = response.data.client;
        
        setMessage({
          type: "success",
          text: "Connexion réussie ! Redirection...",
        });

        // Stocker les informations de l'utilisateur
        localStorage.setItem("clientId", client.id_client);
        localStorage.setItem("clientName", client.nom);
        localStorage.setItem("clientEmail", client.email);
        localStorage.setItem("isAuthenticated", "true");

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        // Rediriger vers le dashboard après 1.5 secondes
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Email ou mot de passe incorrect",
        });
      }
    } catch (error) {
      console.error("Erreur connexion:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Email ou mot de passe incorrect. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Bienvenue</h1>
          <p>Connectez-vous pour accéder à votre tableau de bord</p>

          <div className="auth-stats">
            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <h3>98%</h3>
                <p>Taux de réussite</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>15K+</h3>
                <p>Utilisateurs actifs</p>
              </div>
            </div>
          </div>

          <div className="auth-quote">
            <p>
              "MediBox a changé ma vie. Je ne manque plus jamais mes médicaments
              !"
            </p>
            <span>- Marie L., 72 ans</span>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Connexion</h2>
            <p className="auth-subtitle">Accédez à votre compte MediBox</p>

            {message && (
              <div className={`auth-message ${message.type}`}>
                <span className="message-icon">
                  {message.type === "success" ? "✓" : "⚠"}
                </span>
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="jean.dupont@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#forgot" className="forgot-link">
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Vous n'avez pas de compte ?{" "}
                <Link to="/register" className="auth-link">
                  Créer un compte
                </Link>
              </p>
            </div>

            <div className="auth-divider">
              <span>ou</span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>

            <div className="demo-notice">
              <span className="notice-icon">ℹ️</span>
              <p>
                <strong>Mode démo :</strong> Entrez n'importe quel email pour
                tester l'application
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
