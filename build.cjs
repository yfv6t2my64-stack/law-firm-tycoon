const fs=require('node:fs');const path=require('node:path');
const root=__dirname;const order=require('./source-order.json');
const shell=fs.readFileSync(path.join(root,'src/index.html'),'utf8');
const script=order.map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
new (require('node:vm').Script)(script);
const html=shell.replace('<!--STYLE-->',()=>'<style>'+fs.readFileSync(path.join(root,'src/style.css'),'utf8')+'</style>').replace('<!--SCRIPTS-->',()=>'<script>'+script+'</script>');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/index.html'),html);fs.writeFileSync(path.join(root,'index.html'),html);fs.writeFileSync(path.join(root,'dist/.nojekyll'),'');console.log('Built dist/index.html and index.html ('+Buffer.byteLength(html)+' bytes). No external assets.');
