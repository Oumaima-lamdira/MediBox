import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiBell, FiLock, FiClock, FiUsers, FiBox, FiMonitor, FiSmartphone } from "react-icons/fi";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navigation Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
              {/* Green vertical bar */}
              <rect x="16" y="8" width="8" height="32" fill="#85CE61" rx="2" />
              {/* Blue horizontal bar */}
              <rect x="8" y="20" width="32" height="8" fill="#1890ff" rx="2" />
            </svg>
            <span className="logo-text">MEDIBOX</span>
          </div>
          <nav className="nav-menu">
            <a href="#accueil" className="nav-link active">Accueil</a>
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#support" className="nav-link">Support</a>
          </nav>
          <button className="btn-login" onClick={() => navigate("/login")}>
            🌐 Se Connecter
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="accueil">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bienvenue sur <span className="highlight">MediBox</span>
            </h1>
            <p className="hero-subtitle-main">
              Ne manquez plus jamais vos médicaments
            </p>
            <p className="hero-description">
              MediBox est votre assistant intelligent pour gérer vos prises de médicaments. Rappels automatiques, suivi en temps réel et tranquillité d'esprit pour vous et vos proches.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary-large"
                onClick={() => navigate("/register")}
              >
                Découvrir la plateforme
              </button>
              <button
                className="btn btn-secondary-large"
                onClick={() => navigate("/login")}
              >
                Se connecter
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="/medibox-mockup.png" 
              alt="MediBox Dashboard et Application Mobile" 
              className="hero-mockup-image"
            />
             <img 
        src="/doctor.png" 
        alt="Médecin professionnel" 
        className="doctor-image"
      />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Tout ce dont vous avez besoin</h2>
            <p>Une solution complète pour gérer vos médicaments intelligemment</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon">
                <FiClock size={48} />
              </div>
              <h3>Rappels Automatiques</h3>
              <p>Alarmes visuelles et sonores pour ne jamais oublier vos prises</p>
            </div>

            <div className="feature-card feature-card-2">
              <div className="feature-icon">
                <FiBarChart2 size={48} />
              </div>
              <h3>Suivi en Temps Réel</h3>
              <p>Dashboard interactif avec statistiques et historique complet</p>
            </div>

            <div className="feature-card feature-card-3">
              <div className="feature-icon">
                <FiUsers size={48} />
              </div>
              <h3>Surveillance à Distance</h3>
              <p>Vos proches peuvent suivre vos prises et recevoir des alertes</p>
            </div>

            <div className="feature-card feature-card-4">
              <div className="feature-icon">
                <FiBox size={48} />
              </div>
              <h3>Gestion des Stocks</h3>
              <p>Alertes automatiques quand il est temps de renouveler</p>
            </div>

            <div className="feature-card feature-card-5">
              <div className="feature-icon">
                <FiSmartphone size={48} />
              </div>
              <h3>Multi-plateforme</h3>
              <p>Accessible sur ordinateur, tablette et smartphone</p>
            </div>

            <div className="feature-card feature-card-6">
              <div className="feature-icon">
                <FiLock size={48} />
              </div>
              <h3>Sécurisé</h3>
              <p>Vos données de santé sont protégées et confidentielles</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Comment ça marche</span>
            <h2>Simple et efficace</h2>
            <p>Seulement 3 étapes pour commencer</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Créez votre compte</h3>
                <p>
                  Inscription rapide en 2 minutes. Ajoutez vos informations et
                  vos médicaments.
                </p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Configurez vos horaires</h3>
                <p>
                  Définissez les heures de prise pour chaque médicament. MediBox
                  s'occupe du reste.
                </p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Recevez vos rappels</h3>
                <p>
                  La boîte connectée vous alerte à chaque prise. Suivez votre
                  observance en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Témoignages</span>
            <h2>Ils nous font confiance</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Depuis que j'utilise MediBox, je n'oublie plus jamais mes
                médicaments. Ma fille peut suivre mes prises à distance, c'est
                rassurant pour nous deux."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <h4>Marie L.</h4>
                  <p>72 ans, Paris</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Interface très simple et efficace. Les statistiques m'aident à
                mieux comprendre mon observance et à discuter avec mon médecin."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">J</div>
                <div>
                  <h4>Jean D.</h4>
                  <p>65 ans, Lyon</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "En tant qu'infirmière, je recommande MediBox à tous mes
                patients. C'est un outil formidable pour améliorer
                l'observance."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div>
                  <h4>Sophie M.</h4>
                  <p>Infirmière</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à améliorer votre santé ?</h2>
            <p>
              Rejoignez des milliers d'utilisateurs qui ne manquent plus leurs
              médicaments
            </p>
            <button
              className="btn btn-primary btn-xl"
              onClick={() => navigate("/register")}
            >
              Créer mon compte gratuitement
            </button>
            <p className="cta-note">
              ✓ Sans engagement ✓ Gratuit ✓ Configuration en 2 min
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <h4>MediBox</h4>
              <p>
                Votre assistant intelligent pour ne jamais manquer vos
                médicaments.
              </p>
            </div>
            <div className="footer-col">
              <h5>Produit</h5>
              <ul>
                <li>
                  <a href="#features">Fonctionnalités</a>
                </li>
                <li>
                  <a href="#pricing">Tarifs</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Entreprise</h5>
              <ul>
                <li>
                  <a href="#about">À propos</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#privacy">Confidentialité</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Support</h5>
              <ul>
                <li>
                  <a href="#help">Centre d'aide</a>
                </li>
                <li>
                  <a href="#docs">Documentation</a>
                </li>
                <li>
                  <a href="mailto:support@medibox.com">support@medibox.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 MediBox. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;