const rand=s=>{s.seed=(Math.imul(s.seed||177,1664525)+1013904223)>>>0;return s.seed/4294967296};
const totalExpenses=s=>s.expensesLifetime||0;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function log(s,str){s.log.unshift(str);s.log=s.log.slice(0,12)}
