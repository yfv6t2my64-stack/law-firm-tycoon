/* Living Office v0.9: deterministic, lightweight SVG animation driven by actual game state. */
let officeSceneSignature='',officeSceneLastCases=0,officeSceneLastFees=0,officeSceneLastActive=0,officeSceneInitialized=false;
const SCENE_NS='http://www.w3.org/2000/svg';
function officeSceneMode(){return ['high','balanced','off'].includes(s.graphicsMode)?s.graphicsMode:'balanced'}
function officeFigure(x,y,i){
 const coats=['#b8d3e5','#c4dbdd','#e4d6bb','#c2cadc'],skin=['#d8a27e','#bd8568','#efc4a0','#9c6b50'];
 return `<g class="office-person" style="--delay:${-(i%7)*.61}s" transform="translate(${x} ${y})">
 <ellipse cx="0" cy="5" rx="12" ry="5" fill="#0b1827" opacity=".38"/>
 <g class="office-worker"><path d="M-10 -17L0 -24 10 -17 9 0 -9 0Z" fill="${coats[i%4]}" stroke="#25374b" stroke-width="1.2"/>
 <path d="M-3 -22L0 -13 3 -22" fill="#f4f7ff"/><circle cx="0" cy="-33" r="10" fill="${skin[i%4]}"/>
 <path d="M-10 -34Q-9 -47 2 -44Q14 -43 10 -32L5 -39Q-2 -35 -10 -34" fill="${['#3c2c2b','#252e40','#77533c','#322c28'][i%4]}"/>
 <path d="M-9 -16L-15 -5M9 -16L15 -5" stroke="${skin[i%4]}" stroke-width="4" stroke-linecap="round"/>
 </g></g>`;
}
function officeDesk(x,y,i){return `<g transform="translate(${x} ${y})" class="office-desk"><path d="M-43 -13L2 -35 48 -12 4 11Z" fill="#986e54" stroke="#b88f70" stroke-width="2"/><path d="M-43 -13V-4L4 20V11M48 -12V-3L4 20" fill="#644635"/><path d="M-14 -22L7 -32 31 -20 9 -10Z" fill="#263d50"/><path d="M-13 -22V-41L9 -52 31 -41V-20L9 -10Z" fill="#243b4f" stroke="#80b9ce" stroke-width="2"/><path d="M-7 -38L9 -46 25 -38 9 -30Z" fill="#69c4ca" opacity=".85"/><path d="M5 -11L24 -21 35 -15 16 -5Z" fill="#cfd7df"/><circle cx="-26" cy="-9" r="4" fill="#d3b28e"/></g>`;}
function sceneStructure(){
 const tier=Math.max(0,s.officeTier||0), premium=tier>=7,medium=tier>=3, people=Math.min(officeSceneMode()==='high'?10:7,Math.max(1,staffCount(s)+1));
 const desks=Math.min(people,medium?6:3), positions=[[135,203],[280,230],[424,203],[205,298],[358,316],[492,287]], workers=[[116,174],[260,203],[404,174],[188,268],[343,284],[480,254],[101,289],[527,170],[336,146],[520,342]];
 const fixtures=Array.isArray(FIXTURES)?FIXTURES:[],owned=fixtures.filter(f=>(s.fixtureLevels?.[f.id]||0)>0), names=owned.map(f=>String(f.name).toLocaleLowerCase('tr-TR'));
 const coffee=names.some(n=>n.includes('kahve')||n.includes('espresso')),game=names.some(n=>n.includes('playstation')||n.includes('oyun')),research=names.some(n=>n.includes('içtihat')||n.includes('araştırma')||n.includes('yazılım'));
 const workers=workers.slice(0,people).map((p,i)=>officeFigure(p[0],p[1],i)).join('');
 const tables=positions.slice(0,desks).map((p,i)=>officeDesk(p[0],p[1],i)).join('');
 return `<div class="living-heading"><span>🏢 YAŞAYAN OFİS</span><span class="office-live">● ${officeSceneMode()==='off'?'Sabit görünüm':'Çalışıyor'}</span></div>
 <svg viewBox="0 0 620 415" class="living-svg" role="img" aria-label="${escapeHTML(currentOffice(s).name)} ofisinde çalışan hukukçular, masalar ve satın alınan eşyalar">
 <defs><linearGradient id="livingWall" x2="1" y2="1"><stop stop-color="${premium?'#365e75':medium?'#304f68':'#33516c'}"/><stop offset="1" stop-color="#1b2e47"/></linearGradient>
 <linearGradient id="livingFloor"><stop stop-color="#d1b69a"/><stop offset="1" stop-color="#987a62"/></linearGradient></defs>
 <path d="M25 115L301 13 595 116 317 235Z" fill="url(#livingWall)" stroke="#7596ab" stroke-width="3"/>
 <path d="M25 115V255L317 400V235ZM595 116V256L317 400V235Z" fill="#203a4d"/>
 <path d="M25 255L317 399 595 256 317 114Z" fill="url(#livingFloor)" stroke="#f6d5ad" stroke-width="3"/>
 <path d="M90 145L315 45 533 150" fill="none" stroke="#9eb7c3" stroke-width="3"/>
 ${medium?'<path d="M353 75L531 143 531 228 353 158Z" fill="#a4deea" opacity=".15" stroke="#a6e6f1" stroke-width="3"/>':''}
 ${premium?'<g opacity=".75"><path d="M185 62L185 153 290 108 290 26M333 28L333 112 465 171 465 76" fill="#6ca9c3" fill-opacity=".35" stroke="#b5ddec" stroke-width="3"/><path d="M207 108L258 86M357 76L423 105" stroke="#f1d29c" stroke-width="3"/></g>':''}
 <path d="M38 255L317 390 581 256" fill="none" stroke="#f4d8b1" stroke-width="2" opacity=".55"/>
 <g class="office-objects">${tables}
 <g transform="translate(510 164)"><rect x="-22" y="-36" width="44" height="54" rx="3" fill="#4d6974"/><rect x="-17" y="-28" width="34" height="36" fill="#a0aeb5"/><g stroke="#718993" stroke-width="2"><path d="M-11 -17H10M-11 -9H10M-11 0H10"/></g><path d="M-23 18L0 30 23 18" fill="#6f4d36"/></g>
 <g transform="translate(74 246)"><path d="M-13 -6L0 -21 14 -7 0 8Z" fill="#3d936e"/><path d="M-4 5L0 -32 7 4" stroke="#a2d6ac" stroke-width="4"/><path d="M-9 5H9L6 17H-6Z" fill="#bd8870"/></g>
 ${coffee?'<g transform="translate(75 182)"><rect x="-20" y="-36" width="43" height="46" rx="5" fill="#d3dee4"/><rect x="-16" y="-29" width="35" height="19" rx="2" fill="#5b7d91"/><circle cx="0" cy="-19" r="5" fill="#dfb982"/><path d="M-7 0H8" stroke="#62412f" stroke-width="5"/></g>':''}
 ${game?'<g transform="translate(500 325)"><rect x="-43" y="-29" width="87" height="42" rx="7" fill="#41546b"/><rect x="-35" y="-23" width="70" height="26" rx="2" fill="#6ec6de"/><rect x="-10" y="16" width="20" height="7" rx="3" fill="#dde3e8"/></g>':''}
 ${research?'<g transform="translate(330 124)"><rect x="-27" y="-23" width="54" height="32" rx="3" fill="#182d42" stroke="#67d9c5" stroke-width="3"/><path d="M-20 -13H19M-20 -6H8M-20 1H15" stroke="#68d9c5" stroke-width="3"/></g>':''}
 ${medium?'<g transform="translate(300 153)"><ellipse rx="46" ry="21" fill="#a47c5b" stroke="#dbaf81" stroke-width="3"/><path d="M-8 0H20M0 -7V7" stroke="#efca8b" stroke-width="3"/></g>':''}
 </g><g class="office-people">${workers}</g>
 <g class="office-happy-overlay" opacity="0"><circle cx="112" cy="80" r="8" fill="#ffe387"/><circle cx="442" cy="97" r="7" fill="#fb97b7"/><path d="M340 55L350 67 337 81" fill="none" stroke="#ffe387" stroke-width="5"/></g>
 </svg><div class="living-caption"><span>${people} karakter · ${staffCount(s)} çalışan</span><span>${escapeHTML(currentOffice(s).name)}</span></div>
 <div id="livingPopups" class="living-popups" aria-live="off"></div>
 <div class="living-actions"><button class="action secondary" data-tab="team">👥 Ekip</button><button class="action secondary" data-tab="cases">📁 Dosyalar</button><button class="action secondary" data-screen="offices">🏢 Taşın</button></div>`;
}
function sceneRefresh(force=false){
 const node=document.getElementById('livingOffice');if(!node)return;
 const mode=officeSceneMode(),key=[s.officeTier,staffCount(s),mode,(s.reducedMotion?1:0),...FIXTURES.map(f=>s.fixtureLevels?.[f.id]||0)].join('|');
 if(force||key!==officeSceneSignature){node.innerHTML=sceneStructure();officeSceneSignature=key;}
 const happy=happyMultiplier(s)>1;node.classList.toggle('living-happy',happy);node.classList.toggle('living-static',mode==='off'||s.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches);
 if(!officeSceneInitialized){officeSceneLastCases=s.cases;officeSceneLastFees=s.caseRevenue||0;officeSceneLastActive=s.casesActive.length;officeSceneInitialized=true;return;}
 if(document.hidden||mode==='off'||s.reducedMotion)return;
 if(s.cases>officeSceneLastCases){const diff=(s.caseRevenue||0)-officeSceneLastFees;scenePopup('✓ '+(s.cases-officeSceneLastCases)+' dosya tamamlandı'+(diff>0?' · +'+money(diff):''));}
 else if(s.casesActive.length>officeSceneLastActive)scenePopup('📁 Yeni müvekkil');
 officeSceneLastCases=s.cases;officeSceneLastFees=s.caseRevenue||0;officeSceneLastActive=s.casesActive.length;
}
function scenePopup(msg){const holder=document.getElementById('livingPopups');if(!holder)return;const tag=document.createElement('span');tag.className='living-popup';tag.textContent=msg;holder.replaceChildren(tag);setTimeout(()=>tag.remove(),1900);}
