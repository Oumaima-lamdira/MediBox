const http = require("http");

const API_URL = "http://localhost:5000/api";

// Fonction pour faire des requêtes HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║     🧪 TESTS API MEDIBOX               ║");
  console.log("╚════════════════════════════════════════╝\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    console.log("🔍 Test 1: Health Check");
    const res = await makeRequest("GET", "/health");
    if (res.status === 200 && res.data.status === "OK") {
      console.log("✅ PASS - Serveur actif\n");
      passed++;
    } else {
      console.log("❌ FAIL - Serveur non actif\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 2: Liste des clients
  try {
    console.log("🔍 Test 2: GET /clients");
    const res = await makeRequest("GET", "/clients");
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✅ PASS - ${res.data.length} client(s) trouvé(s)\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 3: Liste des médicaments
  try {
    console.log("🔍 Test 3: GET /medicaments");
    const res = await makeRequest("GET", "/medicaments");
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✅ PASS - ${res.data.length} médicament(s) trouvé(s)\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 4: Liste des plannings
  try {
    console.log("🔍 Test 4: GET /plannings");
    const res = await makeRequest("GET", "/plannings");
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✅ PASS - ${res.data.length} planning(s) trouvé(s)\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 5: Plannings du jour
  try {
    console.log("🔍 Test 5: GET /plannings/today");
    const res = await makeRequest("GET", "/plannings/today");
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✅ PASS - ${res.data.length} planning(s) aujourd'hui\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 6: Prochaine prise
  try {
    console.log("🔍 Test 6: GET /plannings/next");
    const res = await makeRequest("GET", "/plannings/next");
    if (res.status === 200) {
      if (res.data.medicine) {
        console.log(
          `✅ PASS - Prochaine prise: ${res.data.medicine} à ${res.data.time}\n`
        );
      } else {
        console.log("✅ PASS - Aucune prise prévue\n");
      }
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 7: Historiques
  try {
    console.log("🔍 Test 7: GET /historiques");
    const res = await makeRequest("GET", "/historiques");
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log(`✅ PASS - ${res.data.length} entrée(s) d'historique\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 8: Statistiques
  try {
    console.log("🔍 Test 8: GET /historiques/stats");
    const res = await makeRequest("GET", "/historiques/stats");
    if (res.status === 200 && res.data.successRate !== undefined) {
      console.log(`✅ PASS - Taux de réussite: ${res.data.successRate}%\n`);
      passed++;
    } else {
      console.log("❌ FAIL - Mauvaise réponse\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 9: Activer Buzzer
  try {
    console.log("🔍 Test 9: POST /commands/buzzer");
    const res = await makeRequest("POST", "/commands/buzzer");
    if (res.status === 200 && res.data.success) {
      console.log("✅ PASS - Buzzer activé\n");
      passed++;
    } else {
      console.log("❌ FAIL - Erreur activation\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Test 10: Activer LED
  try {
    console.log("🔍 Test 10: POST /commands/led");
    const res = await makeRequest("POST", "/commands/led");
    if (res.status === 200 && res.data.success) {
      console.log("✅ PASS - LED activée\n");
      passed++;
    } else {
      console.log("❌ FAIL - Erreur activation\n");
      failed++;
    }
  } catch (e) {
    console.log("❌ FAIL - Erreur:", e.message, "\n");
    failed++;
  }

  // Résumé
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║         📊 RÉSUMÉ DES TESTS            ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  ✅ Tests réussis   : ${passed}/10            ║`);
  console.log(`║  ❌ Tests échoués   : ${failed}/10            ║`);
  console.log("╚════════════════════════════════════════╝\n");

  if (failed === 0) {
    console.log("🎉 Tous les tests sont passés avec succès !\n");
  } else {
    console.log(
      "⚠️  Certains tests ont échoué. Vérifiez votre configuration.\n"
    );
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Lancer les tests
runTests().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});
