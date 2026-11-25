/* KIZ – Pied de page, conditions, mentions légales, support, case 18+ à l’inscription
   À charger après kiz-menu.js : <script src="kiz-legal.js" defer></script> */
(function(){

/* ====== À REMPLIR ======
   whatsapp : numéro avec indicatif, chiffres seulement (ex : "50937000000")
   email    : adresse de support (ex : "support@tondomaine.com")
   Laisse vide ("") ce que tu n’utilises pas. */
const SUPPORT = { whatsapp: "", email: "" };
const UPDATED = "24 novembre 2026";
/* ======================== */

const $ = id => document.getElementById(id);
const E = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const st = document.createElement("style");
st.textContent = `
#klFoot{max-width:520px;margin:10px auto 0;padding:22px 16px calc(34px + env(safe-area-inset-bottom,0px));text-align:center;border-top:1.5px solid var(--line,#27316A);color:var(--mute,#9AA3D2);font-size:13px;line-height:1.6;position:relative;z-index:2}
#klFoot .kb{font-family:var(--display,Arial Black,sans-serif);color:var(--gold,#FFC53D);font-size:15px;margin-bottom:6px}
#klFoot nav{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 16px;margin:12px 0}
#klFoot button{background:none;border:0;color:var(--text,#fff);font-weight:700;font-size:13px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
#klFoot .rg{background:var(--panel,#101739);border:1.5px solid var(--line,#27316A);border-radius:12px;padding:10px 12px;margin-top:10px}
#klOv{position:fixed;inset:0;background:#000b;z-index:300;display:flex;align-items:flex-end;justify-content:center}
#klOv.hidden{display:none!important}
#klSheet{width:100%;max-width:520px;max-height:90vh;overflow-y:auto;background:var(--ink,#070B1F);border:1.5px solid var(--line,#27316A);border-bottom:0;border-radius:24px 24px 0 0;padding:18px 18px calc(28px + env(safe-area-inset-bottom,0px));color:var(--text,#F2F4FF);user-select:text;-webkit-user-select:text}
#klSheet .kh{display:flex;align-items:center;gap:10px;margin-bottom:10px}
#klSheet .kh h3{flex:1;font-size:16px;margin:0}
#klSheet .kx{width:38px;height:38px;border-radius:12px;border:1.5px solid var(--line,#27316A);background:var(--panel,#101739);color:inherit;font-size:16px;cursor:pointer}
#klSheet h4{margin:16px 0 4px;color:var(--gold,#FFC53D);font-size:14px}
#klSheet p,#klSheet li{font-size:14px;line-height:1.6;color:#d8dcf5}
#klSheet ul{padding-left:20px}
#klSheet .up{color:var(--mute,#9AA3D2);font-size:12px}
#klSheet a.kbtn{display:block;margin-top:12px;padding:14px;border-radius:14px;background:var(--gold,#FFC53D);color:#1b1500;font-weight:800;text-align:center;text-decoration:none}
#klAgeBox{display:flex;gap:10px;align-items:flex-start;text-align:left;margin:12px 0 2px;font-size:14px;line-height:1.45;color:var(--mute,#9AA3D2)}
#klAgeBox input{width:22px;height:22px;margin:2px 0 0;flex:none;accent-color:#FFC53D}
#klAgeBox button{background:none;border:0;color:var(--gold,#FFC53D);font-weight:700;text-decoration:underline;cursor:pointer;padding:0;font-size:inherit}
`;
document.head.appendChild(st);

/* ---------- Contenus ---------- */
const DOCS = {
  terms: ["Conditions d’utilisation", `
    <p class="up">Dernière mise à jour : ${UPDATED}</p>
    <h4>1. Qui peut jouer</h4>
    <p>KIZ est réservé aux personnes de <b>18 ans ou plus</b>. En créant un compte, tu confirmes avoir 18 ans révolus. Un seul compte par personne et un seul compte par numéro MonCash.</p>
    <h4>2. Ce qu’est KIZ</h4>
    <p>KIZ est une plateforme de compétition de quiz : tu affrontes d’autres joueurs en duel, en salle de groupe ou en Speed Quiz, et le classement dépend de tes réponses et de ta rapidité.</p>
    <h4>3. Les coins</h4>
    <ul><li>1 🪙 = 1 gourde (HTG).</li>
    <li>Tu achètes des coins par MonCash ou NatCash. Envoie le montant exact, puis soumets le numéro de transaction et la capture du reçu.</li>
    <li>La recharge est créditée après vérification par l’équipe KIZ. Un reçu manquant, faux ou illisible peut être refusé.</li>
    <li>Les offres bonus (ex. Noël) s’appliquent aux conditions annoncées dans l’application.</li></ul>
    <h4>4. Mises et gains</h4>
    <ul><li>Il faut au moins 100 🪙 de solde pour jouer. La mise est de 20 🪙 par partie.</li>
    <li><b>Duel 1v1 :</b> le gagnant remporte tout le pot (40 🪙).</li>
    <li><b>Salle de groupe</b> (5 à 10 joueurs) : 1er 50 %, 2e 30 %, 3e 20 % du pot.</li>
    <li><b>Speed Quiz :</b> 5 secondes par question, avec bonus de vitesse.</li>
    <li>Les gains ne sont jamais garantis. Tu peux perdre ta mise.</li></ul>
    <h4>5. Retraits</h4>
    <ul><li>Minimum 500 🪙 par retrait.</li>
    <li>Le paiement est envoyé par MonCash au numéro indiqué, en 24 heures maximum après la demande.</li>
    <li>Vérifie bien ton numéro : un numéro faux ou appartenant à quelqu’un d’autre peut rendre le paiement impossible.</li></ul>
    <h4>6. Règles de conduite</h4>
    <p>Sont interdits : les faux reçus, les comptes multiples, la triche (robots, partage de réponses, exploitation de failles) et les insultes ou menaces dans le chat. En cas de non-respect, l’équipe peut refuser une recharge ou un retrait, suspendre le compte, et annuler les gains obtenus frauduleusement.</p>
    <h4>7. Disponibilité et erreurs</h4>
    <p>L’application peut être interrompue pour maintenance ou à cause d’un incident technique. Si une partie est faussée par une erreur technique, l’équipe peut corriger les soldes ou rembourser les mises.</p>
    <h4>8. Jouer avec modération</h4>
    <p>Ne joue que l’argent que tu peux te permettre de perdre.</p>
    <h4>9. Modifications</h4>
    <p>Ces conditions peuvent évoluer. La version en vigueur est celle affichée dans l’application. Pour toute question, utilise Contact / Support joueur.</p>`],
  legal: ["Mentions légales", `
    <p>KIZ est une plateforme de compétition de quiz éditée et exploitée par l’équipe KIZ (Haïti).</p>
    <h4>Contact</h4><p>Voir la rubrique « Contact / Support joueur ».</p>
    <h4>Hébergement et services</h4>
    <p>Site hébergé sur Vercel. Données stockées avec Supabase. Paiements effectués par MonCash et NatCash, services indépendants de KIZ.</p>
    <h4>Propriété</h4>
    <p>Le nom KIZ, le logo, le design et les contenus de l’application appartiennent à l’équipe KIZ. Toute copie sans accord est interdite.</p>`],
  privacy: ["Politique de confidentialité", `
    <p>Notre politique de confidentialité complète sera publiée très bientôt, avec la mise à jour de sécurité des comptes.</p>
    <p>En attendant, pour toute question sur tes données ou pour demander la suppression de ton compte, utilise « Contact / Support joueur ».</p>`],
  safe: ["Jouer responsable", `
    <ul><li>Fixe-toi une limite de recharge et respecte-la.</li>
    <li>Ne joue jamais avec de l’argent dont tu as besoin pour vivre (loyer, nourriture, école).</li>
    <li>Ne cherche pas à « te refaire » après une perte.</li>
    <li>Fais des pauses. KIZ doit rester un jeu.</li>
    <li>KIZ est interdit aux moins de 18 ans.</li></ul>
    <p>Si le jeu te cause des problèmes, contacte le support pour demander la suspension de ton compte.</p>`]
};

function contactHTML(){
  const w = SUPPORT.whatsapp.replace(/\D/g, ""), m = SUPPORT.email.trim();
  let h = "<p>Une question, un problème de recharge ou de retrait ? Écris-nous en indiquant ton nom d’utilisateur.</p>";
  if (w) h += `<a class="kbtn" href="https://wa.me/${E(w)}" target="_blank" rel="noopener">💬 Écrire sur WhatsApp</a>`;
  if (m) h += `<a class="kbtn" href="mailto:${E(m)}">✉️ ${E(m)}</a>`;
  if (!w && !m) h += "<p class='up'>Le contact support sera bientôt disponible.</p>";
  return h;
}
DOCS.contact = ["Contact / Support joueur", contactHTML()];

/* ---------- Fenêtre ---------- */
const ov = document.createElement("div");
ov.id = "klOv"; ov.className = "hidden";
ov.innerHTML = '<div id="klSheet" role="dialog" aria-modal="true"></div>';
document.body.appendChild(ov);
const sheet = ov.firstChild;

function open(key){
  const d = DOCS[key]; if (!d) return;
  sheet.setAttribute("aria-label", d[0]);
  sheet.innerHTML = `<div class="kh"><h3>${E(d[0])}</h3><button class="kx" data-close aria-label="Fermer">✕</button></div>${d[1]}`;
  ov.classList.remove("hidden"); document.body.style.overflow = "hidden"; sheet.scrollTop = 0;
}
function close(){ ov.classList.add("hidden"); document.body.style.overflow = ""; }
ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
document.addEventListener("click", e => { const b = e.target.closest("[data-doc]"); if (b) open(b.dataset.doc); });

/* ---------- Pied de page ---------- */
const foot = document.createElement("footer");
foot.id = "klFoot";
foot.innerHTML = `
  <div class="kb">KIZ 🇭🇹</div>
  <div>© 2026 KIZ. Tous droits réservés.</div>
  <nav aria-label="Informations légales">
    <button data-doc="legal">Mentions légales</button>
    <button data-doc="privacy">Confidentialité</button>
    <button data-doc="terms">Conditions d’utilisation</button>
    <button data-doc="contact">Contact / Support joueur</button>
  </nav>
  <div class="rg">🔞 Réservé aux 18 ans et plus. Joue avec modération.</div>`;
document.querySelector(".container").insertAdjacentElement("afterend", foot);

/* ---------- Case 18+ à l’inscription ---------- */
const box = document.createElement("label");
box.id = "klAgeBox";
box.innerHTML = '<input type="checkbox" id="klAge"><span>J’ai 18 ans ou plus et j’accepte les <button type="button" data-doc="terms">conditions d’utilisation</button>.</span>';
$("authBtn").insertAdjacentElement("beforebegin", box);

const _toggleAuth = toggleAuth;
toggleAuth = function(){ _toggleAuth(); box.classList.toggle("hidden", isLogin); };

const _handleAuth = handleAuth;
handleAuth = function(){
  if (!isLogin && !$("klAge").checked){
    const m = $("authMsg"); m.innerText = "⛔ Tu dois avoir 18 ans ou plus et accepter les conditions pour créer un compte."; m.style.color = "red"; return;
  }
  return _handleAuth();
};
})();
