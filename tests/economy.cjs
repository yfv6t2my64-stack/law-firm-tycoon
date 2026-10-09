const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const {loadEngine,loadBaseline}=require('./load-engine.cjs');
const baselineFile=process.argv[2];if(!baselineFile)throw Error('Pass the verified v0.5 index.html path.');
const newGame=loadEngine(),oldGame=loadBaseline(baselineFile),NOW=Date.parse('2026-10-10T10:00:00+03:00');const checkpoints=[300,900,1800,7200,28800,86400];
function invest(g,s,extra){
 for(const m of g.CONFIG.missions)g.claim(s,m.id);
 for(const id of ['cases','revenue','hire','upgrade'])g.claimDaily(s,id);
 const choices=[];
 for(let i=0;i<6;i++){const cost=g.hiringCost(s,i);if(cost<=s.cash&&s.staff[i]<1000)choices.push({cost,run:()=>g.hire(s,i)});}
 if(g.officeCost(s)<=s.cash&&s.office<9)choices.push({cost:g.officeCost(s),run:()=>g.upgradeOffice(s)});
 for(let i=0;i<5;i++){if(g.available(s,i)&&s.departments[i]<3&&g.deptCost(s,i)<=s.cash)choices.push({cost:g.deptCost(s,i),run:()=>g.upgradeDept(s,i)});}
 if(extra){if(s.training<5&&g.trainingCost(s)<=s.cash)choices.push({cost:g.trainingCost(s),run:()=>g.train(s)});for(const e of g.EQUIPMENT){if(!s.equipment.includes(e.id)&&e.cost<=s.cash)choices.push({cost:e.cost,run:()=>g.buyEquipment(s,e.id)});}}
 choices.sort((a,b)=>a.cost-b.cost);choices[0]?.run();
 if(extra&&g.incomeRate(s)*(g.BALANCE.boostMultiplier-1)*g.BALANCE.boostDuration>g.BALANCE.boostCost)g.startBoost(s);
 if(extra)for(const c of g.CONTRACTS)g.signContract(s,c.id);
}
function run(g,version,scenario,seed){const s=g.fresh(NOW);s.seed=seed;const rows=[],unlocks={},initialCash=s.cash;let minCash=s.cash;
 for(let elapsed=10;elapsed<=86400;elapsed+=10){const time=NOW+(elapsed-10)*1000;g.resetDaily(s,time);g.advance(s,10,time);if(scenario!=='idle')invest(g,s,scenario==='enhanced');minCash=Math.min(minCash,s.cash);
  for(let i=1;i<5;i++)if(g.available(s,i)&&unlocks[i]===undefined)unlocks[i]=elapsed;
  assert(Number.isFinite(s.cash)&&Number.isFinite(g.netRate(s))&&s.cash>=-1e-6,'Invalid economy state');assert(s.reputation<=100&&s.satisfaction<=100);
  if(checkpoints.includes(elapsed))rows.push({version,scenario,seed,seconds:elapsed,cash:Math.round(s.cash),earned:Math.round(s.totalEarned-initialCash),spent:Math.round(s.totalSpent),expenses:Math.round(s.expensesLifetime),cases:s.cases,office:s.office+1,staff:g.staffCount(s),passiveNet:Number(g.netRate(s).toFixed(2)),minCash:Math.round(minCash),training:s.training??0,unlocks:{...unlocks}});
 }
 return rows;
}
const rows=[];for(const seed of [177,42,2026]){rows.push(...run(oldGame,'v0.5','idle',seed),...run(newGame,'v0.6','idle',seed),...run(oldGame,'v0.5','reinvest',seed),...run(newGame,'v0.6','reinvest',seed),...run(newGame,'v0.6','enhanced',seed));}
for(const seed of [177,42,2026])for(const seconds of checkpoints){const old=rows.find(r=>r.version==='v0.5'&&r.scenario==='idle'&&r.seed===seed&&r.seconds===seconds),next=rows.find(r=>r.version==='v0.6'&&r.scenario==='idle'&&r.seed===seed&&r.seconds===seconds);assert.equal(old.cash,next.cash,'Baseline idle economy changed');assert.equal(old.cases,next.cases);}
const out=path.resolve(__dirname,'../reports');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'economy-results.json'),JSON.stringify({generatedAt:new Date().toISOString(),baselineSha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(baselineFile)).digest('hex'),seeds:[177,42,2026],checkpoints,policy:'10-second decision cadence; cheapest affordable hire/office/department; enhanced adds training/equipment, eligible retainers and profitable boosts; no manual income',rows},null,2));
const fields=['version','scenario','seed','seconds','cash','earned','spent','expenses','cases','office','staff','passiveNet','minCash','training'];fs.writeFileSync(path.join(out,'economy-results.csv'),fields.join(',')+'\n'+rows.map(r=>fields.map(f=>r[f]).join(',')).join('\n'));
console.log('90 checkpoint results; 15 independent 24-hour simulations; 3 seeds. Idle v0.5/v0.6 cash and cases match at every checkpoint.');
console.table(rows.filter(r=>r.seed===177).map(({version,scenario,seconds,cash,cases,office,staff,passiveNet})=>({version,scenario,seconds,cash,cases,office,staff,passiveNet})));
