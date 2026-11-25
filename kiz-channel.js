/* KIZ - Bouton Channel WhatsApp */
(function(){
  const LINK = "https://whatsapp.com/channel/0029VbDj7ZJ1XqugWtioGD3F";
  const st = document.createElement("style");
  st.textContent = `
  #kizChan{max-width:520px;margin:14px auto 0;padding:0 16px;position:relative;z-index:2}
  #kizChan a{display:flex;align-items:center;justify-content:center;gap:8px;background:#FFC53D;color:#1b1500;font-weight:800;font-size:15px;text-decoration:none;padding:15px 16px;border-radius:16px;box-shadow:0 6px 20px rgba(255,197,61,.25)}
  #kizChan a:active{transform:scale(.98)}
  #kizChan small{display:block;text-align:center;color:#9AA3D2;font-size:12px;margin-top:6px}
  `;
  document.head.appendChild(st);
  const div = document.createElement("div");
  div.id = "kizChan";
  div.innerHTML = `
    <a href="${LINK}" target="_blank" rel="noopener">📢 Suivre la Chaîne KIZ sur WhatsApp</a>
    <small>Annonces, bonus, tournois & nouveaux jeux</small>
  `;
  const foot = document.getElementById("klFoot");
  if (foot) foot.insertAdjacentElement("beforebegin", div);
  else document.querySelector(".container").insertAdjacentElement("afterend", div);
})();
