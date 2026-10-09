const fs=require('node:fs'),path=require('node:path');const {loadBaseline}=require('./load-engine.cjs');
const g=loadBaseline(process.argv[2]);const s=g.fresh(Date.now());g.advance(s,600);s.cash+=1000000;s.totalEarned+=1000000;s.reputation=60;s.office=4;s.staff=[3,2,1,0,0,0];s.departments=[2,1,1,1,0];s.savedAt=Date.now();
const out=path.join(__dirname,'fixtures');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'v5-demo.json'),JSON.stringify(s,null,2));console.log('Synthetic v0.5 QA fixture generated; no personal save data.');
