function addCase(s,i){
 const cfg=CONFIG.practices[i],scale=1+Math.min(160,s.cases)*.012,id=s.nextCaseId++;
 const templates=MATTERS[i],title=templates[Math.floor(rand(s)*templates.length)];
 const tier=Math.min(6,Math.floor(s.reputation/22)+Math.floor(s.office/3));
 const group=Math.min(tier,Math.floor(rand(s)*(tier+1)));const client=CLIENT_PREFIX[Math.floor(rand(s)*CLIENT_PREFIX.length)]+' '+['Danışmanlık','Ticaret','Holding','Sanayi','Teknoloji'][Math.floor(rand(s)*5)];
 const industry=INDUSTRIES[Math.floor(rand(s)*INDUSTRIES.length)];
 const capacity=Math.max(1,staffCount(s));
 const duration=MODES[s.mode].duration*cfg.secs*(.85+rand(s)*.3)/(1+Math.max(0,s.departments[i]-1)*.22+Math.max(0,capacity-1)*.023+ s.training*BALANCE.trainingSpeed+fixtureEffects(s).speed);
 s.casesActive.push({id,mode:s.mode,practice:i,remaining:duration,duration,fee:Math.round(cfg.base*scale*(1+currentOffice(s).clients)*(1+s.departments[i]*.12)*(1+group*.08)),title,client,industry,category:CLIENT_CATEGORIES[group]});
}
function finishCase(s,c){
 const roll=rand(s),success=roll<successChance(s,c.mode||'balanced');
 const settlement=!success&&roll<.94, paid=Math.round(c.fee*happyMultiplier(s)*(success?1:settlement?.58:.2));
 credit(s,paid,'caseRevenue');s.dailyCounts.cases++;s.cases++;
 if(success){s.wins++;s.reputation=clamp(s.reputation+.35,0,100);s.satisfaction=clamp(s.satisfaction+.1,0,100)}else if(settlement){s.settled++;s.satisfaction=clamp(s.satisfaction-.08,0,100)}else{s.satisfaction=clamp(s.satisfaction-.34,0,100)}
 if(s.cases%3===0)log(s,(success?'✓ ':settlement?'🤝 ':'• ')+c.title+' · '+paid.toLocaleString('tr-TR')+' ₺');
}
