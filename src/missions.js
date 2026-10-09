const DAY_FORMATTER=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'});
function dayKey(now=Date.now()){return DAY_FORMATTER.format(new Date(now))}
function dailyProgress(s,id){return id==='cases'?s.dailyCounts.cases:id==='revenue'?s.dailyCounts.revenue:id==='hire'?s.dailyCounts.hire:s.dailyCounts.upgrade}
const DAILY=[{id:'cases',label:'Bugün 8 dosya sonuçlandır',target:8,reward:650},{id:'revenue',label:'Bugün ₺5.000 gelir elde et',target:5000,reward:850},{id:'hire',label:'Bugün bir hukukçu işe al',target:1,reward:1100},{id:'upgrade',label:'Bir ofis veya departman yatırımı yap',target:1,reward:1250}];
function resetDaily(s,now=Date.now()){const k=dayKey(now);if(s.dailyKey!==k){s.dailyKey=k;s.dailyCounts={cases:0,revenue:0,hire:0,upgrade:0};s.dailyClaimed=[];}}
function claimDaily(s,id){const m=DAILY.find(x=>x.id===id);if(!m||s.dailyClaimed.includes(id)||dailyProgress(s,id)<m.target)return false;s.dailyClaimed.push(id);credit(s,m.reward,'bonusRevenue');return true}
function claim(s,id){const m=CONFIG.missions.find(x=>x.id===id);if(!m||s.claimed.includes(id)||missionProgress(s,m)<m.target)return false;s.claimed.push(id);credit(s,m.bonus,'bonusRevenue');log(s,'Görev ödülü: '+m.title);return true}
function missionProgress(s,m){return m.field==='staff'?staffCount(s)-1:Number(s[m.field]||0)}
