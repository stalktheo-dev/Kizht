/* KIZ – Menu joueur (profil, mot de passe, raccourcis)
   À charger après kiz-fixes.js : <script src="kiz-menu.js" defer></script> */
(function(){
const $ = id => document.getElementById(id);
const E = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Styles ---------- */
const st = document.createElement("style");
st.textContent = `
#menuBtn{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--gold,#FFC53D);background:var(--panel,#101739);color:var(--gold,#FFC53D);font-weight:800;font-size:16px;cursor:pointer;flex:none}
#logoutBtn{display:none!important}
#menuBtn.hidden,#kmOverlay.hidden{display:none!important}
#kmOverlay{position:fixed;inset:0;background:#000b;z-index:200;display:flex;align-items:flex-end;justify-content:center}
#kmSheet{width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:var(--ink,#070B1F);border:1.5px solid var(--line,#27316A);border-bottom:0;border-radius:24px 24px 0 0;padding:18px 18px calc(24px + env(safe-area-inset-bottom,0px));animation:kmUp .22s ease-out;user-select:text}
@keyframes kmUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
.km-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.km-head h3{flex:1;font-size:16px;margin:0}
.km-x,.km-back{width:38px;height:38px;border-radius:12px;border:1.5px solid var(--line,#27316A);background:var(--panel,#101739);color:var(--text,#fff);font-size:16px;cursor:pointer}
.km-user{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.km-user b{font-size:19px}
.km-sub{color:var(--mute,#9AA3D2);font-size:14px;font-weight:700}
.km-av{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:800;background:linear-gradient(135deg,var(--blue,#2B4BFF),var(--red,#FF3B4E));flex:none}
.km-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:6px}
.km-stats div{background:var(--panel,#101739);border:1.5px solid var(--line,#27316A);border-radius:14px;padding:10px 6px;text-align:center}
.km-stats b{display:block;font-size:17px;color:var(--gold,#FFC53D)}
.km-stats span{font-size:11px;color:var(--mute,#9AA3D2);font-weight:700}
.km-item{display:flex;align-items:center;gap:14px;width:100%;padding:14px;margin-top:8px;background:var(--panel,#101739);border:1.5px solid var(--line,#27316A);border-radius:14px;color:var(--text,#fff);font-weight:700;font-size:15px;text-align:left;cursor:pointer}
.km-item small{display:block;color:var(--mute,#9AA3D2);font-weight:600;font-size:12px}
.km-item.danger{color:var(--red,#FF3B4E)}
.km-row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line,#27316A)}
.km-row span{color:var(--mute,#9AA3D2);font-weight:700}
.km-row b{text-align:right;word-break:break-word}
.km-lab{display:block;margin:14px 0 2px;font-weight:700;font-size:14px;color:var(--mute,#9AA3D2)}
.km-btn{width:100%;margin-top:16px;padding:15px;border:0;border-radius:14px;background:var(--gold,#FFC53D);color:#1b1500;font-weight:800;font-size:16px;cursor:pointer}
.km-btn:disabled{opacity:.6}
.km-msg{min-height:20px;margin-top:10px;font-size:14px;font-weight:700;color:var(--mute,#9AA3D2)}
.km-msg.bad{color:var(--red,#FF3B4E)}
.km-note{color:var(--mute,#9AA3D2);font-size:13px;line-height:1.5;margin-top:10px}
.km-list{margin:0;padding-left:20px;line-height:1.7;font-size:14px}
`;
document.head.appendChild(st);

/* ---------- Éléments ---------- */
const btn = document.createElement("button");
btn.id = "menuBtn"; btn.className = "hidden"; btn.setAttribute("aria-label", "Ouvrir mon compte");
document.querySelector(".top").appendChild(btn);

const ov = document.createElement("div");
ov.id = "kmOverlay"; ov.className = "hidden";
ov.innerHTML = '<div id="kmSheet" role="dialog" aria-modal="true" aria-label="Mon compte"></div>';
document.body.appendChild(ov);
const sheet = ov.firstChild;

/* ---------- Outils ---------- */
const head = (title, back) =>
  `<div class="km-head">${back ? '<button class="km-back" data-go="main" aria-label="Retour">←</button>' : ""}<h3>${title}</h3><button class="km-x" data-act="close" aria-label="Fermer">✕</button></div>`;
const item = (attr, icon, title, sub, cls) =>
  `<button class="km-item ${cls || ""}" ${attr}><span style="font-size:22px">${icon}</span><span>${title}${sub ? `<small>${sub}</small>` : ""}</span></button>`;
const masked = p => p && p.length === 8 ? p.slice(0, 2) + "** **" + p.slice(-2) : "–";
const setMsg = (t, bad) => { const m = $("kmMsg"); if (m){ m.textContent = t; m.className = "km-msg" + (bad ? " bad" : ""); } };

const NAV = {
  history:  () => { showScreen("historyScreen"); loadHistory(); },
  topup:    () => { showScreen("topupScreen"); loadTopupHistory(); },
  withdraw: () => showScreen("withdrawScreen"),
  referral: () => { showScreen("referralScreen"); loadReferralBoard(); },
  leader:   () => { showScreen("leaderScreen"); loadLeaderboard(); }
};

/* ---------- Vues ---------- */
function render(view){
  const u = currentUser;
  if (!u) return;
  if (view === "main"){
    sheet.innerHTML = head("Mon compte") + `
      <div class="km-user"><div class="km-av">${E((u.username || "?")[0].toUpperCase())}</div>
        <div><b>${E(u.username)}</b><div class="km-sub">+509 ${E(masked(u.phone))}</div></div></div>
      <div class="km-stats">
        <div><b>${E(u.coins)}</b><span>Solde 🪙</span></div>
        <div><b>${E($("refCount").textContent)}</b><span>Amis invités</span></div>
        <div><b>${E($("refEarned").textContent)}</b><span>Gain parrainage</span></div>
      </div>
      ${item('data-go="profile"', "👤", "Mon profil", "Voir et modifier mes infos")}
      ${item('data-go="pass"', "🔑", "Changer mon mot de passe")}
      ${item('data-nav="history"', "📜", "Historique", "Recharges et retraits")}
      ${item('data-nav="topup"', "💳", "Recharger")}
      ${item('data-nav="withdraw"', "💸", "Retirer")}
      ${item('data-nav="referral"', "🔗", "Parrainage", "Ton code : " + E(u.username))}
      ${item('data-nav="leader"', "🏆", "Classement")}
      ${item('data-go="rules"', "📖", "Règles du jeu")}
      ${item('data-act="logout"', "🚪", "Se déconnecter", "", "danger")}`;
  } else if (view === "profile"){
    const since = u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR", {day:"numeric", month:"long", year:"numeric"}) : null;
    sheet.innerHTML = head("Mon profil", true) + `
      <div class="km-row"><span>Nom d’utilisateur</span><b>${E(u.username)}</b></div>
      <div class="km-row"><span>Numéro MonCash</span><b>+509 ${E(masked(u.phone))}</b></div>
      <div class="km-row"><span>Solde</span><b>${E(u.coins)} 🪙</b></div>
      ${since ? `<div class="km-row"><span>Membre depuis</span><b>${E(since)}</b></div>` : ""}
      <p class="km-note">Le nom d’utilisateur ne peut pas changer : il sert de code de parrainage et apparaît dans tes parties et ton historique.</p>
      ${item('data-go="phone"', "📱", "Changer mon numéro MonCash", "Tes retraits seront envoyés sur ce numéro")}`;
  } else if (view === "phone"){
    sheet.innerHTML = head("Numéro MonCash", true) + `
      <label class="km-lab" for="kmPhone">Nouveau numéro (8 chiffres)</label>
      <input id="kmPhone" type="tel" inputmode="numeric" maxlength="11" placeholder="ex : 37288940">
      <label class="km-lab" for="kmPw">Mot de passe actuel</label>
      <input id="kmPw" type="password" autocomplete="current-password">
      <p class="km-note">⚠️ Mets ton vrai numéro. Un numéro = un seul compte, et c’est là qu’on t’envoie tes retraits.</p>
      <button class="km-btn" id="kmSave" data-act="savePhone">Enregistrer</button>
      <p class="km-msg" id="kmMsg" role="alert"></p>`;
  } else if (view === "pass"){
    sheet.innerHTML = head("Mot de passe", true) + `
      <label class="km-lab" for="kmOld">Mot de passe actuel</label>
      <input id="kmOld" type="password" autocomplete="current-password">
      <label class="km-lab" for="kmNew">Nouveau mot de passe (6 caractères minimum)</label>
      <input id="kmNew" type="password" autocomplete="new-password">
      <label class="km-lab" for="kmNew2">Confirme le nouveau mot de passe</label>
      <input id="kmNew2" type="password" autocomplete="new-password">
      <button class="km-btn" id="kmSave" data-act="savePass">Changer le mot de passe</button>
      <p class="km-msg" id="kmMsg" role="alert"></p>`;
  } else if (view === "rules"){
    sheet.innerHTML = head("Règles du jeu", true) + `
      <ul class="km-list">
        <li>Il faut au moins 100 🪙 pour jouer. La mise est de 20 🪙 par partie.</li>
        <li>Duel 1v1 : le gagnant prend tout le pot (40 🪙).</li>
        <li>Salle groupe (5 joueurs minimum) : 1er 50 %, 2e 30 %, 3e 20 % du pot.</li>
        <li>Speed Quiz : 10 questions, 5 secondes chacune, bonus de vitesse.</li>
        <li>Recharge par MonCash ou NatCash : envoie ton reçu, l’admin valide.</li>
        <li>Retrait : minimum 500 🪙, traité sous 24 h sur ton numéro MonCash.</li>
        <li>1 numéro MonCash = 1 seul compte.</li>
      </ul>`;
  }
}

/* ---------- Actions ---------- */
async function savePass(){
  const old = $("kmOld").value, n = $("kmNew").value, c = $("kmNew2").value;
  if (!old || !n || !c) return setMsg("Remplis tous les champs.", true);
  if (n.length < 6) return setMsg("Nouveau mot de passe : 6 caractères minimum.", true);
  if (n !== c) return setMsg("Les deux mots de passe ne sont pas identiques.", true);
  if (n === old) return setMsg("Choisis un mot de passe différent de l’ancien.", true);
  const b = $("kmSave"); b.disabled = true; setMsg("Enregistrement...");
  const {data, error} = await supabaseClient.from("profiles").update({password_hash: n}).eq("id", currentUser.id).eq("password_hash", old).select().maybeSingle();
  b.disabled = false;
  if (error) return setMsg("Erreur : " + error.message, true);
  if (!data) return setMsg("Ancien mot de passe incorrect.", true);
  currentUser.password_hash = n;
  showNotif("✅ Mot de passe changé !");
  render("main");
}

async function savePhone(){
  let p = $("kmPhone").value.replace(/\D/g, "");
  if (p.length === 11 && p.startsWith("509")) p = p.slice(3);
  const pw = $("kmPw").value;
  if (p.length !== 8 || !/^[34]/.test(p)) return setMsg("Numéro invalide : 8 chiffres qui commencent par 3 ou 4.", true);
  if (p === currentUser.phone) return setMsg("C’est déjà ton numéro.", true);
  if (!pw) return setMsg("Entre ton mot de passe actuel.", true);
  const b = $("kmSave"); b.disabled = true; setMsg("Vérification...");
  const {data: ex} = await supabaseClient.from("profiles").select("username").eq("phone", p).maybeSingle();
  if (ex){ b.disabled = false; return setMsg("Ce numéro est déjà utilisé par un autre compte.", true); }
  const {data, error} = await supabaseClient.from("profiles").update({phone: p}).eq("id", currentUser.id).eq("password_hash", pw).select().maybeSingle();
  b.disabled = false;
  if (error) return setMsg(error.code === "23505" ? "Ce numéro est déjà utilisé." : "Erreur : " + error.message, true);
  if (!data) return setMsg("Mot de passe incorrect.", true);
  currentUser.phone = p;
  $("topupPhone").value = p; $("withdrawPhone").value = p; $("withdrawPhoneDisplay").innerText = p;
  showNotif("✅ Numéro MonCash mis à jour !");
  render("profile");
}

/* ---------- Ouverture / fermeture ---------- */
function open(){ if (!currentUser) return; render("main"); ov.classList.remove("hidden"); document.body.style.overflow = "hidden"; }
function close(){ ov.classList.add("hidden"); document.body.style.overflow = ""; }

btn.onclick = open;
ov.addEventListener("click", e => {
  if (e.target === ov) return close();
  const t = e.target.closest("[data-go],[data-nav],[data-act]");
  if (!t) return;
  if (t.dataset.go) return render(t.dataset.go);
  if (t.dataset.nav){
    if (currentRoomId){ close(); return showNotif("⚠️ Termine ou quitte ta partie d’abord.", "#d50000"); }
    close(); return NAV[t.dataset.nav]();
  }
  const a = t.dataset.act;
  if (a === "close") close();
  else if (a === "logout") logout();
  else if (a === "savePass") savePass();
  else if (a === "savePhone") savePhone();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

/* ---------- Branchement sur connexion / déconnexion ---------- */
const _loginSuccess = loginSuccess;
loginSuccess = async function(){
  await _loginSuccess();
  btn.textContent = (currentUser.username || "?")[0].toUpperCase();
  btn.classList.remove("hidden");
};
const _logout = logout;
logout = function(){
  close();
  btn.classList.add("hidden");
  _logout();
};
})();
