function segTab(tab,el){
['opp','flora','comp','micro'].forEach(function(t){document.getElementById('seg-'+t).style.display='none';});
document.getElementById('seg-'+tab).style.display='block';
document.querySelectorAll('#pg-segtool .tab-bar .tab').forEach(function(t){t.classList.remove('active');});
el.classList.add('active');
}
function renderSegTool(){
var ck=getSelectedCrop();var cd=CROP_DATA[ck];var sd=SEG_DATA[ck];var si=SEG_IMAGES[ck];
if(!sd||!cd)return;
renderOppMap(sd,si,cd);renderFloraTab(sd,cd);renderCompTab(sd,si,cd);renderMicroTab(sd,cd);
}
function tierCard(t,tier){
var h='<div class="wd-info-row" style="border-left:3px solid '+tier.color+';">';
h+='<div class="wd-info-label">'+tier.label+'</div>';
h+='<div style="display:flex;justify-content:space-between;margin:6px 0;"><span style="font-size:20px;font-family:\'Playfair Display\',serif;color:'+tier.color+';">\u20b9'+tier.potential+' Cr</span><span style="font-size:11px;color:var(--textmuted);">'+tier.districts.length+' districts</span></div>';
h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;">';
h+='<div><span style="color:var(--textmuted);">Weed Pressure:</span> <span style="color:'+tier.color+';">'+tier.weedPressure+'</span></div>';
h+='<div><span style="color:var(--textmuted);">Severity:</span> <span style="color:'+tier.color+';">'+tier.severity+'</span></div>';
h+='<div><span style="color:var(--textmuted);">Farmer Awareness:</span> <span style="color:'+tier.color+';">'+tier.farmerAwareness+'</span></div>';
h+='<div><span style="color:var(--textmuted);">Product Fit:</span> <span style="color:'+tier.color+';">'+tier.productFit+'</span></div>';
h+='</div>';
h+='<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">';
tier.districts.forEach(function(d){h+='<span style="padding:2px 8px;border-radius:4px;font-size:10px;background:'+tier.color+'18;color:'+tier.color+';border:1px solid '+tier.color+'33;">'+d+'</span>';});
h+='</div></div>';return h;
}
function renderOppMap(sd,si,cd){
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
h+='<div><img src="'+si.opp+'" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
h+='<div style="display:flex;gap:12px;margin-top:10px;">';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Tier 1 - Easy to Win</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Tier 2 - Competitive</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>Tier 3 - No Go</div>';
h+='</div>';
h+='<div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;">';
sd.districts.forEach(function(d){
var c=d.tier==='Tier 1'?'#6abf7b':d.tier==='Tier 2'?'#e8b84b':'#e05c5c';
h+='<div style="display:flex;align-items:center;gap:6px;padding:4px 0;"><div style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0;"></div><span style="font-size:11px;color:var(--textdim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+d.name+'</span><span style="font-size:10px;color:'+c+';font-family:\'JetBrains Mono\',monospace;">'+d.targetArea+'%</span></div>';
});
h+='</div></div>';
h+='<div class="wd-info-panel">'+tierCard('tier1',sd.tiers.tier1)+tierCard('tier2',sd.tiers.tier2)+tierCard('tier3',sd.tiers.tier3);
var totalP=(sd.tiers.tier1.potential+sd.tiers.tier2.potential+sd.tiers.tier3.potential).toFixed(1);
h+=ir('TOTAL ADDRESSABLE MARKET','\u20b9'+totalP+' Cr across '+sd.districts.length+' districts');
h+='</div></div>';
document.getElementById('seg-opp').innerHTML=h;
}
function renderFloraTab(sd,cd){
var weeds=cd.weeds;
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;margin-bottom:18px;">';
h+='<div><select class="wd-weed-select" id="segFloraWeed" onchange="updateFloraMap()" style="margin-bottom:14px;width:100%;">';
weeds.forEach(function(w){h+='<option value="'+w.id+'">'+w.common+' ('+w.type+')</option>';});
h+='</select>';
h+='<div id="segFloraMapImg"></div>';
h+='<div style="display:flex;gap:12px;margin-top:10px;">';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>High</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Medium</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Low</div>';
h+='</div></div>';
h+='<div class="wd-info-panel" id="segFloraInfo"></div>';
h+='</div>';
// Flora matrix table
h+='<div class="wd-section" style="margin:0;"><div class="wd-section-title">\ud83d\udcca Weed Flora Matrix \u2014 District vs Weed Type</div>';
h+='<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr>';
h+='<th style="text-align:left;padding:8px;font-size:9px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);letter-spacing:1px;">DISTRICT</th>';
weeds.forEach(function(w){h+='<th style="text-align:center;padding:8px;font-size:9px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);letter-spacing:0.5px;white-space:nowrap;">'+w.common.split(' ')[0]+'</th>';});
h+='</tr></thead><tbody>';
sd.floraMatrix.forEach(function(row){
h+='<tr style="border-bottom:1px solid #1e3d2722;">';
h+='<td style="padding:7px 8px;font-size:11px;color:var(--textdim);white-space:nowrap;">'+row.name+'</td>';
weeds.forEach(function(w){
var v=row[w.common]||'—';var c=v==='High'?'#e05c5c':v==='Medium'?'#e8b84b':v==='Low'?'#6abf7b':'var(--textmuted)';
var bg=v==='High'?'#e05c5c18':v==='Medium'?'#e8b84b18':v==='Low'?'#6abf7b18':'transparent';
h+='<td style="text-align:center;padding:7px 8px;font-size:10px;color:'+c+';background:'+bg+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">'+v+'</td>';
});
h+='</tr>';
});
h+='</tbody></table></div></div>';
document.getElementById('seg-flora').innerHTML=h;
updateFloraMap();
}
function updateFloraMap(){
var ck=getSelectedCrop();var cd=CROP_DATA[ck];var sd=SEG_DATA[ck];
var wid=document.getElementById('segFloraWeed').value;
var w=cd.weeds.find(function(x){return x.id===wid;})||cd.weeds[0];
var img=WEED_IMAGES[w.id]||getMapImage(ck);
document.getElementById('segFloraMapImg').innerHTML='<img src="'+img+'" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
var hotspots=sd.floraMatrix.filter(function(r){return r[w.common]==='High';}).length;
var medCount=sd.floraMatrix.filter(function(r){return r[w.common]==='Medium';}).length;
var t1=sd.districts.filter(function(d){return d.tier==='Tier 1';});
var t1weeds=t1.filter(function(d){var row=sd.floraMatrix.find(function(r){return r.name===d.name;});return row&&(row[w.common]==='High'||row[w.common]==='Medium');}).length;
document.getElementById('segFloraInfo').innerHTML=
ir('SELECTED WEED','<span style="color:'+typeColor(w.type)+';font-size:15px;font-weight:600;">'+w.common+'</span><br><span style="font-size:10px;color:var(--textmuted);font-style:italic;">'+w.sci+'</span>')+
ir('HOTSPOT DISTRICTS','<span style="color:#e05c5c;font-size:18px;font-family:\'Playfair Display\',serif;">'+hotspots+'</span> <span style="color:var(--textmuted);font-size:11px;">High severity districts</span>')+
ir('MODERATE PRESENCE','<span style="color:#e8b84b;font-size:18px;font-family:\'Playfair Display\',serif;">'+medCount+'</span> <span style="color:var(--textmuted);font-size:11px;">Medium severity districts</span>')+
ir('AREA PREVALENCE',w.areaCovered+' of surveyed area')+
ir('TIER 1 OVERLAP',t1weeds+' of '+t1.length+' Tier 1 markets affected')+
ir('CONTROL STRATEGY','<span style="color:var(--amber);">'+w.control+'</span>')+
ir('WEED TYPE','<span style="padding:2px 8px;border-radius:4px;font-size:10px;background:'+typeColor(w.type)+'22;color:'+typeColor(w.type)+';border:1px solid '+typeColor(w.type)+'44;">'+w.type+'</span>');
}
function renderCompTab(sd,si,cd){
var ci=sd.compInsights;
var h='<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
h+='<div><img src="'+si.comp+'" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
h+='<div style="display:flex;gap:12px;margin-top:10px;">';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>Strong</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Moderate</div>';
h+='<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Low</div>';
h+='</div>';
h+='<div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px 12px;">';
sd.districts.forEach(function(d){
var c=d.compStrength==='Strong'?'#e05c5c':d.compStrength==='Moderate'?'#e8b84b':'#6abf7b';
h+='<div style="display:flex;align-items:center;gap:6px;padding:4px 0;"><div style="width:8px;height:8px;border-radius:50%;background:'+c+';flex-shrink:0;"></div><span style="font-size:11px;color:var(--textdim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+d.name+'</span><span style="font-size:10px;color:'+c+';font-family:\'JetBrains Mono\',monospace;">'+d.compStrength.charAt(0)+'</span></div>';
});
h+='</div></div>';
var strong=sd.districts.filter(function(d){return d.compStrength==='Strong';}).length;
var mod=sd.districts.filter(function(d){return d.compStrength==='Moderate';}).length;
var low=sd.districts.filter(function(d){return d.compStrength==='Low';}).length;
h+='<div class="wd-info-panel">';
h+='<div class="wd-info-row"><div class="wd-info-label">COMPETITOR STRENGTH</div>';
h+=sb2('Strong',strong,'#e05c5c')+sb2('Moderate',mod,'#e8b84b')+sb2('Low',low,'#6abf7b');
h+='</div>';
h+='<div class="wd-info-row"><div class="wd-info-label">FARMER SATISFACTION WITH COMPETITORS</div>';
h+=sb2('Low (Opportunity)',ci.farmerSatLow,'#6abf7b')+sb2('Medium',ci.farmerSatMed,'#e8b84b')+sb2('High (Locked)',ci.farmerSatHigh,'#e05c5c');
h+='</div>';
h+='<div class="wd-info-row"><div class="wd-info-label">CONVERSION OPPORTUNITIES</div>';
h+='<div style="margin-top:4px;">';
h+=convRow('\u26a0\ufe0f Weed Escape Issues',ci.weedEscape,'#e8b84b');
h+=convRow('\u274c Ineffective Control',ci.ineffective,'#e05c5c');
h+=convRow('\u2705 Strong Product Fit',ci.strongFit,'#6abf7b');
h+='</div></div>';
h+=ir('TOTAL CONVERSION PIPELINE','<span style="color:var(--accent);font-size:20px;font-family:\'Playfair Display\',serif;">'+ci.convTotal+'</span> <span style="color:var(--textmuted);font-size:11px;">addressable districts</span>');
h+='</div></div>';
document.getElementById('seg-comp').innerHTML=h;
}
function sb2(l,c,col){return'<div style="display:flex;align-items:center;gap:6px;padding:3px 0;"><div style="width:10px;height:10px;border-radius:3px;background:'+col+';"></div><span style="font-size:12px;color:var(--textdim);">'+l+':</span><span style="font-size:13px;color:'+col+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">'+c+' districts</span></div>';}
function convRow(label,count,color){return'<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #1e3d2722;"><span style="font-size:12px;color:var(--textdim);">'+label+'</span><span style="font-size:12px;color:'+color+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">'+count+' districts</span></div>';}

function renderMicroTab(sd,cd){
var h='<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr>';
var cols=['DISTRICT','SEGMENT','WEED PRESENCE','COMPETITOR','TARGET AREA','INTELLIGENCE'];
cols.forEach(function(c){h+='<th style="text-align:left;padding:10px 8px;font-size:9px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);letter-spacing:1px;white-space:nowrap;">'+c+'</th>';});
h+='</tr></thead><tbody>';
sd.districts.forEach(function(d,i){
var sc=d.segment==='Easy to Win'?'#6abf7b':d.segment==='Competitive'?'#e8b84b':'#e05c5c';
h+='<tr style="border-bottom:1px solid #1e3d2722;">';
h+='<td style="padding:10px 8px;font-size:12px;color:var(--text);font-weight:500;">'+d.name+'</td>';
h+='<td style="padding:10px 8px;"><span style="padding:3px 10px;border-radius:4px;font-size:10px;background:'+sc+'18;color:'+sc+';border:1px solid '+sc+'33;">'+d.segment+'</span></td>';
h+='<td style="padding:10px 8px;font-size:11px;color:var(--textdim);max-width:160px;">'+d.weeds+'</td>';
h+='<td style="padding:10px 8px;font-size:11px;color:var(--textdim);max-width:160px;">'+d.competitor+'</td>';
h+='<td style="padding:10px 8px;text-align:center;"><div style="display:flex;align-items:center;gap:6px;"><div style="flex:1;height:6px;background:var(--border);border-radius:3px;"><div style="height:100%;width:'+d.targetArea+'%;background:'+sc+';border-radius:3px;"></div></div><span style="font-size:11px;color:'+sc+';font-family:\'JetBrains Mono\',monospace;">'+d.targetArea+'%</span></div></td>';
h+='<td style="padding:10px 8px;"><button class="btn btn-outline" style="font-size:10px;padding:5px 12px;" onclick="showIntelCard(\''+d.name.replace(/'/g,"\\'")+'\')">View \u2192</button></td>';
h+='</tr>';
});
h+='</tbody></table></div>';
h+='<div id="intelCardOverlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);z-index:1000;display:none;align-items:center;justify-content:center;"><div id="intelCardContent" style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;max-width:520px;width:90%;max-height:80vh;overflow-y:auto;animation:fadeIn .3s ease;"></div></div>';
document.getElementById('seg-micro').innerHTML=h;
}
function showIntelCard(distName){
var ck=getSelectedCrop();var sd=SEG_DATA[ck];
var d=sd.districts.find(function(x){return x.name===distName;});
if(!d)return;
var sc=d.segment==='Easy to Win'?'#6abf7b':d.segment==='Competitive'?'#e8b84b':'#e05c5c';
var cc=d.compStrength==='Strong'?'#e05c5c':d.compStrength==='Moderate'?'#e8b84b':'#6abf7b';
var h='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">';
h+='<div><div style="font-family:\'Playfair Display\',serif;font-size:20px;color:var(--text);">\ud83d\udccd '+d.name+'</div>';
h+='<div style="font-size:11px;color:var(--textmuted);margin-top:2px;">'+d.tier+' \u00b7 Micro Market Intelligence</div></div>';
h+='<button onclick="closeIntelCard()" style="background:none;border:none;color:var(--textmuted);font-size:20px;cursor:pointer;padding:4px 8px;">\u2715</button></div>';
h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">';
h+='<div class="wd-info-row" style="margin:0;">'+irI('SEGMENT','<span style="color:'+sc+';font-weight:600;">'+d.segment+'</span>')+'</div>';
h+='<div class="wd-info-row" style="margin:0;">'+irI('TARGET WEED','<span style="color:var(--accent);">'+d.intel.targetWeed+'</span>')+'</div>';
h+='<div class="wd-info-row" style="margin:0;">'+irI('WEED SEVERITY','<span style="color:'+(d.intel.weedSev==='High'?'#e05c5c':d.intel.weedSev==='Medium'?'#e8b84b':'#6abf7b')+';">'+d.intel.weedSev+'</span>')+'</div>';
h+='<div class="wd-info-row" style="margin:0;">'+irI('CONTROL DIFFICULTY','<span style="color:'+(d.intel.controlDiff==='High'?'#e05c5c':d.intel.controlDiff==='Medium'?'#e8b84b':'#6abf7b')+';">'+d.intel.controlDiff+'</span>')+'</div>';
h+='<div class="wd-info-row" style="margin:0;">'+irI('COMPETITOR STRENGTH','<span style="color:'+cc+';">'+d.compStrength+'</span>')+'</div>';
h+='<div class="wd-info-row" style="margin:0;">'+irI('PRODUCT FIT','<span style="color:'+(d.intel.prodFit==='Strong'?'#6abf7b':d.intel.prodFit==='Moderate'?'#e8b84b':'#e05c5c')+';">'+d.intel.prodFit+'</span>')+'</div>';
h+='</div>';
h+='<div class="wd-info-row">'+irI('TARGET AREA','<div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;height:8px;background:var(--border);border-radius:4px;"><div style="height:100%;width:'+d.targetArea+'%;background:'+sc+';border-radius:4px;"></div></div><span style="font-size:13px;color:'+sc+';font-family:\'JetBrains Mono\',monospace;font-weight:600;">'+d.targetArea+'%</span></div>')+'</div>';
h+='<div class="wd-info-row">'+irI('WEED PRESENCE',d.weeds)+'</div>';
h+='<div class="wd-info-row">'+irI('COMPETITOR LANDSCAPE',d.competitor)+'</div>';
h+='<div class="wd-info-row">'+irI('CONVERSION OPPORTUNITY','<span style="color:var(--amber);">'+d.convOpp+'</span>')+'</div>';
h+='<div class="wd-info-row" style="background:#6abf7b0a;border-color:#6abf7b33;">'+irI('\ud83d\udca1 RECOMMENDATIONS','<span style="color:var(--accent);line-height:1.5;">'+d.intel.recommendations+'</span>')+'</div>';
var ov=document.getElementById('intelCardOverlay');
document.getElementById('intelCardContent').innerHTML=h;
ov.style.display='flex';
ov.onclick=function(e){if(e.target===ov)closeIntelCard();};
}
function closeIntelCard(){document.getElementById('intelCardOverlay').style.display='none';}
function irI(l,v){return'<div class="wd-info-label">'+l+'</div><div class="wd-info-val">'+v+'</div>';}
