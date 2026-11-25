/* KIZ – Écrans Connexion / Inscription séparés
   À charger APRÈS kiz-legal.js : <script src="kiz-auth.js" defer></script> */
(function(){
const $ = id => document.getElementById(id);

const st = document.createElement("style");
st.textContent = `
#kaTabs{display:flex;gap:8px;margin-bottom:14px}
#kaTabs button{flex:1;padding:13px;border-radius:12px;border:1.5px solid var(--line,#27316A);background:var(--panel,#101739);color:var(--mute,#9AA3D2);font-weight:800;font-size:14px;cursor:pointer}
#kaTabs button.on{background:var(--gold,#FFC53D);color:#1b1500;border-color:var(--gold,#FFC53D)}
#kaAux{display:flex;flex-direction:column;gap:10px;margin:8px 0 4px}
.ka-show{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--mute,#9AA3D2);cursor:pointer}
#kaShow{width:20px;height:20px;margin:0;padding:0;accent-color:#FFC53D}
#kaForgot{background:none;border:0;color:var(--gold,#FFC53D);font-weight:700;font-size:13px;text-align:left;text-decoration:underline;cursor:pointer;padding:0}
#kaForgot.hidden{display:none}
`;
document.head.appendChild(st);

/* Éléments de la carte d’origine */
const card = $("username").closest(".card");
const phoneNote = $("phone").nextElementSibling;   // « 1 numéro MonCash = 1 compte… »
const refNote = $("authMsg").nextElementSibling;   // note parrainage

/* Onglets */
const tabs = document.createElement("div");
tabs.id = "kaTabs"; tabs.setAttribute("role", "tablist");
tabs.innerHTML = '<button type="button" role="tab" data-m="login">Connexion</button><button type="button" role="tab" data-m="signup">Inscription</button>';
card.insertBefore(tabs, card.firstChild);

/* Confirmation du mot de passe (inscription seulement) */
const p2 = document.createElement("input");
p2.id = "klPass2"; p2.type = "password"; p2.placeholder = "Confirme le mot de passe"; p2.autocomplete = "new-password";
$("password").insertAdjacentElement("afterend", p2);

/* Afficher le mot de passe + mot de passe oublié */
const aux = document.createElement("div");
aux.id = "kaAux";
aux.innerHTML = '<label class="ka-show"><input type="checkbox" id="kaShow"> Afficher le mot de passe</label><button type="button" id="kaForgot" data-doc="contact">Mot de passe oublié ? Contacte le support</button>';
p2.insertAdjacentElement("afterend", aux);
$("kaShow").onchange = e => { const t = e.target.checked ? "text" : "password"; $("password").type = t; p2.type = t; };

/* Placeholders plus clairs */
$("username").placeholder = "Nom d’utilisateur";
$("username").autocomplete = "username";
$("username").maxLength = 20;

/* Changement d’écran */
let mode = "login";
function setMode(m){
  mode = m;
  const login = m === "login";
  isLogin = login;                       // garde la logique d’origine synchronisée
  tabs.querySelectorAll("button").forEach(b => { const on = b.dataset.m === m; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
  [$("phone"), phoneNote, p2, $("referral"), refNote].forEach(el => el && el.classList.toggle("hidden", login));
  const box = $("klAgeBox"); if (box) box.classList.toggle("hidden", login);
  $("kaForgot").classList.toggle("hidden", !login);
  $("authTitle").innerText = login ? "Se Connecter" : "🎅 Créer un Compte";
  $("authBtn").innerText = login ? "SE CONNECTER" : "🎄 CRÉER UN COMPTE";
  $("password").autocomplete = login ? "current-password" : "new-password";
  $("authMsg").innerText = "";
  $("authTitle").classList.add("hidden");
  $("toggleBtn").classList.add("hidden");
}
tabs.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (b) setMode(b.dataset.m); });

/* Entrée = valider */
card.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox") $("authBtn").click();
});

/* Vérifications propres à l’inscription */
const _handleAuth = handleAuth;
handleAuth = function(){
  if (!isLogin){
    const m = $("authMsg"), pw = $("password").value;
    const bad = t => { m.innerText = "⛔ " + t; m.style.color = "red"; };
    if (pw.length < 6) return bad("Mot de passe trop court : 6 caractères minimum.");
    if (pw !== p2.value) return bad("Les deux mots de passe ne sont pas identiques.");
  }
  return _handleAuth();
};

/* Déconnexion : on vide les mots de passe et on revient sur Connexion */
const _logout = logout;
logout = function(){
  _logout();
  $("password").value = ""; p2.value = "";
  $("kaShow").checked = false; $("password").type = "password"; p2.type = "password";
  setMode("login");
};

setMode("login");
window.addEventListener("load", () => setMode(mode));
})();
