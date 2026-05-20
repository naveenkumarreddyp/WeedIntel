function getSelectedCrop(){return document.getElementById('cropSelector').value||'paddy_ap';}
function onCropChange(v){var pg=document.querySelector('.page.active');if(pg.id==='pg-weeddashboard')renderWeedDashboard();if(pg.id==='pg-segtool')renderSegTool();if(pg.id==='pg-prodlaunch')renderProdLaunch();var d=CROP_DATA[v];if(d)document.getElementById('topSub').textContent=d.crop+' \u2014 '+d.season+' \u00b7 '+d.state;}
function onWeedSelect(){renderWeedMap2();}
function getWeedImage(weedId){return WEED_IMAGES[weedId]||getMapImage(getSelectedCrop());}
function getMapImage(ck){return ck==='paddy_ap'?'ap_heatmap.png':'mh_heatmap.png';}
function sevColor(s){return s==='High'?'#e05c5c':s==='Medium'?'#e8b84b':'#6abf7b';}
function infColor(v){if(v>=60)return'#e05c5c';if(v>=40)return'#e8b84b';if(v>=25)return'#6abf7b';return'#2d6a3f';}
function typeColor(t){return t==='Grass'?'#6abf7b':t==='Sedge'?'#e8b84b':'#8dc49a';}
function sc(icon,label,val,color){return'<div class="wd-stat-card"><div class="wd-stat-label">'+label+'</div><div style="display:flex;justify-content:space-between;align-items:flex-end;"><div class="wd-stat-val" style="color:'+color+'">'+val+'</div><span style="font-size:22px;opacity:.6;">'+icon+'</span></div></div>';}
function ir(l,v){return'<div class="wd-info-row"><div class="wd-info-label">'+l+'</div><div class="wd-info-val">'+v+'</div></div>';}
function sb(l,c,col){return'<div style="display:flex;align-items:center;gap:6px;padding:2px 0;"><div style="width:10px;height:10px;border-radius:3px;background:'+col+';"></div><span style="font-size:12px;color:var(--textdim);">'+l+': </span><span style="font-size:12px;color:'+col+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">'+c+' districts</span></div>';}

function buildLeftPanel(imgPath, districts, getVal, label){
var sorted=districts.slice().sort(function(a,b){return getVal(b)-getVal(a);});
var h='<div style="display:flex;flex-direction:column;height:100%;">';
// Image
h+='<div style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;margin-bottom:14px;">';
h+='<img src="'+imgPath+'" alt="State Heatmap" style="width:100%;height:100%;max-height:400px;object-fit:contain;border-radius:10px;border:1px solid var(--border);"/>';
h+='</div>';
// Legend
h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;">';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#2d6a3f;"></div>Low</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Moderate</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Medium</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>High</div>';
h+='</div>';
// District dots grid
if(label) h+='<div style="font-size:9px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:8px;">'+label+'</div>';
h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;">';
sorted.forEach(function(d){
var v=getVal(d);
var c=infColor(v);
h+='<div style="display:flex;align-items:center;gap:6px;padding:4px 0;">';
h+='<div style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0;"></div>';
h+='<span style="font-size:11px;color:var(--textdim);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+d.name+'</span>';
h+='<span style="font-size:11px;color:'+c+';font-family:\'JetBrains Mono\',monospace;font-weight:600;flex-shrink:0;">'+v+'%</span>';
h+='</div>';
});
h+='</div></div>';
return h;
}

function renderWeedDashboard(){
var ck=getSelectedCrop();
var d=CROP_DATA[ck];if(!d)return;
document.getElementById('topTitle').textContent='Weed Dashboard';
document.getElementById('topSub').textContent=d.crop+' \u2014 '+d.season+' \u00b7 '+d.state;
document.getElementById('wdMapTitle').textContent=d.state+' \u2014 District Level';
var highM=d.districts.filter(function(m){return m.severity==='High';}).length;
document.getElementById('wdStatsGrid').innerHTML=
sc('\ud83d\udccb','TOTAL SURVEYS',d.stats.totalSurveys,'var(--accent)')+
sc('\ud83d\udccd','DISTRICTS COVERED',d.stats.mandals,'var(--amber)')+
sc('\ud83c\udf3f','WEED TYPES',d.stats.weedTypes,'var(--sage)')+
sc('\u26a0\ufe0f','HIGH SEVERITY',highM+' districts','var(--red)')+
sc('\ud83c\udf3e','FIELDS COVERED',d.stats.fieldsCovered,'var(--blue)')+
sc('\ud83d\udc65','AGENTS ACTIVE',d.stats.agentsActive,'var(--purple)');
document.getElementById('wdHeatmap1').innerHTML=buildLeftPanel(getMapImage(ck),d.districts,function(m){return m.infestation;},'DISTRICT-WISE INFESTATION');
document.getElementById('wdLegend1').innerHTML='';
renderInfoPanel1(d);
var sel=document.getElementById('wdWeedSelect');
sel.innerHTML=d.weeds.map(function(w){return'<option value="'+w.id+'">'+w.common+' ('+w.type+')</option>';}).join('');
renderWeedMap2();
}

function renderInfoPanel1(d){
var topW=d.weeds.reduce(function(a,b){return a.prevalence>b.prevalence?a:b;});
var sev={High:0,Medium:0,Low:0};
d.districts.forEach(function(m){sev[m.severity]++;});
var wf={};d.districts.forEach(function(m){wf[m.dominantWeed]=(wf[m.dominantWeed]||0)+1;});
var sorted=Object.keys(wf).sort(function(a,b){return wf[b]-wf[a];});
var ta=d.districts.reduce(function(s,m){return s+m.area;},0);
var ai=Math.round(d.districts.reduce(function(s,m){return s+m.infestation;},0)/d.districts.length);
document.getElementById('wdInfoPanel1').innerHTML=
ir('STATE OVERVIEW',d.state+' \u00b7 '+d.crop+' \u00b7 '+d.season)+
ir('TOTAL SURVEY AREA',ta.toLocaleString()+' acres across '+d.districts.length+' districts')+
'<div class="wd-info-row"><div class="wd-info-label">SEVERITY DISTRIBUTION</div>'+sb('High',sev.High,'#e05c5c')+sb('Medium',sev.Medium,'#e8b84b')+sb('Low',sev.Low,'#6abf7b')+'</div>'+
ir('AVG INFESTATION INDEX',ai+'% across all districts')+
'<div class="wd-info-row"><div class="wd-info-label">MAJOR WEED TYPES</div>'+
d.weeds.slice(0,4).map(function(w){return'<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:50%;background:'+typeColor(w.type)+';"></div><span style="font-size:12px;color:var(--textdim);">'+w.common+'</span></div><span style="font-size:10px;color:'+sevColor(w.severity)+';font-family:\'JetBrains Mono\',monospace;">'+w.prevalence+'%</span></div>';}).join('')+'</div>'+
'<div class="wd-info-row"><div class="wd-info-label">MOST PREVALENT WEED</div><div style="display:flex;align-items:center;gap:8px;margin-top:4px;"><div style="width:36px;height:36px;border-radius:8px;background:'+typeColor(topW.type)+'33;display:flex;align-items:center;justify-content:center;font-size:18px;">\ud83c\udf3f</div><div><div class="wd-info-val" style="color:'+typeColor(topW.type)+';">'+topW.common+'</div><div style="font-size:10px;color:var(--textmuted);font-style:italic;">'+topW.sci+'</div></div></div></div>'+
ir('MOST AFFECTED DISTRICT',sorted[0]+' (dominant in '+wf[sorted[0]]+' districts)');
}

function renderWeedMap2(){
var ck=getSelectedCrop();
var d=CROP_DATA[ck];if(!d)return;
var w=d.weeds.find(function(x){return x.id===document.getElementById('wdWeedSelect').value;})||d.weeds[0];
if(!w)return;
document.getElementById('wdHeatmap2').innerHTML=buildLeftPanel(getWeedImage(w.id),d.districts,function(m){return w.dist[m.name]||0;},w.common.toUpperCase()+' \u2014 DISTRICT PREVALENCE');
document.getElementById('wdLegend2').innerHTML='';
var vals=d.districts.map(function(m){return w.dist[m.name]||0;});
var mx=Math.max.apply(null,vals),mn=Math.min.apply(null,vals),av=Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length);
var hm=d.districts.filter(function(m){return(w.dist[m.name]||0)>=50;});
var best=d.districts.reduce(function(a,m){return(w.dist[m.name]||0)>(w.dist[a.name]||0)?m:a;});
document.getElementById('wdInfoPanel2').innerHTML=
'<div class="wd-info-row"><div class="wd-info-label">WEED IDENTITY</div><div class="wd-info-val" style="color:'+typeColor(w.type)+';font-size:16px;">'+w.common+'</div><div style="font-size:11px;color:var(--textmuted);font-style:italic;">'+w.sci+'</div><div style="display:flex;gap:4px;margin-top:6px;"><span style="padding:2px 8px;border-radius:4px;font-size:10px;background:'+typeColor(w.type)+'22;color:'+typeColor(w.type)+';border:1px solid '+typeColor(w.type)+'44;">'+w.type+'</span><span style="padding:2px 8px;border-radius:4px;font-size:10px;background:'+sevColor(w.severity)+'22;color:'+sevColor(w.severity)+';border:1px solid '+sevColor(w.severity)+'44;">'+w.severity+' Severity</span></div></div>'+
ir('AREA COVERED',w.areaCovered+' of total survey area')+
'<div class="wd-info-row"><div class="wd-info-label">PREVALENCE ACROSS DISTRICTS</div><div style="display:flex;align-items:center;gap:8px;margin-top:4px;"><div style="flex:1;height:6px;background:var(--border);border-radius:3px;"><div style="height:100%;width:'+w.prevalence+'%;background:'+typeColor(w.type)+';border-radius:3px;"></div></div><span style="font-size:12px;color:'+typeColor(w.type)+';font-family:\'JetBrains Mono\',monospace;">'+w.prevalence+'%</span></div></div>'+
ir('SEVERITY LEVEL','<span style="color:'+sevColor(w.severity)+';font-weight:600;">'+w.severity+'</span> \u2014 Avg: '+av+'% (Min: '+mn+'% / Max: '+mx+'%)')+
ir('MOST AFFECTED DISTRICT',best.name+' \u2014 '+(w.dist[best.name]||0)+'% prevalence')+
ir('HIGH INFESTATION DISTRICTS',hm.length?hm.map(function(m){return m.name;}).join(', '):'None above 50%')+
ir('RECOMMENDED CONTROL','<span style="color:var(--amber);">'+w.control+'</span>')+
'<div class="wd-info-row"><div class="wd-info-label">COMPETITOR PRODUCTS</div>'+w.competitor.map(function(c){return'<div style="display:flex;align-items:center;gap:6px;padding:3px 0;"><div style="width:6px;height:6px;border-radius:50%;background:var(--purple);"></div><span style="font-size:12px;color:var(--textdim);">'+c+'</span></div>';}).join('')+'</div>';
}
