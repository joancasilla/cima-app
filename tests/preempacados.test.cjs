// Ejecutar: node --test tests/preempacados.test.cjs
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const fields=html.slice(html.indexOf('  const CAMPOS_REQUERIDOS=['),html.indexOf('  // ═',html.indexOf('  const CAMPOS_REQUERIDOS=[')));
const mapping=html.slice(html.indexOf('  function normalizarEncabezado('),html.indexOf('  function construirMapeo('));
const grouping=html.slice(html.indexOf('  function agruparPreempacados('),html.indexOf('  function cambiarPaquetes('));
const ctx=vm.createContext({});vm.runInContext(fields+mapping+grouping,ctx);
const headers=['Apto','Código del preempacado','Fase','Codigo','Descripcion','Unidad','Cantidad','Cantidad a empacar'];
const col=ctx.detectarColumnas(headers);
const rows=[['RA2','KIT-RA2-PRE','Preinstalación','MAT-1','Arandela','U',4,5],['RA2','KIT-RA2-PRE','Preinstalación','MAT-2','Llave','U',14,5],['RA2','KIT-RA2-INST','Instalación','MAT-3','Sifón','U',2,3]];
test('Mapea los ocho campos sin confundir códigos ni cantidades',()=>{
 assert.equal(Object.keys(col).length,8);assert.equal(col.preempacado,1);assert.equal(col.codigo,3);assert.equal(col.cantidad,6);assert.equal(col.cantEmpacar,7);
});
test('Agrupa por código y toma la cantidad repetida una sola vez',()=>{
 const g=ctx.agruparPreempacados(rows,col,5);assert.equal(g.length,2);assert.equal(g[0].items.length,2);assert.equal(g[0].cantEmpacar,5);assert.equal(g[0].items[1].cantUnitaria,14);assert.equal(g[1].cantEmpacar,3);
});
test('Sin cantidad propone un paquete editable',()=>{
 const g=ctx.agruparPreempacados(rows.map(r=>r.slice(0,7)),col);assert.equal(g[0].cantEmpacar,1);assert.equal(g[0].cantidadPropuesta,true);
});
test('Rechaza cantidades contradictorias, cero, negativas, decimales y texto',()=>{
 for(const qty of [6,0,-1,1.5,'abc']){const bad=rows.map(r=>r.slice());bad[1][7]=qty;assert.throws(()=>ctx.agruparPreempacados(bad,col));}
});
test('No pierde filas con campos incompletos ni mezcla Apto/Fase',()=>{
 for(const [column,value] of [[0,''],[1,''],[2,''],[4,''],[0,'RB1'],[2,'Otra fase'],[6,0]]){
  const bad=rows.map(r=>r.slice());bad[1][column]=value;assert.throws(()=>ctx.agruparPreempacados(bad,col));
 }
});
test('Tolera filas vacías y mantiene códigos especiales',()=>{
 const data=rows.map(r=>r.slice());data[0][1]='__proto__';const groups=ctx.agruparPreempacados([...data,[]],col);assert.equal(groups.length,3);assert.equal(groups[0].codigoPreempacado,'__proto__');
});
