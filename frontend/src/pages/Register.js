import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    age: "",
    contact_urgence: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

    // Validation nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation âge
    if (!formData.age) {
      newErrors.age = "L'âge est requis";
    } else if (formData.age < 18 || formData.age > 120) {
      newErrors.age = "L'âge doit être entre 18 et 120 ans";
    }

    // Validation contact d'urgence
    if (!formData.contact_urgence.trim()) {
      newErrors.contact_urgence = "Le contact d'urgence est requis";
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.contact_urgence)) {
      newErrors.contact_urgence = "Format de téléphone invalide";
    }

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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
      // Créer le client dans la base de données
      const clientData = {
        nom: formData.nom,
        age: parseInt(formData.age),
        contact_urgence: formData.contact_urgence,
      };

      const response = await api.createClient(clientData);

      // Simuler la création d'un compte utilisateur (à implémenter côté backend)
      // TODO: Ajouter une vraie authentification JWT

      setMessage({
        type: "success",
        text: "Compte créé avec succès ! Redirection...",
      });

      // Stocker l'ID du client
      localStorage.setItem("clientId", response.data.id_client);
      localStorage.setItem("clientName", response.data.nom);

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erreur inscription:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Erreur lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          {/* TITRE ET SOUS-TITRE REMONTES */}
          <h1>Créer votre compte</h1>
          <p>Commencez à gérer vos médicaments intelligemment</p>

          {/* IMAGE DU DOCTEUR */}
          <div className="auth-doctor-image">
            <img 
              src={`${process.env.PUBLIC_URL}/doc.png`} 
              alt="Médecin professionnel" 
            />
          </div>

          {/* FEATURES SUPPRIMEES */}
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Inscription</h2>
            <p className="auth-subtitle">
              Créez votre compte en quelques secondes
            </p>

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
                <label htmlFor="nom">Nom complet *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={errors.nom ? "error" : ""}
                  placeholder="Jean Dupont"
                  disabled={loading}
                />
                {errors.nom && <span className="error-text">{errors.nom}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Âge *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={errors.age ? "error" : ""}
                    placeholder="65"
                    min="18"
                    max="120"
                    disabled={loading}
                  />
                  {errors.age && (
                    <span className="error-text">{errors.age}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="contact_urgence">Contact d'urgence *</label>
                  <input
                    type="tel"
                    id="contact_urgence"
                    name="contact_urgence"
                    value={formData.contact_urgence}
                    onChange={handleChange}
                    className={errors.contact_urgence ? "error" : ""}
                    placeholder="+33 6 12 34 56 78"
                    disabled={loading}
                  />
                  {errors.contact_urgence && (
                    <span className="error-text">{errors.contact_urgence}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="jean.dupont@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="••••••••"
                  disabled={loading}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="••••••••"
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? "Création en cours..." : "Créer mon compte"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="auth-link">
                  Se connecter
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;