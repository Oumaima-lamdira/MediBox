import React from "react";

const HeroMockup = () => {
  return (
    <svg
      viewBox="0 0 1200 750"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "auto",
        filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.2))",
      }}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f0f8" stopOpacity="1" />
          <stop offset="100%" stopColor="#d0e0f0" stopOpacity="1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="1200" height="750" fill="url(#bgGradient)" />

      {/* Decorative circles */}
      <circle cx="1100" cy="100" r="120" fill="#1890ff" opacity="0.08" />
      <circle cx="100" cy="700" r="100" fill="#10b981" opacity="0.08" />

      {/* ===== MACBOOK PRO ===== */}
      <g filter="url(#shadow)">
        {/* Screen bezel - outer dark frame */}
        <rect x="350" y="80" width="750" height="480" fill="#2d3748" rx="28" />

        {/* Screen bezel - inner lighter frame */}
        <rect x="365" y="95" width="720" height="450" fill="#4a5568" rx="24" />

        {/* Actual screen */}
        <rect x="375" y="105" width="700" height="430" fill="#ffffff" rx="20" />

        {/* Top bar with traffic lights */}
        <rect x="375" y="105" width="700" height="50" fill="#f5f7fa" rx="20" />

        {/* Traffic lights */}
        <circle cx="400" cy="130" r="6" fill="#ff5f56" />
        <circle cx="425" cy="130" r="6" fill="#ffbd2e" />
        <circle cx="450" cy="130" r="6" fill="#27c93f" />

        {/* URL bar */}
        <rect x="480" y="120" width="560" height="20" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <text x="495" y="133" fontSize="11" fill="#9ca3af" fontFamily="monospace">
          localhost:3000/dashboard
        </text>

        {/* Main content area */}
        <rect x="375" y="155" width="700" height="380" fill="#f8f9fa" />

        {/* Header/Navbar */}
        <rect x="375" y="155" width="700" height="55" fill="white" stroke="#e5e7eb" strokeWidth="1" />

        {/* Logo */}
        <rect x="395" y="168" width="12" height="12" fill="#10b981" rx="2" />
        <rect x="403" y="168" width="12" height="12" fill="#1890ff" rx="2" />
        <text x="425" y="180" fontSize="16" fontWeight="700" fill="#1890ff">
          MEDIBOX
        </text>

        {/* Nav items */}
        <text x="600" y="180" fontSize="12" fill="#9ca3af">
          Accueil
        </text>
        <text x="700" y="180" fontSize="12" fill="#9ca3af">
          Fonctionnalités
        </text>
        <text x="820" y="180" fontSize="12" fill="#9ca3af">
          Support
        </text>
        <text x="920" y="180" fontSize="12" fill="#9ca3af">
          Bonjour, Jean
        </text>

        {/* Left card - Status */}
        <rect x="395" y="225" width="300" height="140" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" rx="12" />

        {/* Status icon */}
        <circle cx="420" cy="250" r="14" fill="#10b981" />
        <text x="416" y="256" fontSize="18" fontWeight="700" fill="white">
          ✓
        </text>

        {/* Status text */}
        <text x="445" y="255" fontSize="13" fontWeight="700" fill="#0d1b2a">
          Statut Medical Box
        </text>

        {/* Big status circle */}
        <circle cx="420" cy="310" r="28" fill="#10b981" />
        <text x="410" y="320" fontSize="32" fontWeight="700" fill="white">
          ✓
        </text>

        {/* Status label */}
        <text x="465" y="310" fontSize="14" fontWeight="700" fill="#0d1b2a">
          En Ligne
        </text>
        <text x="465" y="328" fontSize="11" fill="#6b7280">
          Dispositif connecté
        </text>

        {/* Right card - Next intake */}
        <rect x="715" y="225" width="340" height="140" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" rx="12" />

        {/* Next intake icon */}
        <text x="735" y="250" fontSize="16">
          💊
        </text>
        <text x="760" y="255" fontSize="13" fontWeight="700" fill="#92400e">
          Prochaine prise
        </text>

        {/* Medicine info */}
        <text x="735" y="280" fontSize="11" fill="#0d1b2a">
          Médicament: Doliprane 500mg
        </text>
        <text x="735" y="300" fontSize="11" fill="#0d1b2a">
          Heure: 15:30
        </text>

        {/* Countdown */}
        <text x="735" y="335" fontSize="28" fontWeight="700" fill="#1890ff" fontFamily="monospace">
          00:12:45
        </text>

        {/* Chart section */}
        <rect x="395" y="380" width="660" height="130" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" rx="12" />

        {/* Chart title */}
        <text x="415" y="400" fontSize="12" fontWeight="700" fill="#0d1b2a">
          Aperçu des Mesures
        </text>

        {/* Chart grid lines */}
        <line x1="415" y1="420" x2="1035" y2="420" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="415" y1="440" x2="1035" y2="440" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="415" y1="460" x2="1035" y2="460" stroke="#e5e7eb" strokeWidth="1" />

        {/* Chart line 1 - Blue (Tension) */}
        <polyline
          points="430,450 480,425 530,440 580,410 630,435 680,420 730,445 780,430"
          fill="none"
          stroke="#1890ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Chart line 2 - Green (Pulsations) */}
        <polyline
          points="430,460 480,440 530,455 580,430 630,450 680,435 730,460 780,445"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Chart dots */}
        <circle cx="430" cy="450" r="3" fill="#1890ff" />
        <circle cx="480" cy="425" r="3" fill="#1890ff" />
        <circle cx="530" cy="440" r="3" fill="#1890ff" />
        <circle cx="580" cy="410" r="3" fill="#1890ff" />
        <circle cx="630" cy="435" r="3" fill="#1890ff" />
        <circle cx="680" cy="420" r="3" fill="#1890ff" />
        <circle cx="730" cy="445" r="3" fill="#1890ff" />
        <circle cx="780" cy="430" r="3" fill="#1890ff" />

        {/* Buttons */}
        <rect x="395" y="490" width="140" height="40" fill="#10b981" rx="6" />
        <text x="465" y="515" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">
          Activer alerte
        </text>

        <rect x="555" y="490" width="140" height="40" fill="#ef4444" rx="6" />
        <text x="625" y="515" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">
          Désactiver alerte
        </text>

        {/* MacBook stand */}
        <path
          d="M 380 545 L 420 580 L 1020 580 L 1060 545"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* MacBook bottom */}
        <rect x="350" y="580" width="750" height="20" fill="#9ca3af" rx="4" />
      </g>

      {/* ===== DOCTOR CHARACTER ===== */}
      <g filter="url(#shadow)">
        {/* Doctor body - animated floating */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-20; 0,0"
            dur="3s"
            repeatCount="indefinite"
          />
          
          {/* Head */}
          <circle cx="1050" cy="280" r="35" fill="#f4a460" />

          {/* Hair - more detailed */}
          <path d="M 1015 260 Q 1050 240 1085 260 Q 1080 250 1050 245 Q 1020 250 1015 260" fill="#8B4513" />
          <path d="M 1020 265 Q 1050 255 1080 265" fill="#A0522D" opacity="0.6" />

          {/* Eyes */}
          <circle cx="1040" cy="275" r="5" fill="#fff" />
          <circle cx="1060" cy="275" r="5" fill="#fff" />
          <circle cx="1040" cy="275" r="3" fill="#4a90e2" />
          <circle cx="1060" cy="275" r="3" fill="#4a90e2" />
          <circle cx="1041" cy="274" r="1.5" fill="#000" />
          <circle cx="1061" cy="274" r="1.5" fill="#000" />

          {/* Eyebrows */}
          <path d="M 1035 268 Q 1040 266 1045 268" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 1055 268 Q 1060 266 1065 268" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Nose */}
          <line x1="1050" y1="275" x2="1050" y2="285" stroke="#d4956f" strokeWidth="1.5" />

          {/* Smile - animated */}
          <path d="M 1040 290 Q 1050 296 1060 290" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round">
            <animate
              attributeName="d"
              values="M 1040 290 Q 1050 296 1060 290; M 1040 290 Q 1050 298 1060 290; M 1040 290 Q 1050 296 1060 290"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>

          {/* Doctor coat - white with gradient effect */}
          <rect x="1010" y="315" width="80" height="100" fill="url(#coatGradient)" stroke="#d0d0d0" strokeWidth="2" rx="8" />

          {/* Coat lapels */}
          <path d="M 1030 315 L 1025 360" stroke="#e0e0e0" strokeWidth="1.5" fill="none" />
          <path d="M 1070 315 L 1075 360" stroke="#e0e0e0" strokeWidth="1.5" fill="none" />

          {/* Blue shirt under coat */}
          <rect x="1035" y="320" width="30" height="50" fill="#4a90e2" rx="4" />

          {/* Coat buttons - animated glow */}
          <g>
            <circle cx="1050" cy="330" r="4" fill="#1890ff">
              <animate
                attributeName="r"
                values="4; 6; 4"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6; 1; 0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1050" cy="350" r="4" fill="#1890ff">
              <animate
                attributeName="r"
                values="4; 6; 4"
                dur="2s"
                repeatCount="indefinite"
                begin="0.3s"
              />
              <animate
                attributeName="opacity"
                values="0.6; 1; 0.6"
                dur="2s"
                repeatCount="indefinite"
                begin="0.3s"
              />
            </circle>
            <circle cx="1050" cy="370" r="4" fill="#1890ff">
              <animate
                attributeName="r"
                values="4; 6; 4"
                dur="2s"
                repeatCount="indefinite"
                begin="0.6s"
              />
              <animate
                attributeName="opacity"
                values="0.6; 1; 0.6"
                dur="2s"
                repeatCount="indefinite"
                begin="0.6s"
              />
            </circle>
          </g>

          {/* Stethoscope - more detailed */}
          <path d="M 1020 340 Q 1000 330 990 350" stroke="#e74c3c" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="990" cy="350" r="6" fill="#e74c3c" />
          <circle cx="990" cy="350" r="3" fill="#c0392b" />

          {/* Left arm - animated wave */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 1007 320; -15 1007 320; 0 1007 320"
              dur="2s"
              repeatCount="indefinite"
            />
            <rect x="1000" y="320" width="15" height="60" fill="#f4a460" rx="7" />
            {/* Left hand */}
            <circle cx="1007" cy="385" r="8" fill="#f4a460" />
            {/* Fingers */}
            <line x1="1003" y1="390" x2="1000" y2="395" stroke="#f4a460" strokeWidth="2" strokeLinecap="round" />
            <line x1="1007" y1="392" x2="1007" y2="398" stroke="#f4a460" strokeWidth="2" strokeLinecap="round" />
            <line x1="1011" y1="390" x2="1014" y2="395" stroke="#f4a460" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Right arm - animated pointing */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 1102 320; 10 1102 320; 0 1102 320"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <rect x="1095" y="320" width="15" height="60" fill="#f4a460" rx="7" />
            {/* Right hand */}
            <circle cx="1102" cy="385" r="8" fill="#f4a460" />
            {/* Pointing finger */}
            <line x1="1102" y1="377" x2="1115" y2="360" stroke="#f4a460" strokeWidth="3" strokeLinecap="round" />
            <circle cx="1115" cy="360" r="3" fill="#f4a460" />
          </g>

          {/* Legs */}
          <rect x="1025" y="415" width="12" height="50" fill="#333" rx="6" />
          <rect x="1053" y="415" width="12" height="50" fill="#333" rx="6" />

          {/* Shoes - with shine */}
          <ellipse cx="1031" cy="470" rx="10" ry="8" fill="#000" />
          <ellipse cx="1031" cy="468" rx="6" ry="3" fill="#333" opacity="0.5" />
          <ellipse cx="1059" cy="470" rx="10" ry="8" fill="#000" />
          <ellipse cx="1059" cy="468" rx="6" ry="3" fill="#333" opacity="0.5" />
        </g>

        {/* Speech bubble - animated */}
        <g>
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            dur="3s"
            repeatCount="indefinite"
          />
          <rect x="1000" y="200" width="140" height="50" fill="#1890ff" rx="8" />
          <polygon points="1020,250 1010,265 1030,255" fill="#1890ff" />
          <text x="1070" y="230" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">
            Gérez vos
          </text>
          <text x="1070" y="245" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">
            médicaments !
          </text>
        </g>

        {/* Pulse animation around doctor */}
        <g opacity="0.3">
          <circle cx="1050" cy="350" r="60" fill="none" stroke="#1890ff" strokeWidth="2">
            <animate
              attributeName="r"
              values="60; 75; 60"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3; 0; 0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
      <g filter="url(#shadow)">
        {/* Phone body - black */}
        <rect x="80" y="200" width="220" height="480" fill="#1f2937" rx="40" />

        {/* Screen */}
        <rect x="100" y="225" width="180" height="430" fill="white" rx="32" />

        {/* Notch */}
        <rect x="130" y="225" width="120" height="35" fill="#1f2937" rx="18" />

        {/* Status bar */}
        <rect x="100" y="225" width="180" height="35" fill="#f8f9fa" />
        <text x="260" y="250" fontSize="9" fill="#6b7280" fontWeight="600">
          9:41
        </text>

        {/* Header - Blue */}
        <rect x="100" y="260" width="180" height="50" fill="#1890ff" rx="4" />
        <text x="190" y="292" fontSize="13" fontWeight="700" fill="white" textAnchor="middle">
          MEDIBOX
        </text>

        {/* Status badge */}
        <rect x="115" y="325" width="150" height="45" fill="#d1fae5" stroke="#86efac" strokeWidth="2" rx="10" />
        <circle cx="135" cy="348" r="7" fill="#10b981" />
        <text x="190" y="352" fontSize="12" fontWeight="700" fill="#065f46" textAnchor="middle">
          En Ligne
        </text>

        {/* Next dose card */}
        <rect x="115" y="385" width="150" height="60" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" rx="10" />
        <text x="190" y="403" fontSize="10" fontWeight="700" fill="#92400e" textAnchor="middle">
          Prochaine prise
        </text>
        <text x="190" y="432" fontSize="20" fontWeight="700" fill="#1890ff" textAnchor="middle">
          00:12:45
        </text>

        {/* Today's medicines */}
        <rect x="115" y="460" width="150" height="80" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" rx="10" />
        <text x="190" y="478" fontSize="10" fontWeight="700" fill="#0c4a6e" textAnchor="middle">
          Prises du jour
        </text>

        {/* Medicine item 1 */}
        <rect x="120" y="490" width="140" height="20" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <circle cx="130" cy="500" r="5" fill="#10b981" />
        <text x="138" y="503" fontSize="8" fill="#0d1b2a">
          09:00 - Doliprane
        </text>

        {/* Medicine item 2 */}
        <rect x="120" y="515" width="140" height="20" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4" />
        <circle cx="130" cy="525" r="5" fill="#f59e0b" />
        <text x="138" y="528" fontSize="8" fill="#0d1b2a">
          15:30 - Aspirin
        </text>

        {/* Bottom buttons */}
        <rect x="115" y="555" width="70" height="32" fill="#10b981" rx="6" />
        <text x="150" y="576" fontSize="9" fontWeight="700" fill="white" textAnchor="middle">
          Activer
        </text>

        <rect x="195" y="555" width="70" height="32" fill="#ef4444" rx="6" />
        <text x="230" y="576" fontSize="9" fontWeight="700" fill="white" textAnchor="middle">
          Désactiver
        </text>

        {/* Home indicator */}
        <rect x="140" y="665" width="50" height="4" fill="#1f2937" rx="2" />
      </g>
    </svg>
  );
};

export default HeroMockup;
