function plTab(t,el){['opp','matrix','battle','roadmap'].forEach(function(x){document.getElementById('pl-'+x).style.display='none';});document.getElementById('pl-'+t).style.display='block';document.querySelectorAll('#pg-prodlaunch .tab-bar .tab').forEach(function(x){x.classList.remove('active');});el.classList.add('active');}
function renderProdLaunch(){var ck=getSelectedCrop();var d=PL_DATA[ck];if(!d)return;renderPLOpp(d,ck);renderPLMatrix(d,ck);renderPLBattle(d);renderPLRoadmap(d);}
function plIR(l,v){return'<div class="wd-info-row"><div class="wd-info-label">'+l+'</div><div class="wd-info-val">'+v+'</div></div>';}
function renderPLOpp(d,ck){
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
h+='<div><div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:8px;">'+d.scenario.geography+' \u2014 Unmet Opportunity Index</div>';
h+='<img src="'+PL_IMAGES[ck]+'" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
h+='<div style="display:flex;gap:10px;margin:10px 0;">';
['#6abf7b:High Opp','#e8b84b:Medium','#e05c5c:Low'].forEach(function(x){var p=x.split(':');h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--textdim);"><div style="width:10px;height:10px;border-radius:3px;background:'+p[0]+';"></div>'+p[1]+'</div>';});
h+='</div>';
h+='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 10px;">';
d.districts.forEach(function(r){var c=r.unmetOpp>=70?'#6abf7b':r.unmetOpp>=45?'#e8b84b':'#e05c5c';h+='<div style="display:flex;align-items:center;gap:5px;padding:3px 0;cursor:pointer;" onclick="showPLDistrict(\''+r.name.replace(/'/g,"\\'")+'\')" title="Click for details"><div style="width:7px;height:7px;border-radius:50%;background:'+c+';"></div><span style="font-size:10px;color:var(--textdim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+r.name+'</span><span style="font-size:10px;color:'+c+';font-family:\'JetBrains Mono\',monospace;">'+r.unmetOpp+'%</span></div>';});
h+='</div></div>';
h+='<div class="wd-info-panel">';
h+=plIR('CANDIDATE PRODUCT','<span style="color:var(--accent);font-size:14px;font-weight:600;">'+d.scenario.product+'</span>');
h+=plIR('TARGET CROP',d.scenario.crop);
h+=plIR('TARGET WEEDS',d.scenario.targetWeeds.join(', '));
h+=plIR('TOTAL ADDRESSABLE','\u20b9'+d.impact.totalPotCr+' Cr across '+d.impact.districtsTargeted+' districts');
h+='<div class="wd-info-row"><div class="wd-info-label">WAVE SUMMARY</div>';
[{l:'Wave 1 (Attack)',n:d.impact.wave1Count,v:d.impact.wave1Cr,c:'#6abf7b'},{l:'Wave 2 (Expand)',n:d.impact.wave2Count,v:d.impact.wave2Cr,c:'#e8b84b'},{l:'Wave 3 (Monitor)',n:d.impact.wave3Count,v:d.impact.wave3Cr,c:'#e05c5c'}].forEach(function(w){h+='<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #1e3d2722;"><span style="font-size:11px;color:var(--textdim);">'+w.l+' ('+w.n+' districts)</span><span style="font-size:12px;color:'+w.c+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">\u20b9'+w.v+' Cr</span></div>';});
h+='</div>';
h+='<div class="wd-info-row" id="plDistrictDetail"><div class="wd-info-label">DISTRICT DETAIL</div><div style="font-size:11px;color:var(--textmuted);padding:12px 0;text-align:center;">Click a district on the map for details</div></div>';
h+='</div></div>';
document.getElementById('pl-opp').innerHTML=h;
}
function showPLDistrict(name){
var ck=getSelectedCrop();var d=PL_DATA[ck];var r=d.districts.find(function(x){return x.name===name;});if(!r)return;
var el=document.getElementById('plDistrictDetail');if(!el)return;
var h='<div class="wd-info-label">\ud83d\udccd '+r.name+' \u2014 Detail</div>';
h+='<div style="font-size:11px;color:var(--textdim);margin:6px 0;"><strong>Top Weeds:</strong> '+r.topWeeds.join(', ')+'</div>';
h+='<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Competitors:</strong> '+r.competitors.join(', ')+'</div>';
h+='<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Est. Potential:</strong> <span style="color:var(--accent);font-weight:600;">\u20b9'+r.estPotCr+' Cr</span></div>';
h+='<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Product Fit:</strong> <span style="color:'+(r.productFit==='Strong'?'#6abf7b':'#e8b84b')+';">'+r.productFit+'</span></div>';
h+='<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Wave:</strong> '+r.wave+'</div>';
el.innerHTML=h;
}
function renderPLMatrix(d,ck){
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
h+='<div><div style="font-size:11px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;margin-bottom:8px;">WEED \u00d7 AREA PRIORITIZATION MATRIX</div>';
h+='<img src="'+PL_MATRIX_IMAGES[ck]+'" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
h+='<div style="display:flex;gap:12px;margin-top:10px;justify-content:center;">';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Wave 1 (Attack)</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Selective Battle</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>Avoid</div>';
h+='</div>';
h+='</div>';
h+='<div class="wd-info-panel">';
h+='<div class="wd-info-row" style="border-left:3px solid #6abf7b;"><div class="wd-info-label">\ud83c\udfaf WAVE 1: ATTACK</div><div style="font-size:11px;color:var(--textdim);">High opportunity + Low competition</div><div style="font-size:10px;color:#6abf7b;margin-top:4px;">'+d.districts.filter(function(r){return r.wave===1;}).map(function(r){return r.name;}).join(', ')+'</div></div>';
h+='<div class="wd-info-row" style="border-left:3px solid #e8b84b;"><div class="wd-info-label">\u2694\ufe0f SELECTIVE BATTLE</div><div style="font-size:11px;color:var(--textdim);">High opportunity + High competition \u2014 Differentiate</div><div style="font-size:10px;color:#e8b84b;margin-top:4px;">'+d.districts.filter(function(r){return r.wave===2;}).map(function(r){return r.name;}).join(', ')+'</div></div>';
h+='<div class="wd-info-row" style="border-left:3px solid #555;"><div class="wd-info-label">\u23ec DEPRIORITIZE</div><div style="font-size:11px;color:var(--textdim);">Low opportunity + Low competition</div><div style="font-size:10px;color:var(--textmuted);margin-top:4px;">Monitor for future waves</div></div>';
h+='<div class="wd-info-row" style="border-left:3px solid #e05c5c;"><div class="wd-info-label">\ud83d\udeab AVOID</div><div style="font-size:11px;color:var(--textdim);">Low opportunity + High competition</div><div style="font-size:10px;color:#e05c5c;margin-top:4px;">'+d.districts.filter(function(r){return r.wave===3;}).map(function(r){return r.name;}).join(', ')+'</div></div>';
h+='<div class="wd-info-row"><div class="wd-info-label">BUBBLE LEGEND</div><div style="font-size:10px;color:var(--textmuted);line-height:1.6;">Size = Market Potential (\u20b9Cr)<br>Color: <span style="color:#6abf7b;">Strong Fit</span> \u00b7 <span style="color:#e8b84b;">Moderate</span> \u00b7 <span style="color:#e05c5c;">Weak</span></div></div>';
h+='</div></div>';
document.getElementById('pl-matrix').innerHTML=h;
}
function renderPLBattle(d){
var allMol={};d.districts.forEach(function(r){for(var m in r.molecules){allMol[m]=(allMol[m]||0)+r.molecules[m];}});
var molNames=Object.keys(allMol).sort(function(a,b){return allMol[b]-allMol[a];});
var molColors={'Pretilachlor':'#6abf7b','Bispyribac':'#e8b84b','Pyrazosulfuron':'#8dc49a','Cyhalofop':'#e05c5c','2,4-D':'#9b7fcf','Atrazine':'#6abf7b','Halosulfuron':'#e8b84b','Tembotrione':'#4a9eff','Topramezone':'#ff8c42','Bensulfuron':'#f06292','Metsulfuron':'#80cbc4','Butachlor':'#bcaaa4','Oxadiazon':'#ce93d8','Others':'#78909c'};
var h='<div style="margin-bottom:18px;"><div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:12px;">\ud83e\udea8 Competitor Molecule Coverage by District</div>';
h+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">';
molNames.forEach(function(m){var c=molColors[m]||'#78909c';h+='<div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--textdim);"><div style="width:10px;height:10px;border-radius:2px;background:'+c+';"></div>'+m+'</div>';});
h+='</div>';
d.districts.forEach(function(r){
h+='<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:10px;color:var(--textdim);">'+r.name+'</span><span style="font-size:9px;color:var(--textmuted);">\u20b9'+r.estPotCr+'Cr</span></div>';
h+='<div style="display:flex;height:18px;border-radius:4px;overflow:hidden;">';
for(var m in r.molecules){var c=molColors[m]||'#78909c';h+='<div style="width:'+r.molecules[m]+'%;background:'+c+';display:flex;align-items:center;justify-content:center;" title="'+m+': '+r.molecules[m]+'%"><span style="font-size:7px;color:#000;font-weight:600;">'+((r.molecules[m]>=15)?r.molecules[m]+'%':'')+'</span></div>';}
h+='</div></div>';
});
h+='</div>';
h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px;">';
h+='<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;"><div style="font-size:11px;color:var(--accent);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:10px;">COMPETITOR SHARE</div>';
var allComp={};d.districts.forEach(function(r){for(var c in r.compShare){allComp[c]=(allComp[c]||0)+r.compShare[c];}});
var total=Object.values(allComp).reduce(function(a,b){return a+b;},0);
var compSorted=Object.keys(allComp).sort(function(a,b){return allComp[b]-allComp[a];});
compSorted.forEach(function(c){var pct=Math.round(allComp[c]/total*100);var cc=c==='Generic'?'#78909c':c==='UPL'?'#e05c5c':c==='Bayer'?'#4a9eff':c==='Syngenta'?'#6abf7b':c==='DuPont'?'#e8b84b':c==='Dhanuka'?'#9b7fcf':c==='Dow'?'#ff8c42':'#f06292';
h+='<div style="margin-bottom:6px;"><div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;"><span style="color:var(--textdim);">'+c+'</span><span style="color:'+cc+';font-family:\'JetBrains Mono\',monospace;">'+pct+'%</span></div><div style="height:6px;background:var(--border);border-radius:3px;"><div style="height:100%;width:'+pct+'%;background:'+cc+';border-radius:3px;"></div></div></div>';});
h+='</div>';
h+='<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;"><div style="font-size:11px;color:var(--amber);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:10px;">GAP OPPORTUNITIES</div>';
var gapMap={};d.districts.forEach(function(r){r.gaps.forEach(function(g){if(g&&g!=='None'&&g!=='Saturated market'&&g!=='Saturated; no clear gap'&&g!=='None significant'&&g!=='Limited; soybean-dominant'&&g!=='Minimal; paddy not primary'&&g!=='Limited gap; incumbents strong'&&g!=='Limited differentiation possible'){gapMap[g]=(gapMap[g]||0)+1;}});});
var gapSorted=Object.keys(gapMap).sort(function(a,b){return gapMap[b]-gapMap[a];});
gapSorted.slice(0,8).forEach(function(g){h+='<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;border-bottom:1px solid #1e3d2722;"><div style="width:6px;height:6px;border-radius:50%;background:var(--amber);margin-top:4px;flex-shrink:0;"></div><span style="font-size:10px;color:var(--textdim);">'+g+' <span style="color:var(--amber);font-family:\'JetBrains Mono\',monospace;">('+gapMap[g]+' districts)</span></span></div>';});
h+='</div></div>';
document.getElementById('pl-battle').innerHTML=h;
}
function renderPLRoadmap(d){
var waves=[{n:1,label:'Wave 1 \u2014 Attack',color:'#6abf7b',season:'Kharif 2025',desc:'Priority launch districts'},{n:2,label:'Wave 2 \u2014 Expand',color:'#e8b84b',season:'Rabi 2025 / Kharif 2026',desc:'Expansion with pre-mix opportunity'},{n:3,label:'Wave 3 \u2014 Monitor',color:'#e05c5c',season:'Kharif 2026+',desc:'Long-term expansion targets'}];
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
h+='<div>';
waves.forEach(function(w){
var wd=d.districts.filter(function(r){return r.wave===w.n;});
var pot=wd.reduce(function(s,r){return s+r.estPotCr;},0).toFixed(1);
h+='<div style="background:var(--surface);border:1px solid '+w.color+'33;border-left:4px solid '+w.color+';border-radius:10px;padding:14px;margin-bottom:12px;">';
h+='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><div style="font-size:13px;color:'+w.color+';font-weight:600;">'+w.label+'</div><div style="font-size:10px;color:var(--textmuted);">'+w.season+' \u00b7 \u20b9'+pot+' Cr</div></div>';
h+='<div style="font-size:10px;color:var(--textmuted);margin-bottom:10px;">'+w.desc+'</div>';
h+='<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr>';
['District','Target Weeds','Rationale'].forEach(function(c){h+='<th style="text-align:left;padding:6px;font-size:8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);letter-spacing:.5px;">'+c+'</th>';});
h+='</tr></thead><tbody>';
wd.forEach(function(r){
h+='<tr style="border-bottom:1px solid #1e3d2722;"><td style="padding:6px;font-size:11px;color:var(--text);white-space:nowrap;">'+r.name+'</td><td style="padding:6px;font-size:10px;color:var(--textdim);">'+r.topWeeds.slice(0,2).join(', ')+'</td><td style="padding:6px;font-size:10px;color:var(--textdim);max-width:200px;">'+r.waveReason.substring(0,60)+'</td></tr>';});
h+='</tbody></table></div></div>';
});
h+='</div>';
h+='<div class="wd-info-panel">';
h+='<div class="wd-info-row"><div class="wd-info-label">\u2699\ufe0f STAGE GATES</div>';
var sg=d.stageGates;
['regulatory:Regulatory Readiness','supply:Supply Readiness','distributor:Distributor Onboarding'].forEach(function(x){
var p=x.split(':');var v=sg[p[0]];var c=v==='High'?'#6abf7b':v==='Medium'?'#e8b84b':'#e05c5c';
h+='<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e3d2722;"><span style="font-size:11px;color:var(--textdim);">'+p[1]+'</span>';
h+='<select class="inp" id="sg_'+p[0]+'" style="width:80px;padding:2px 6px;font-size:10px;" onchange="recalcImpact()"><option'+(v==='High'?' selected':'')+'>High</option><option'+(v==='Medium'?' selected':'')+'>Medium</option><option'+(v==='Low'?' selected':'')+'>Low</option></select></div>';
});
h+='</div>';
h+='<div class="wd-info-row" id="plImpactPanel"><div class="wd-info-label">PROJECTED IMPACT</div>';
h+=impactHTML(d);
h+='</div>';
h+='<div style="margin-top:8px;"><button class="btn btn-primary" style="width:100%;font-size:12px;" onclick="recalcImpact()">\u21bb Recalculate Impact</button></div>';
h+='</div></div>';
document.getElementById('pl-roadmap').innerHTML=h;
}
function impactHTML(d){
var h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
h+='<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:var(--accent);font-family:\'Playfair Display\',serif;">\u20b9'+d.impact.totalPotCr+'</div><div style="font-size:9px;color:var(--textmuted);">Total (Cr)</div></div>';
h+='<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:#6abf7b;font-family:\'Playfair Display\',serif;">\u20b9'+d.impact.wave1Cr+'</div><div style="font-size:9px;color:var(--textmuted);">Wave 1 (Cr)</div></div>';
h+='<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:#e8b84b;font-family:\'Playfair Display\',serif;">'+d.impact.districtsTargeted+'</div><div style="font-size:9px;color:var(--textmuted);">Districts</div></div>';
h+='<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:var(--text);font-family:\'Playfair Display\',serif;">'+d.impact.wave1Count+'</div><div style="font-size:9px;color:var(--textmuted);">Wave 1 Districts</div></div>';
h+='</div>';return h;
}
function recalcImpact(){
var ck=getSelectedCrop();var d=PL_DATA[ck];if(!d)return;
var reg=document.getElementById('sg_regulatory').value;
var sup=document.getElementById('sg_supply').value;
var dist=document.getElementById('sg_distributor').value;
var mult=1;if(reg==='Medium')mult*=0.85;if(reg==='Low')mult*=0.6;
if(sup==='Medium')mult*=0.9;if(sup==='Low')mult*=0.65;
if(dist==='Medium')mult*=0.92;if(dist==='Low')mult*=0.7;
var adj={totalPotCr:+(d.impact.totalPotCr*mult).toFixed(1),wave1Cr:+(d.impact.wave1Cr*mult).toFixed(1),wave2Cr:+(d.impact.wave2Cr*mult).toFixed(1),wave3Cr:+(d.impact.wave3Cr*mult).toFixed(1),districtsTargeted:d.impact.districtsTargeted,wave1Count:d.impact.wave1Count};
if(reg==='Low')adj.wave1Count=Math.max(2,adj.wave1Count-2);
if(sup==='Low')adj.districtsTargeted=Math.max(5,adj.districtsTargeted-3);
var panel=document.getElementById('plImpactPanel');
if(panel)panel.innerHTML='<div class="wd-info-label">PROJECTED IMPACT (ADJUSTED)</div>'+impactHTML({impact:adj})+'<div style="font-size:9px;color:var(--amber);margin-top:6px;font-style:italic;">Adjusted by stage gate readiness factors (x'+mult.toFixed(2)+')</div>';
}
