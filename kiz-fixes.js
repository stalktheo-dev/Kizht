/* KIZ – correctifs HTML / XSS
   À charger APRÈS le script principal : <script src="kiz-fixes.js"></script> juste avant </body>.
   Il remplace les fonctions qui injectaient du texte brut dans innerHTML. */

function esc(v){
  return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function safeImg(url){
  return typeof url === "string" && /^(data:image\/(png|jpe?g|webp|gif);base64,|https:\/\/)/i.test(url) ? url : "";
}

/* Nom d'utilisateur : lettres/chiffres seulement à l'inscription (bloque <script>, % et _ qui sont des jokers de ilike) */
const _handleAuthOriginal = handleAuth;
handleAuth = function(){
  const u = document.getElementById("username").value.trim();
  const msg = document.getElementById("authMsg");
  if (!isLogin && !/^[A-Za-z0-9.-]{3,20}$/.test(u)){
    msg.innerText = "⛔ Nom invalide : 3 à 20 caractères, lettres et chiffres seulement.";
    msg.style.color = "red";
    return;
  }
  return _handleAuthOriginal();
};
const _ref = document.getElementById("referral");
if (_ref) _ref.maxLength = 20;
const _chat = document.getElementById("chatInput");
if (_chat) _chat.maxLength = 200;

/* Classement */
loadLeaderboard = async function(){
  const {data} = await supabaseClient.from("profiles").select("username,coins").order("coins",{ascending:false}).limit(10);
  const l = document.getElementById("leaderList");
  if (!data || !data.length){ l.textContent = "Aucun joueur."; return; }
  l.innerHTML = data.map((p,i) =>
    `<div style="padding:10px;border-bottom:1px solid #333;display:flex;justify-content:space-between"><span>${i===0?"🥇 🎅":i===1?"🥈":i===2?"🥉":(i+1)+"."} ${esc(p.username)} ${p.username===currentUser.username?"(Toi)":""}</span><b>${esc(p.coins)} 🪙</b></div>`
  ).join("");
};

/* Classement parrainage */
loadReferralBoard = async function(){
  const {data} = await supabaseClient.from("profiles").select("username,referred_by");
  const counts = {};
  (data||[]).forEach(p => { if (p.referred_by) counts[p.referred_by] = (counts[p.referred_by]||0) + 1; });
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,10);
  document.getElementById("refBoard").innerHTML = !sorted.length
    ? "Personne n'a encore parrainé. Sois le premier !"
    : sorted.map(([name,c],i) =>
        `<div style="padding:10px;border-bottom:1px solid #333;display:flex;justify-content:space-between"><span>${i===0?"🥇":i===1?"🥈":i===2?"🥉":(i+1)+"."} ${esc(name)} ${name===currentUser.username?"(Toi)":""}</span><b>${c} amis • +${c*10} 🪙</b></div>`
      ).join("");
};

/* Chat de salle */
loadChat = async function(){
  if (!currentRoomCode) return;
  const {data} = await supabaseClient.from("chat_messages").select("*").eq("room_code",currentRoomCode).order("created_at",{ascending:true}).limit(30);
  const box = document.getElementById("chatBox");
  if (!data || !data.length){ box.innerHTML = "<p class='small'>Aucun message. Dis quelque chose !</p>"; return; }
  box.innerHTML = data.map(m => `<div class="chat-msg"><b>${esc(m.username)}:</b> ${esc(m.message)}</div>`).join("");
  box.scrollTop = box.scrollHeight;
};

/* Salles publiques (plus de onclick avec texte injecté) */
loadPublicRooms = async function(){
  const {data} = await supabaseClient.from("rooms").select("*").eq("is_private",false).eq("status","waiting").order("created_at",{ascending:false}).limit(20);
  const list = document.getElementById("publicRoomsList");
  if (!list) return;
  const rooms = (data||[]).filter(r => !is1v1Room(r) && !isSpeedRoom(r));
  if (!rooms.length){ list.innerHTML = "<p class='small'>Aucune salle publique. Crée-en une !</p>"; return; }
  list.innerHTML = rooms.map(r =>
    `<div class="room-card"><div><b>${esc(r.room_name)}</b><br><span class="small">${esc(r.players.length)}/10 joueurs • Code: ${esc(r.room_code)}</span></div><button data-code="${esc(r.room_code)}" onclick="joinPublicRoom(this.dataset.code)" style="background:#FFD700;border:none;padding:10px 14px;border-radius:10px;font-weight:900">Rejoindre</button></div>`
  ).join("");
};

/* Joueurs en attente : on garde la logique, on échappe l'affichage */
const _updateWaitingOriginal = updateWaitingUI;
updateWaitingUI = function(room){
  _updateWaitingOriginal(room);
  document.getElementById("waitingPlayers").innerHTML = room.players.map(p =>
    `<span class="player-chip">${esc(p.username)} ${p.username===currentUser.username?"(Toi)":""}</span>`
  ).join("");
};

/* Reçu : plus d'alert() construit avec du texte injecté */
function showReceipt(btn){
  const d = btn.dataset;
  alert(`Reçu KIZ\nPlayer: ${d.user}\nMontant: ${d.amount} HTG\nMéthode: ${d.method}\nTransaction: ${d.code}\nStatus: ${d.status}\nDate: ${d.date}`);
}

/* Historique recharges */
loadTopupHistory = async function(){
  if (!currentUser) return;
  const {data} = await supabaseClient.from("topups").select("*").eq("user_id",currentUser.id).order("created_at",{ascending:false}).limit(10);
  const list = document.getElementById("topupHistoryList");
  if (!data || !data.length){ list.innerHTML = "<p class='small'>Aucune transaction.</p>"; return; }
  data.forEach(t => { if (!lastTopupStatus[t.id]) lastTopupStatus[t.id] = t.status; });
  list.innerHTML = data.map(t => {
    const date = new Date(t.created_at).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
    const method = t.payment_method || (t.code==="RETRAIT" ? "Retrait" : "MonCash");
    const cls = t.status==="pending" ? "status-pending" : t.status==="approved" ? "status-approved" : "status-rejected";
    const st = t.status==="pending" ? "Pending" : t.status==="approved" ? "Approved" : "Rejected";
    const del = t.status==="pending" ? "Pending" : t.status==="approved" ? "Delivered" : "Rejected";
    const img = safeImg(t.receipt_url);
    return `<div class="history-card">
      <div style="font-size:15px">Player ID: <b>${esc(t.username)}</b> | ${esc(Math.abs(t.amount))} HTG | ${esc(method)}</div>
      <div style="margin:8px 0"><span class="${cls}">Payment: ${st} | Delivery: ${del}</span></div>
      <div style="color:#aaa;font-size:13px">Payment Placed: ${esc(date)}</div>
      <div style="color:#aaa;font-size:13px">Payment Verified: ${t.status==="approved"?"Recorded":"Not recorded"}</div>
      <div style="color:#aaa;font-size:13px">Payment Delivered: ${t.status==="approved"?"Recorded":"Not recorded"}</div>
      <div style="color:#aaa;font-size:13px">Transaction: ${esc(t.code)}</div>
      ${img ? `<img src="${esc(img)}" style="width:100%;max-height:150px;object-fit:cover;border-radius:10px;margin-top:8px" alt="Reçu">` : ""}
      <button data-user="${esc(t.username)}" data-amount="${esc(Math.abs(t.amount))}" data-method="${esc(method)}" data-code="${esc(t.code)}" data-status="${st}" data-date="${esc(date)}" onclick="showReceipt(this)" style="background:#FFD700;color:black;border:none;padding:10px 18px;border-radius:10px;font-weight:900;margin-top:12px;cursor:pointer">View Receipt</button>
    </div>`;
  }).join("");
};

/* Historique simple */
loadHistory = async function(){
  const {data} = await supabaseClient.from("topups").select("*").eq("user_id",currentUser.id).order("created_at",{ascending:false}).limit(20);
  const list = document.getElementById("historyList");
  if (!data || !data.length){ list.innerHTML = "<p>Aucune transaction.</p>"; return; }
  list.innerHTML = data.map(t =>
    `<div style="padding:10px;border-bottom:1px solid #333;display:flex;justify-content:space-between"><span>${esc(t.code)} - ${esc(t.status)} - ${esc(t.payment_method||"")}</span><b>${esc(t.amount)} 🪙</b></div>`
  ).join("");
};
