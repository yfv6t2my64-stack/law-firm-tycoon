function parseSave(text,now=Date.now()){
 if(typeof text!=='string'||text.length>1000000)throw new Error('Kayıt boyutu geçersiz.');
 let raw;try{raw=JSON.parse(text);}catch{throw new Error('Geçerli JSON kayıt metni gir.');}if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Kayıt bir oyun verisi olmalı.');
 if(Number(raw.version)>CONFIG.version)throw new Error('Bu kayıt daha yeni bir oyun sürümüne ait.');
 if(!['cash','money','cases','staff','hires'].some(k=>Object.hasOwn(raw,k)))throw new Error('Law Firm Tycoon kaydı bulunamadı.');
 return hydrate(raw,now);
}
function loadGame(storage,now=Date.now()){
 let damaged=false;
 for(const key of [CONFIG.saveKey,CONFIG.saveKey+'-backup',...CONFIG.legacy]){
  try{const text=storage.getItem(key);if(text){const state=parseSave(text,now);return {state,message:key===CONFIG.saveKey?'':damaged?'Hasarlı kaydın yerine sağlam yedek yüklendi.':'Önceki kayıt v0.7’ye aktarıldı.'};}}catch{damaged=true;}
 }
 return {state:fresh(now),message:damaged?'Kayıt okunamadı. Yeni oturum açıldı; eski kayıtlar silinmedi.':''};
}
function persistGame(storage,state){
 const text=JSON.stringify(state);const previous=storage.getItem(CONFIG.saveKey);
 if(previous){try{parseSave(previous);storage.setItem(CONFIG.saveKey+'-backup',previous);}catch{/* Preserve a valid recovery backup when primary is corrupt. */}}
 storage.setItem(CONFIG.saveKey,text);
}
