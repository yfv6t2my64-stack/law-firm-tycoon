const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function sceneEngine(){
 const root=path.resolve(__dirname,'..'),source=require('../source-order.json');
 const context=vm.createContext({console,Intl,Date,matchMedia:()=>({matches:false}),setTimeout:()=>0});
 vm.runInContext(source.filter(x=>x!=='app.js'&&x!=='expansion-ui.js').map(x=>fs.readFileSync(path.join(root,'src',x),'utf8')).join('\n')+"\n globalThis.s=fresh(); globalThis.escapeHTML=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');globalThis.money=n=>'₺'+Math.round(n);globalThis.view={sceneStructure,officeSceneMode,sceneRefresh,staffCount,officeFigure};",context);
 return context;
}
test('living office is based on current staff and office',()=>{
 const ctx=sceneEngine();let markup=ctx.view.sceneStructure();
 assert.match(markup,/YAŞAYAN OFİS/);assert.match(markup,/2 karakter/);
 vm.runInContext('s.staff[0]=4;s.officeTier=3',ctx);
 markup=ctx.view.sceneStructure();assert.match(markup,/6 karakter/);
});
test('graphics quality persists through hydration',()=>{
 const ctx=sceneEngine();
 vm.runInContext("s.graphicsMode='off'",ctx);
 assert.equal(ctx.view.officeSceneMode(),'off');
 assert.equal(vm.runInContext('hydrate(JSON.parse(JSON.stringify(s))).graphicsMode',ctx),'off');
 vm.runInContext("s.graphicsMode='invalid'",ctx);
 assert.equal(ctx.view.officeSceneMode(),'balanced');
});
test('office figures are valid SVG markup',()=>{
 const ctx=sceneEngine();assert.match(ctx.view.officeFigure(120,140,0),/office-person/);
});
