// Chunked deterministic simulation: supports offline progress without a frame-by-frame loop.
function advance(s,seconds,wallStart=s.savedAt){
 const skip=Math.max(0,(s.clockNow-wallStart)/1000);wallStart+=skip*1000;const elapsed=finite(seconds-skip,0,CONFIG.offlineCap), before=s.totalEarned, oldCases=s.cases,oldExpenses=s.expensesLifetime,oldCash=s.cash;
 const prior=s.tickRemainder;const total=elapsed+prior;const ticks=Math.floor(total+1e-8);s.tickRemainder=Math.max(0,total-ticks);
 let lastDay=Math.floor((wallStart+10800000)/86400000);resetDaily(s,wallStart);
 for(let n=0;n<ticks;n++){
  // Istanbul daily boundary (UTC+3), checked each tick without formatting dates.
  const tickTime=wallStart+(n+1-prior)*1000,day=Math.floor((tickTime+10800000)/86400000);if(day!==lastDay){resetDaily(s,tickTime);lastDay=day;}
  s.clockNow=Math.max(s.clockNow,tickTime-1000);const revenue=incomeRate(s),expense=expenseRate(s);credit(s,revenue);credit(s,contractRate(s),'contractRevenue');s.cash-=expense;s.distributableProfit-=expense;s.monthlyExpenses+=expense;s.expensesLifetime+=expense;
  for(const k of ['boost','boostCooldown','draftCooldown'])s[k]=Math.max(0,s[k]-1);
  s.contracts=s.contracts.map(c=>({...c,remaining:c.remaining-1})).filter(c=>c.remaining>0);
  const unlocked=CONFIG.practices.map((_,i)=>i).filter(i=>available(s,i)&&s.departments[i]>0);
  const slots=Math.min(2+Math.floor(staffCount(s)/2),14);
  // Round-robin refill avoids permanent starvation of later departments.
  const startIndex=s.nextCaseId%Math.max(1,unlocked.length);
  const order=unlocked.slice(startIndex).concat(unlocked.slice(0,startIndex));
  for(const i of order){const cap=Math.min(s.departments[i],3+Math.floor(staffCount(s)/3));const active=s.casesActive.filter(c=>c.practice===i).length;let fill=Math.min(cap-active,slots-s.casesActive.length);while(fill-->0)addCase(s,i)}
  for(const c of s.casesActive)c.remaining--;
  const complete=s.casesActive.filter(c=>c.remaining<=0);s.casesActive=s.casesActive.filter(c=>c.remaining>0);for(const c of complete)finishCase(s,c);
  s.simTime++;while(s.simTime>=CONFIG.monthSeconds){s.history.push({month:s.month++,revenue:Math.round(s.monthlyRevenue),expenses:Math.round(s.monthlyExpenses)});s.history=s.history.slice(-6);s.simTime-=CONFIG.monthSeconds;s.monthlyRevenue=0;s.monthlyExpenses=0;}
 }
 refreshHappyDay(s,wallStart+elapsed*1000);return {revenue:s.totalEarned-before,completed:s.cases-oldCases,expenses:s.expensesLifetime-oldExpenses,net:s.cash-oldCash};
}
function simulateAway(s,now=Date.now()){const elapsed=clamp((now-s.savedAt)/1000,0,CONFIG.offlineCap);const cashBefore=s.cash,earnedBefore=s.totalEarned,casesBefore=s.cases;advance(s,elapsed,s.savedAt);resetDaily(s,now);refreshHappyDay(s,now);s.savedAt=Math.max(s.savedAt,now);return {seconds:elapsed,revenue:s.totalEarned-earnedBefore,completed:s.cases-casesBefore,net:s.cash-cashBefore,expenses:(s.totalEarned-earnedBefore)-(s.cash-cashBefore)};}
