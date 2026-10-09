const fs=require('node:fs'),path=require('node:path'),{loadEngine}=require('./load-engine.cjs');const g=loadEngine(),T=new Date(2026,9,10,12).getTime(),checkpoints=[300,1800,7200,28800,86400,604800],rows=[];
for(const strategy of ['casual','active','optimizer'])for(const seed of [177,2026,991]){
 const s=g.fresh(T);s.seed=seed;const step=strategy==='casual'?300:30;let elapsed=0,firstMove=null;
 while(elapsed<604800){const dt=Math.min(step,checkpoints.find(n=>n>elapsed)-elapsed);g.advance(s,dt,T+elapsed*1000);elapsed+=dt;const now=T+elapsed*1000;
  for(const m of g.CONFIG.missions)g.claim(s,m.id);for(const id of ['cases','revenue','hire','upgrade'])g.claimDaily(s,id);
  if(strategy!=='casual'||elapsed%3600===0)g.startHappy(s,now);
  const reserve=g.reserveAmount(s),budget=s.cash-reserve;
  if(budget>g.officeCost(s)*1.15&&g.upgradeOffice(s)&&firstMove===null)firstMove=elapsed;
  for(let i=0;i<5;i++)if(g.available(s,i)&&s.departments[i]< (strategy==='optimizer'?6:3)&&s.cash-reserve>g.deptCost(s,i)*1.4)g.upgradeDept(s,i);
  // Highest affordable role first, one hire per visit. Leaves money for relocation.
  for(let i=5;i>=0;i--)if(s.cash-reserve>g.hiringCost(s,i)*(strategy==='casual'?3:2)&&g.hire(s,i))break;
  if(strategy!=='casual'){
   if(s.cash-reserve>g.trainingCost(s)*5)g.train(s);
   for(const f of g.FIXTURES)if(s.cash-reserve>g.fixtureCost(s,f)*8)g.upgradeFixture(s,f.id);
   g.writeDraft(s);
  }
  if(elapsed%3600===0){const amount=Math.floor(g.maxWithdrawal(s)*.1);if(amount)g.withdraw(s,amount);const car=g.CARS.find(a=>!s.cars.includes(a.id)&&a.office<=s.officeTier&&a.cost<s.personalCash*.5);if(car)g.buyAsset(s,'cars',car.id);const home=g.HOMES.find(a=>!s.homes.includes(a.id)&&a.office<=s.officeTier&&a.cost<s.personalCash*.4);if(home)g.buyAsset(s,'homes',home.id);}
  if(!Number.isFinite(s.cash)||s.cash<0)throw Error('Invalid economy '+strategy+' '+elapsed);
  if(checkpoints.includes(elapsed))rows.push({strategy,seed,seconds:elapsed,cash:Math.round(s.cash),gross:Math.round(s.totalEarned),expenses:Math.round(s.expensesLifetime),office:s.officeTier+1,staff:g.staffCount(s),cases:s.cases,personal:Math.round(s.personalCash),withdrawn:s.withdrawnLifetime,cars:s.cars.length,homes:s.homes.length,firstMove});
 }
 console.log(strategy,seed,'office',s.officeTier+1,'cash',Math.round(s.cash));
}
const dir=path.join(__dirname,'../reports');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'economy-v7.json'),JSON.stringify(rows,null,2));fs.writeFileSync(path.join(dir,'economy-v7.csv'),Object.keys(rows[0]).join(',')+'\n'+rows.map(r=>Object.values(r).join(',')).join('\n'));console.log(rows.length+' checkpoints; continuous simulated play, NOT seven days away credit.');
