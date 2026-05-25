const fs = require('fs');

const AP_PATHS = {
  "Srikakulam":"M355,25 L420,10 L475,35 L465,95 L410,105 L360,80Z",
  "Vizianagaram":"M300,65 L360,80 L410,105 L385,150 L320,135 L280,105Z",
  "Visakhapatnam":"M240,95 L300,65 L280,105 L320,135 L385,150 L365,210 L300,230 L245,190Z",
  "East Godavari":"M300,230 L365,210 L400,255 L385,320 L315,310 L275,270Z",
  "West Godavari":"M220,195 L300,230 L275,270 L315,310 L250,320 L205,275 L195,230Z",
  "Krishna":"M250,320 L315,310 L385,320 L365,385 L295,395 L235,360Z",
  "Guntur":"M170,270 L205,275 L250,320 L235,360 L295,395 L265,425 L180,410 L140,350Z",
  "Prakasam":"M265,425 L295,395 L365,385 L345,455 L285,475 L225,450Z",
  "Nellore":"M285,475 L345,455 L375,495 L360,560 L305,575 L265,535 L245,495Z",
  "Chittoor":"M265,535 L305,575 L360,560 L345,610 L285,630 L235,595Z",
  "YSR Kadapa":"M180,410 L265,425 L225,450 L285,475 L245,495 L265,535 L235,595 L160,555 L130,475Z",
  "Anantapur":"M55,345 L140,350 L180,410 L130,475 L160,555 L100,575 L40,510 L20,425Z",
  "Kurnool":"M100,205 L170,270 L140,350 L55,345 L20,425 L10,325 L40,245Z"
};
const AP_VB = "0 0 500 650";
const AP_CENTERS = {
  "Srikakulam":[414,58],"Vizianagaram":[342,107],"Visakhapatnam":[304,148],
  "East Godavari":[340,266],"West Godavari":[251,261],"Krishna":[308,348],
  "Guntur":[217,351],"Prakasam":[297,431],"Nellore":[311,519],
  "Chittoor":[299,584],"YSR Kadapa":[210,491],"Anantapur":[90,456],"Kurnool":[76,295]
};

const MH_PATHS = {
  "Nashik":"M115,55 L195,35 L245,75 L225,135 L155,145 L105,105Z",
  "Pune":"M155,145 L225,135 L295,165 L285,235 L215,255 L145,215Z",
  "Ahmednagar":"M225,135 L295,165 L365,155 L375,225 L285,235Z",
  "Aurangabad":"M275,55 L365,45 L395,95 L365,155 L305,165 L245,75Z",
  "Jalgaon":"M195,35 L275,15 L365,45 L275,55 L245,75Z",
  "Buldhana":"M365,45 L445,35 L475,85 L435,135 L395,95Z",
  "Kolhapur":"M95,295 L165,275 L215,315 L195,375 L125,365 L75,335Z",
  "Sangli":"M165,275 L215,255 L285,285 L265,345 L215,315Z",
  "Satara":"M145,215 L215,255 L165,275 L95,295 L85,235Z",
  "Solapur":"M285,235 L375,225 L395,295 L345,345 L265,345 L285,285Z",
  "Latur":"M375,225 L435,215 L465,275 L425,335 L395,295Z",
  "Nanded":"M435,215 L525,195 L555,265 L495,315 L465,275Z",
  "Amravati":"M445,35 L535,25 L565,75 L525,135 L475,85Z",
  "Nagpur":"M525,25 L615,35 L625,115 L565,145 L525,135 L565,75Z",
  "Beed":"M365,155 L435,135 L435,215 L375,225Z"
};
const MH_VB = "0 0 650 480";
const MH_CENTERS = {
  "Nashik":[173,92],"Pune":[220,192],"Ahmednagar":[309,183],
  "Aurangabad":[325,98],"Jalgaon":[271,45],"Buldhana":[423,79],
  "Kolhapur":[145,327],"Sangli":[229,295],"Satara":[141,255],
  "Solapur":[325,288],"Latur":[419,269],"Nanded":[495,253],
  "Amravati":[509,71],"Nagpur":[570,88],"Beed":[403,183]
};

function pctToColor(pct, highIsGood) {
  var p = highIsGood ? pct : (100 - pct);
  var r, g, b;
  if (p <= 0) { r=180; g=28; b=28; }
  else if (p < 20) { r=180; g=28+Math.round(p*3.5); b=28; }
  else if (p < 40) { r=180; g=Math.round(98+(p-20)*4); b=25; }
  else if (p < 60) { r=Math.round(180-(p-40)*4); g=Math.round(178-(p-40)*0.5); b=25; }
  else if (p < 80) { r=Math.round(100-(p-60)*4); g=Math.round(168-(p-60)*0.5); b=Math.round(25+(p-60)*0.8); }
  else { r=Math.round(20-(p-80)*0.5); g=Math.round(158-(p-80)*0.8); b=Math.round(41+(p-80)*0.5); }
  r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

function waveColor(wave) {
  if (wave === 1) return '#2e7d32';
  if (wave === 2) return '#f9a825';
  return '#c62828';
}

function fitColor(fit) {
  if (fit === 'Strong') return '#2e7d32';
  if (fit === 'Moderate') return '#f9a825';
  return '#c62828';
}

function generateSVG(opts) {
  var { paths, centers, vb, title, districtData, legendItems, valueSuffix } = opts;
  var [,, vbW, vbH] = vb.split(' ').map(Number);
  var titleY = 30;
  var mapOffsetY = 10;

  var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH+50}" width="${vbW*1.6}" height="${(vbH+50)*1.6}">
<rect width="${vbW}" height="${vbH+50}" fill="#0b1a10"/>
<text x="${vbW/2}" y="${titleY}" text-anchor="middle" fill="#e8f5ec" font-family="Outfit,Arial,sans-serif" font-size="18" font-weight="600">${title}</text>
`;

  for (var name in paths) {
    var dd = districtData[name];
    if (!dd) continue;
    var color = dd.color;
    svg += `<path d="${paths[name]}" fill="${color}" stroke="#0b1a10" stroke-width="1.5" opacity="0.92"/>\n`;
  }

  for (var name in paths) {
    var dd = districtData[name];
    if (!dd) continue;
    var [cx, cy] = centers[name] || [0, 0];
    cy += mapOffsetY;
    var label = dd.label;
    var shortName = name.length > 12 ? name.substring(0, 11) + '.' : name;
    svg += `<text x="${cx}" y="${cy-6}" text-anchor="middle" fill="#e8f5ec" font-family="Outfit,Arial,sans-serif" font-size="10" font-weight="600" stroke="#0b1a1088" stroke-width="2" paint-order="stroke">${shortName}</text>\n`;
    svg += `<text x="${cx}" y="${cy+8}" text-anchor="middle" fill="#e8f5ec" font-family="JetBrains Mono,monospace" font-size="9" stroke="#0b1a1088" stroke-width="2" paint-order="stroke">${label}${valueSuffix||''}</text>\n`;
  }

  if (legendItems) {
    var lx = vbW - 180;
    var ly = vbH - 20;
    svg += `<text x="${lx}" y="${ly}" fill="#7aaa87" font-family="Outfit,Arial,sans-serif" font-size="11" font-weight="600">${legendItems.title || 'Legend'}</text>\n`;
    legendItems.items.forEach(function(item, i) {
      svg += `<rect x="${lx}" y="${ly+8+i*18}" width="14" height="14" rx="3" fill="${item.color}"/>\n`;
      svg += `<text x="${lx+20}" y="${ly+19+i*18}" fill="#7aaa87" font-family="Outfit,Arial,sans-serif" font-size="10">${item.label}</text>\n`;
    });
  }

  svg += `</svg>`;
  return svg;
}

// ──── PL DATA ────
var PL_AP_DISTRICTS = [
  {name:"East Godavari",unmetOpp:92,wave:1,fit:"Strong"},
  {name:"West Godavari",unmetOpp:88,wave:1,fit:"Strong"},
  {name:"Guntur",unmetOpp:82,wave:1,fit:"Strong"},
  {name:"Srikakulam",unmetOpp:78,wave:1,fit:"Strong"},
  {name:"Krishna",unmetOpp:75,wave:1,fit:"Strong"},
  {name:"Visakhapatnam",unmetOpp:65,wave:2,fit:"Moderate"},
  {name:"Vizianagaram",unmetOpp:58,wave:2,fit:"Moderate"},
  {name:"Kurnool",unmetOpp:55,wave:2,fit:"Moderate"},
  {name:"Prakasam",unmetOpp:52,wave:2,fit:"Moderate"},
  {name:"Nellore",unmetOpp:42,wave:2,fit:"Moderate"},
  {name:"YSR Kadapa",unmetOpp:35,wave:3,fit:"Weak"},
  {name:"Chittoor",unmetOpp:25,wave:3,fit:"Weak"},
  {name:"Anantapur",unmetOpp:20,wave:3,fit:"Weak"}
];

var PL_MH_DISTRICTS = [
  {name:"Aurangabad",unmetOpp:90,wave:1,fit:"Strong"},
  {name:"Kolhapur",unmetOpp:85,wave:1,fit:"Strong"},
  {name:"Ahmednagar",unmetOpp:80,wave:1,fit:"Strong"},
  {name:"Pune",unmetOpp:76,wave:1,fit:"Strong"},
  {name:"Nashik",unmetOpp:72,wave:1,fit:"Strong"},
  {name:"Latur",unmetOpp:62,wave:2,fit:"Moderate"},
  {name:"Jalgaon",unmetOpp:58,wave:2,fit:"Moderate"},
  {name:"Buldhana",unmetOpp:55,wave:2,fit:"Moderate"},
  {name:"Satara",unmetOpp:52,wave:2,fit:"Moderate"},
  {name:"Sangli",unmetOpp:42,wave:2,fit:"Moderate"},
  {name:"Solapur",unmetOpp:28,wave:3,fit:"Weak"},
  {name:"Nanded",unmetOpp:38,wave:3,fit:"Weak"},
  {name:"Amravati",unmetOpp:22,wave:3,fit:"Weak"},
  {name:"Nagpur",unmetOpp:18,wave:3,fit:"Weak"},
  {name:"Beed",unmetOpp:15,wave:3,fit:"Weak"}
];

// Weed-specific data
var PW_DATA = {
  PW1:{name:"Barnyard Grass",data:{"East Godavari":92,"West Godavari":88,"Guntur":72,"Srikakulam":78,"Krishna":65,"Visakhapatnam":70,"Vizianagaram":52,"Kurnool":48,"Prakasam":38,"Nellore":42,"YSR Kadapa":28,"Chittoor":20,"Anantapur":15}},
  PW2:{name:"Variable Flatsedge",data:{"East Godavari":75,"West Godavari":72,"Guntur":80,"Srikakulam":68,"Krishna":82,"Visakhapatnam":55,"Vizianagaram":62,"Kurnool":60,"Prakasam":42,"Nellore":35,"YSR Kadapa":32,"Chittoor":18,"Anantapur":12}},
  PW3:{name:"Pickerelweed",data:{"East Godavari":68,"West Godavari":65,"Guntur":55,"Srikakulam":60,"Krishna":48,"Visakhapatnam":50,"Vizianagaram":52,"Kurnool":30,"Prakasam":58,"Nellore":65,"YSR Kadapa":22,"Chittoor":18,"Anantapur":10}},
  PW4:{name:"Globe Fimbry",data:{"East Godavari":62,"West Godavari":58,"Guntur":85,"Srikakulam":52,"Krishna":72,"Visakhapatnam":38,"Vizianagaram":42,"Kurnool":45,"Prakasam":52,"Nellore":28,"YSR Kadapa":48,"Chittoor":15,"Anantapur":10}},
  PW5:{name:"Knotgrass",data:{"East Godavari":35,"West Godavari":38,"Guntur":45,"Srikakulam":32,"Krishna":48,"Visakhapatnam":58,"Vizianagaram":28,"Kurnool":42,"Prakasam":45,"Nellore":55,"YSR Kadapa":35,"Chittoor":52,"Anantapur":42}},
  PW6:{name:"Water Primrose",data:{"East Godavari":42,"West Godavari":38,"Guntur":28,"Srikakulam":32,"Krishna":42,"Visakhapatnam":28,"Vizianagaram":38,"Kurnool":22,"Prakasam":65,"Nellore":52,"YSR Kadapa":22,"Chittoor":25,"Anantapur":12}}
};

var MW_DATA = {
  MW1:{name:"Purple Nutsedge",data:{"Aurangabad":92,"Pune":78,"Ahmednagar":72,"Kolhapur":68,"Nashik":62,"Latur":55,"Jalgaon":52,"Buldhana":58,"Satara":42,"Sangli":48,"Solapur":22,"Nanded":30,"Amravati":18,"Nagpur":12,"Beed":10}},
  MW2:{name:"Bermuda Grass",data:{"Nashik":78,"Pune":65,"Ahmednagar":75,"Kolhapur":72,"Aurangabad":58,"Latur":48,"Jalgaon":55,"Buldhana":42,"Satara":62,"Sangli":38,"Solapur":25,"Nanded":28,"Amravati":22,"Nagpur":15,"Beed":12}},
  MW3:{name:"Congress Grass",data:{"Ahmednagar":85,"Kolhapur":88,"Aurangabad":78,"Nashik":62,"Pune":68,"Latur":72,"Jalgaon":48,"Buldhana":45,"Satara":38,"Sangli":40,"Solapur":22,"Nanded":38,"Amravati":18,"Nagpur":12,"Beed":10}},
  MW4:{name:"Pigweed",data:{"Jalgaon":68,"Aurangabad":55,"Latur":52,"Nanded":58,"Ahmednagar":45,"Kolhapur":42,"Pune":38,"Nashik":32,"Buldhana":38,"Sangli":30,"Satara":25,"Solapur":18,"Amravati":15,"Nagpur":10,"Beed":22}},
  MW5:{name:"Goosegrass",data:{"Amravati":52,"Nagpur":48,"Satara":45,"Ahmednagar":40,"Nashik":42,"Kolhapur":38,"Pune":32,"Aurangabad":28,"Latur":32,"Jalgaon":22,"Buldhana":20,"Sangli":22,"Nanded":25,"Solapur":15,"Beed":10}},
  MW6:{name:"Common Purslane",data:{"Solapur":48,"Beed":42,"Amravati":32,"Jalgaon":28,"Satara":25,"Pune":20,"Nashik":22,"Aurangabad":18,"Ahmednagar":12,"Kolhapur":15,"Sangli":15,"Buldhana":12,"Latur":18,"Nanded":15,"Nagpur":10}}
};

var oppLegend = {
  title: "Opportunity (%)",
  items: [
    {color:"#2e7d32",label:"High (≥70%)"},
    {color:"#689f38",label:"Good (55-69%)"},
    {color:"#f9a825",label:"Medium (40-54%)"},
    {color:"#ef6c00",label:"Low (25-39%)"},
    {color:"#c62828",label:"Very Low (<25%)"}
  ]
};
var waveLegend = {
  title: "Launch Wave",
  items: [
    {color:"#2e7d32",label:"Wave 1 (Attack)"},
    {color:"#f9a825",label:"Wave 2 (Expand)"},
    {color:"#c62828",label:"Wave 3 (Monitor)"}
  ]
};
var fitLegend = {
  title: "Product Fit",
  items: [
    {color:"#2e7d32",label:"Strong Fit"},
    {color:"#f9a825",label:"Moderate Fit"},
    {color:"#c62828",label:"Weak Fit"}
  ]
};

function genFiles() {
  // 1. AP Launch Opportunity
  var dd = {};
  PL_AP_DISTRICTS.forEach(d => { dd[d.name] = { color: pctToColor(d.unmetOpp, true), label: d.unmetOpp+'%' }; });
  fs.writeFileSync('ap_launch_opp.svg', generateSVG({ paths:AP_PATHS, centers:AP_CENTERS, vb:AP_VB, title:"AP — Unmet Opportunity Index", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  // 2. MH Launch Opportunity
  dd = {};
  PL_MH_DISTRICTS.forEach(d => { dd[d.name] = { color: pctToColor(d.unmetOpp, true), label: d.unmetOpp+'%' }; });
  fs.writeFileSync('mh_launch_opp.svg', generateSVG({ paths:MH_PATHS, centers:MH_CENTERS, vb:MH_VB, title:"MH — Unmet Opportunity Index", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  // 3. AP Launch Matrix (Wave)
  dd = {};
  PL_AP_DISTRICTS.forEach(d => { dd[d.name] = { color: waveColor(d.wave), label: 'W'+d.wave }; });
  fs.writeFileSync('ap_launch_matrix.svg', generateSVG({ paths:AP_PATHS, centers:AP_CENTERS, vb:AP_VB, title:"AP — Launch Wave Prioritization", districtData:dd, legendItems:waveLegend, valueSuffix:'' }));

  // 4. MH Launch Matrix (Wave)
  dd = {};
  PL_MH_DISTRICTS.forEach(d => { dd[d.name] = { color: waveColor(d.wave), label: 'W'+d.wave }; });
  fs.writeFileSync('mh_launch_matrix.svg', generateSVG({ paths:MH_PATHS, centers:MH_CENTERS, vb:MH_VB, title:"MH — Launch Wave Prioritization", districtData:dd, legendItems:waveLegend, valueSuffix:'' }));

  // 5-10. AP weed-specific opportunity maps
  var apWeedFiles = { PW1:'ap_opp_barnyard', PW2:'ap_opp_flatsedge', PW3:'ap_opp_pickerelweed', PW4:'ap_opp_globefimbry', PW5:'ap_opp_knotgrass', PW6:'ap_opp_waterprimrose' };
  for (var wid in apWeedFiles) {
    dd = {};
    var wd = PW_DATA[wid];
    for (var dname in wd.data) { dd[dname] = { color: pctToColor(wd.data[dname], true), label: wd.data[dname]+'%' }; }
    fs.writeFileSync(apWeedFiles[wid]+'.svg', generateSVG({ paths:AP_PATHS, centers:AP_CENTERS, vb:AP_VB, title:wd.name+" — AP Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));
  }

  // 11-16. MH weed-specific opportunity maps
  var mhWeedFiles = { MW1:'mh_opp_nutsedge', MW2:'mh_opp_bermuda', MW3:'mh_opp_congress', MW4:'mh_opp_pigweed', MW5:'mh_opp_goosegrass', MW6:'mh_opp_purslane' };
  for (var wid in mhWeedFiles) {
    dd = {};
    var wd = MW_DATA[wid];
    for (var dname in wd.data) { dd[dname] = { color: pctToColor(wd.data[dname], true), label: wd.data[dname]+'%' }; }
    fs.writeFileSync(mhWeedFiles[wid]+'.svg', generateSVG({ paths:MH_PATHS, centers:MH_CENTERS, vb:MH_VB, title:wd.name+" — MH Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));
  }

  // 17-18. AP matrix by weed type (Grass/Sedge = weed, Broadleaf)
  // Grass/Sedge: average of PW1,PW2,PW4,PW5 (Grass+Sedge) by fit
  dd = {};
  PL_AP_DISTRICTS.forEach(d => {
    var avg = Math.round(([PW_DATA.PW1, PW_DATA.PW2, PW_DATA.PW4, PW_DATA.PW5].reduce((s,w) => s+(w.data[d.name]||0), 0))/4);
    dd[d.name] = { color: pctToColor(avg, true), label: avg+'%' };
  });
  fs.writeFileSync('ap_matrix_weed.svg', generateSVG({ paths:AP_PATHS, centers:AP_CENTERS, vb:AP_VB, title:"AP — Grass/Sedge Weed Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  dd = {};
  PL_AP_DISTRICTS.forEach(d => {
    var avg = Math.round(([PW_DATA.PW3, PW_DATA.PW6].reduce((s,w) => s+(w.data[d.name]||0), 0))/2);
    dd[d.name] = { color: pctToColor(avg, true), label: avg+'%' };
  });
  fs.writeFileSync('ap_matrix_broadleaf.svg', generateSVG({ paths:AP_PATHS, centers:AP_CENTERS, vb:AP_VB, title:"AP — Broadleaf Weed Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  // 19-20. MH matrix by weed type
  dd = {};
  PL_MH_DISTRICTS.forEach(d => {
    var avg = Math.round(([MW_DATA.MW1, MW_DATA.MW2, MW_DATA.MW5].reduce((s,w) => s+(w.data[d.name]||0), 0))/3);
    dd[d.name] = { color: pctToColor(avg, true), label: avg+'%' };
  });
  fs.writeFileSync('mh_matrix_weed.svg', generateSVG({ paths:MH_PATHS, centers:MH_CENTERS, vb:MH_VB, title:"MH — Grass/Sedge Weed Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  dd = {};
  PL_MH_DISTRICTS.forEach(d => {
    var avg = Math.round(([MW_DATA.MW3, MW_DATA.MW4, MW_DATA.MW6].reduce((s,w) => s+(w.data[d.name]||0), 0))/3);
    dd[d.name] = { color: pctToColor(avg, true), label: avg+'%' };
  });
  fs.writeFileSync('mh_matrix_broadleaf.svg', generateSVG({ paths:MH_PATHS, centers:MH_CENTERS, vb:MH_VB, title:"MH — Broadleaf Weed Opportunity", districtData:dd, legendItems:oppLegend, valueSuffix:'' }));

  console.log('Generated 20 SVG map files.');
}

genFiles();
