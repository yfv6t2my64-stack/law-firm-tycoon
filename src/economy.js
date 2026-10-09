const staffCount=s=>s.staff.reduce((a,b)=>a+b,0)+1;
const baseIncomeRate=s=>(2+s.staff.reduce((a,n,i)=>a+n*CONFIG.roles[i].rate,0))*(1+s.office*.2)*(1+Math.max(0,s.reputation-10)*.002);
const expenseRate=s=>fixtureEffects(s).upkeep+.25+officeRent(s)/CONFIG.monthSeconds+s.staff.reduce((a,n,i)=>a+n*CONFIG.roles[i].salary,0)+s.departments.reduce((a,n)=>a+Math.max(0,n-1)*.5,0)+EQUIPMENT.filter(e=>s.equipment.includes(e.id)).reduce((a,e)=>a+e.upkeep,0);
const incomeRate=s=>baseIncomeRate(s)*productivity(s)*Math.max(happyMultiplier(s),s.boost>0?BALANCE.boostMultiplier:1);
const netRate=s=>incomeRate(s)+contractRate(s)-expenseRate(s);
const hiringCost=(s,i)=>Math.floor(CONFIG.roles[i].cost*1.68**s.staff[i]);
const officeCost=s=>OFFICES[s.officeTier+1]?.cost??Infinity;
const deptCost=(s,i)=>Math.floor((i+1)*1750*2.1**Math.max(0,s.departments[i]-1));
const available=(s,i)=>s.cases>=CONFIG.practices[i].unlock && s.office>=[0,0,2,4,7][i];
function spend(s,amount){if(!Number.isFinite(amount)||amount<0||s.cash+1e-7<amount)return false;s.cash-=amount;s.totalSpent+=amount;s.distributableProfit-=amount;return true}
