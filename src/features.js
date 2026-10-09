const finite=(value,min=0,max=1e15,fallback=0)=>Number.isFinite(Number(value))?clamp(Number(value),min,max):fallback;
const productivity=s=>1+currentOffice(s).productivity+fixtureEffects(s).productivity+fixtureEffects(s).satisfaction*.001+s.training*BALANCE.trainingIncome+EQUIPMENT.filter(e=>s.equipment.includes(e.id)).reduce((a,e)=>a+e.productivity,0);
const contractRate=s=>s.contracts.reduce((a,c)=>a+CONTRACTS.find(x=>x.id===c.id).rate,0);
const trainingCost=s=>Math.floor(BALANCE.trainingBase*BALANCE.trainingGrowth**s.training);
const successChance=(s,mode='balanced')=>clamp(.73+(s.reputation+Math.min(10,fixtureEffects(s).reputation))*.001+s.satisfaction*.0004+s.training*BALANCE.trainingSuccess+MODES[mode].chance,.55,.95);
function credit(s,amount,category){s.cash+=amount;s.distributableProfit+=amount;s.totalEarned+=amount;s.monthlyRevenue+=amount;s.dailyCounts.revenue+=amount;if(category)s[category]+=amount;}
function train(s){if(s.training>=BALANCE.trainingMax||!spend(s,trainingCost(s)))return false;s.training++;s.dailyCounts.upgrade++;log(s,'Ekip eğitimi seviyesi '+s.training);return true;}
function buyEquipment(s,id){const e=EQUIPMENT.find(x=>x.id===id);if(!e||s.equipment.includes(id)||!spend(s,e.cost))return false;s.equipment.push(id);s.dailyCounts.upgrade++;log(s,e.name+' kullanıma alındı');return true;}
function startBoost(s){if(s.boostCooldown>0||!spend(s,BALANCE.boostCost))return false;s.boost=BALANCE.boostDuration;s.boostCooldown=BALANCE.boostCooldown;log(s,'Ekip planlama oturumu: 120 saniye pasif üretim +%50');return true;}
function writeDraft(s){if(s.draftCooldown>0)return false;s.draftCooldown=BALANCE.draftCooldown;credit(s,BALANCE.draftReward,'manualRevenue');return true;}
function setMode(s,mode){if(!Object.hasOwn(MODES,mode))return false;s.mode=mode;return true;}
function signContract(s,id){const c=CONTRACTS.find(x=>x.id===id);if(!c||s.contracts.length>=2||s.contracts.some(x=>x.id===id)||s.reputation<c.rep||s.office<c.office||!spend(s,c.cost))return false;s.contracts.push({id,remaining:c.duration});log(s,c.name+' başladı');return true;}
function sanitizeV6(s,now){
 s.office=Math.floor(finite(s.office,0,50));s.simTime=finite(s.simTime,0,CONFIG.monthSeconds-1);s.month=Math.max(1,Math.floor(s.month));
 for(const k of ['cases','wins','settled','nextCaseId'])s[k]=Math.floor(s[k]);
 s.nextCaseId=Math.max(1,s.nextCaseId);s.mode=Object.hasOwn(MODES,s.mode)?s.mode:'balanced';s.training=Math.floor(finite(s.training,0,BALANCE.trainingMax));
 s.equipment=Array.isArray(s.equipment)?[...new Set(s.equipment.filter(id=>EQUIPMENT.some(x=>x.id===id)))]:[];
 for(const k of ['boost','boostCooldown','draftCooldown','caseRevenue','contractRevenue','manualRevenue','bonusRevenue'])s[k]=finite(s[k]);
 s.boost=Math.min(s.boost,BALANCE.boostDuration);s.boostCooldown=Math.min(s.boostCooldown,BALANCE.boostCooldown);s.draftCooldown=Math.min(s.draftCooldown,BALANCE.draftCooldown);s.tickRemainder=finite(s.tickRemainder,0,.99999999);
 s.contracts=Array.isArray(s.contracts)?s.contracts.filter(c=>c&&CONTRACTS.some(x=>x.id===c.id)&&Number.isFinite(c.remaining)&&c.remaining>0).filter((c,i,a)=>a.findIndex(x=>x.id===c.id)===i).slice(0,2).map(c=>({id:c.id,remaining:Math.min(c.remaining,CONTRACTS.find(x=>x.id===c.id).duration)})):[];
 s.casesActive=s.casesActive.filter(c=>c&&Number.isFinite(c.duration)&&c.duration>0&&Number.isFinite(c.fee)&&c.fee>=0&&Number.isFinite(c.id)&&c.id>0&&c.remaining>0).map(c=>({id:Math.floor(c.id),practice:c.practice,duration:finite(c.duration,1,86400),remaining:Math.min(c.remaining,finite(c.duration,1,86400)),fee:finite(c.fee,0,1e12),mode:Object.hasOwn(MODES,c.mode)?c.mode:'balanced',...Object.fromEntries(['title','client','industry','category'].map(k=>[k,String(c[k]??'').slice(0,180)]))}));
 s.nextCaseId=Math.max(s.nextCaseId,...s.casesActive.map(c=>c.id+1));s.log=s.log.map(x=>String(x).slice(0,240));
 s.history=s.history.filter(h=>h&&Number.isFinite(h.revenue)&&Number.isFinite(h.expenses)&&Number.isFinite(h.month)).map(h=>({month:Math.floor(finite(h.month,1)),revenue:finite(h.revenue),expenses:finite(h.expenses)}));
 s.sound=s.sound===true;s.reducedMotion=s.reducedMotion===true;s.savedAt=finite(s.savedAt,0,now,now);
}
