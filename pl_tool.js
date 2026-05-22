/* ═══════════════════════════════════════════════
   PRODUCT LAUNCH TOOL — with Weed Type Selection
   ═══════════════════════════════════════════════ */

var _plSelectedWeed = null; // track currently selected weed across tabs

/* ── Weed-specific premium botanical images (same as segmentation tool) ── */
var PL_WEED_OPP_IMAGES = {
    paddy_ap: {
        PW1: "weed_barnyard_grass.jpg", PW2: "weed_variable_flatsedge.jpg", PW3: "weed_pickerelweed.jpg",
        PW4: "weed_globe_fimbry.jpg", PW5: "weed_knotgrass.jpg", PW6: "weed_water_primrose.jpg"
    },
    maize_mh: {
        MW1: "weed_purple_nutsedge.jpg", MW2: "weed_bermuda_grass.jpg", MW3: "weed_congress_grass.jpg",
        MW4: "weed_pigweed.jpg", MW5: "weed_goosegrass.jpg", MW6: "weed_common_purslane.jpg"
    }
};
var PL_WEED_MATRIX_IMAGES = {
    paddy_ap: {
        PW1: "weed_barnyard_grass.jpg", PW2: "weed_variable_flatsedge.jpg", PW3: "weed_pickerelweed.jpg",
        PW4: "weed_globe_fimbry.jpg", PW5: "weed_knotgrass.jpg", PW6: "weed_water_primrose.jpg"
    },
    maize_mh: {
        MW1: "weed_purple_nutsedge.jpg", MW2: "weed_bermuda_grass.jpg", MW3: "weed_congress_grass.jpg",
        MW4: "weed_pigweed.jpg", MW5: "weed_goosegrass.jpg", MW6: "weed_common_purslane.jpg"
    }
};

/* ── Tab switching ── */
function plTab(t, el) {
    ['opp', 'matrix', 'battle', 'roadmap'].forEach(function (x) {
        document.getElementById('pl-' + x).style.display = 'none';
    });
    document.getElementById('pl-' + t).style.display = 'block';
    document.querySelectorAll('#pg-prodlaunch .tab-bar .tab').forEach(function (x) {
        x.classList.remove('active');
    });
    el.classList.add('active');
}

/* ── Main render entry ── */
function renderProdLaunch() {
    var ck = getSelectedCrop();
    var d = PL_DATA[ck];
    if (!d) return;

    // Build weed selector
    var weeds = PL_WEED_TYPES[ck] || [];
    if (!_plSelectedWeed || !weeds.find(function (w) { return w.id === _plSelectedWeed; })) {
        _plSelectedWeed = weeds.length > 0 ? weeds[0].id : null;
    }

    renderPLOpp(d, ck, weeds);
    renderPLMatrix(d, ck, weeds);
    renderPLBattle(d, weeds);
    renderPLRoadmap(d);
}

function onPLWeedChange(weedId) {
    _plSelectedWeed = weedId;
    renderProdLaunch();
}

/* ── Helper: weed type tag color ── */
function _weedTypeColor(type) {
    if (type === 'Grass') return '#6abf7b';
    if (type === 'Sedge') return '#e8b84b';
    if (type === 'Broadleaf') return '#8dc49a';
    return '#7aaa87';
}

/* ── Helper: severity badge color ── */
function _sevColor(sev) {
    if (sev === 'High') return '#e05c5c';
    if (sev === 'Medium') return '#e8b84b';
    return '#6abf7b';
}

/* ── Helper: Build the weed selector HTML ── */
function _buildWeedSelector(weeds, containerId) {
    var h = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;">';
    h += '<div style="font-size:10px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;">WEED TYPE</div>';
    h += '<select class="wd-weed-select" id="' + containerId + '" onchange="onPLWeedChange(this.value)" style="min-width:260px;">';
    weeds.forEach(function (w) {
        var sel = w.id === _plSelectedWeed ? ' selected' : '';
        var typeTag = w.type === 'Grass' ? '🌾' : w.type === 'Sedge' ? '🌿' : '🍃';
        h += '<option value="' + w.id + '"' + sel + '>' + typeTag + ' ' + w.name + ' (' + w.type + ') — ' + w.severity + ' Severity</option>';
    });
    h += '</select>';

    // Show selected weed quick info badge
    var sw = weeds.find(function (w) { return w.id === _plSelectedWeed; });
    if (sw) {
        var tc = _weedTypeColor(sw.type);
        var sc = _sevColor(sw.severity);
        h += '<span style="padding:3px 10px;border-radius:20px;font-size:10px;background:' + tc + '22;color:' + tc + ';border:1px solid ' + tc + '44;font-family:\'JetBrains Mono\',monospace;">' + sw.type + '</span>';
        h += '<span style="padding:3px 10px;border-radius:20px;font-size:10px;background:' + sc + '22;color:' + sc + ';border:1px solid ' + sc + '44;font-family:\'JetBrains Mono\',monospace;">' + sw.severity + ' Severity</span>';
        h += '<span style="padding:3px 10px;border-radius:20px;font-size:10px;background:#5ca8e022;color:#5ca8e0;border:1px solid #5ca8e044;font-family:\'JetBrains Mono\',monospace;">Prev: ' + sw.prevalence + '%</span>';
    }
    h += '</div>';
    return h;
}

/* ── Helper: info row ── */
function plIR(l, v) {
    return '<div class="wd-info-row"><div class="wd-info-label">' + l + '</div><div class="wd-info-val">' + v + '</div></div>';
}

/* ═══════════════════════════════════════
   OPPORTUNITY MAP TAB (with weed filter)
   ═══════════════════════════════════════ */
function renderPLOpp(d, ck, weeds) {
    var sw = weeds.find(function (w) { return w.id === _plSelectedWeed; });
    var h = _buildWeedSelector(weeds, 'plWeedSelOpp');

    h += '<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';

    // Left: map + district grid
    h += '<div>';
    if (sw) {
        h += '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:8px;">🌿 ' + sw.name + ' — Botanical Specimen & Opportunity</div>';
        // Use weed-specific premium botanical image
        var imgSrc = (PL_WEED_OPP_IMAGES[ck] && PL_WEED_OPP_IMAGES[ck][sw.id]) || PL_IMAGES[ck];
        h += '<img src="' + imgSrc + '" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';

        // Legend
        h += '<div style="display:flex;gap:10px;margin:10px 0;">';
        ['#6abf7b:High Opp (≥65%)', '#e8b84b:Medium (35-64%)', '#e05c5c:Low (<35%)'].forEach(function (x) {
            var p = x.split(':');
            h += '<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--textdim);"><div style="width:10px;height:10px;border-radius:3px;background:' + p[0] + ';"></div>' + p[1] + '</div>';
        });
        h += '</div>';

        // District list for selected weed
        h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px 10px;">';
        var distKeys = Object.keys(sw.distData).sort(function (a, b) { return sw.distData[b].opp - sw.distData[a].opp; });
        distKeys.forEach(function (dName) {
            var dd = sw.distData[dName];
            var c = dd.opp >= 65 ? '#6abf7b' : dd.opp >= 35 ? '#e8b84b' : '#e05c5c';
            h += '<div style="display:flex;align-items:center;gap:5px;padding:3px 0;cursor:pointer;" onclick="showPLWeedDistrict(\'' + dName.replace(/'/g, "\\'") + '\')" title="Click for details">';
            h += '<div style="width:7px;height:7px;border-radius:50%;background:' + c + ';"></div>';
            h += '<span style="font-size:10px;color:var(--textdim);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + dName + '</span>';
            h += '<span style="font-size:10px;color:' + c + ';font-family:\'JetBrains Mono\',monospace;">' + dd.opp + '%</span>';
            h += '</div>';
        });
        h += '</div>';
    } else {
        h += '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:8px;">' + d.scenario.geography + ' — Unmet Opportunity Index</div>';
        h += '<img src="' + PL_IMAGES[ck] + '" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
    }
    h += '</div>';

    // Right: info panel
    h += '<div class="wd-info-panel">';
    if (sw) {
        // Weed profile card
        var tc = _weedTypeColor(sw.type);
        var sc = _sevColor(sw.severity);
        h += '<div class="wd-info-row" style="border-left:3px solid ' + tc + ';">';
        h += '<div class="wd-info-label">🌿 WEED PROFILE</div>';
        h += '<div style="font-family:\'Playfair Display\',serif;font-size:15px;color:var(--text);font-style:italic;">' + sw.sci + '</div>';
        h += '<div style="font-size:13px;color:' + tc + ';font-weight:600;margin-top:2px;">' + sw.name + '</div>';
        h += '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">';
        h += '<span style="padding:2px 8px;border-radius:4px;font-size:9px;background:' + tc + '22;color:' + tc + ';">' + sw.type + '</span>';
        h += '<span style="padding:2px 8px;border-radius:4px;font-size:9px;background:' + sc + '22;color:' + sc + ';">Severity: ' + sw.severity + '</span>';
        h += '<span style="padding:2px 8px;border-radius:4px;font-size:9px;background:#5ca8e022;color:#5ca8e0;">Prevalence: ' + sw.prevalence + '%</span>';
        h += '</div>';
        h += '</div>';

        h += plIR('CONTROL HERBICIDES', '<span style="color:var(--amber);">' + sw.control + '</span>');
        h += plIR('RESISTANCE RISK', '<span style="color:' + (sw.resistRisk === 'High' ? '#e05c5c' : sw.resistRisk === 'Medium' ? '#e8b84b' : '#6abf7b') + ';">' + sw.resistRisk + '</span>');
        h += plIR('PEAK STAGE', sw.peakStage);
        h += plIR('CONTROL WINDOW', '<span style="color:var(--amber);font-family:\'JetBrains Mono\',monospace;">' + sw.controlWindow + '</span>');
        h += plIR('YIELD LOSS RANGE', '<span style="color:#e05c5c;">' + sw.lossRange + '</span>');
        h += plIR('ECO. THRESHOLD', '<span style="font-family:\'JetBrains Mono\',monospace;">' + sw.threshold + '</span>');

        // Top opportunity districts
        h += '<div class="wd-info-row" style="border-left:3px solid #6abf7b;">';
        h += '<div class="wd-info-label">🎯 TOP OPPORTUNITY DISTRICTS</div>';
        var top5 = distKeys.slice(0, 5);
        top5.forEach(function (dName) {
            var dd = sw.distData[dName];
            var c = dd.opp >= 65 ? '#6abf7b' : dd.opp >= 35 ? '#e8b84b' : '#e05c5c';
            h += '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #1e3d2722;">';
            h += '<span style="font-size:11px;color:var(--textdim);">' + dName + '</span>';
            h += '<span style="font-size:11px;color:' + c + ';font-family:\'JetBrains Mono\',monospace;">' + dd.opp + '% · ' + dd.fit + '</span>';
            h += '</div>';
        });
        h += '</div>';
    } else {
        h += plIR('CANDIDATE PRODUCT', '<span style="color:var(--accent);font-size:14px;font-weight:600;">' + d.scenario.product + '</span>');
        h += plIR('TARGET CROP', d.scenario.crop);
        h += plIR('TARGET WEEDS', d.scenario.targetWeeds.join(', '));
    }

    // District detail panel
    h += '<div class="wd-info-row" id="plDistrictDetail"><div class="wd-info-label">DISTRICT DETAIL</div><div style="font-size:11px;color:var(--textmuted);padding:12px 0;text-align:center;">Click a district for weed-specific details</div></div>';
    h += '</div></div>';

    document.getElementById('pl-opp').innerHTML = h;
}

/* ── Show district detail for weed-specific view ── */
function showPLWeedDistrict(name) {
    var ck = getSelectedCrop();
    var weeds = PL_WEED_TYPES[ck] || [];
    var sw = weeds.find(function (w) { return w.id === _plSelectedWeed; });
    if (!sw || !sw.distData[name]) return;

    var dd = sw.distData[name];
    var el = document.getElementById('plDistrictDetail');
    if (!el) return;

    var tc = _weedTypeColor(sw.type);
    var fc = dd.fit === 'Strong' ? '#6abf7b' : dd.fit === 'Moderate' ? '#e8b84b' : '#e05c5c';

    var h = '<div class="wd-info-label">📍 ' + name + ' — ' + sw.name + '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">';
    h += '<div style="background:var(--bg);border-radius:6px;padding:6px 8px;text-align:center;"><div style="font-size:9px;color:var(--textmuted);">PREVALENCE</div><div style="font-size:16px;color:' + tc + ';font-family:\'Playfair Display\',serif;">' + dd.prev + '%</div></div>';
    h += '<div style="background:var(--bg);border-radius:6px;padding:6px 8px;text-align:center;"><div style="font-size:9px;color:var(--textmuted);">OPPORTUNITY</div><div style="font-size:16px;color:' + (dd.opp >= 65 ? '#6abf7b' : dd.opp >= 35 ? '#e8b84b' : '#e05c5c') + ';font-family:\'Playfair Display\',serif;">' + dd.opp + '%</div></div>';
    h += '</div>';
    h += '<div style="font-size:11px;color:var(--textdim);margin:6px 0;"><strong>Product Fit:</strong> <span style="color:' + fc + ';font-weight:600;">' + dd.fit + '</span></div>';
    h += '<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Competitors:</strong> ' + dd.comp.join(', ') + '</div>';
    h += '<div style="font-size:11px;color:var(--textdim);margin:4px 0;"><strong>Gap Opportunity:</strong> <span style="color:var(--amber);">' + dd.gap + '</span></div>';
    el.innerHTML = h;
}

/* Also keep original showPLDistrict for backward compat */
function showPLDistrict(name) {
    showPLWeedDistrict(name);
}

/* ═══════════════════════════════════════
   WEED × AREA MATRIX TAB (with weed filter)
   ═══════════════════════════════════════ */
function renderPLMatrix(d, ck, weeds) {
    var sw = weeds.find(function (w) { return w.id === _plSelectedWeed; });
    var h = _buildWeedSelector(weeds, 'plWeedSelMatrix');

    h += '<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';

    // Left: matrix visualization
    h += '<div>';
    if (sw) {
        h += '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:8px;">🌿 ' + sw.name + ' — Botanical Specimen & Prioritization Matrix</div>';
        var imgSrc = (PL_WEED_MATRIX_IMAGES[ck] && PL_WEED_MATRIX_IMAGES[ck][sw.id]) || PL_MATRIX_IMAGES[ck];
        h += '<img src="' + imgSrc + '" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';

        // Build dynamic heatmap table for this weed
        h += '<div style="margin-top:14px;">';
        h += '<div style="font-size:10px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:8px;">' + sw.name.toUpperCase() + ' · DISTRICT PREVALENCE HEATMAP</div>';
        h += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:10px;">';
        h += '<thead><tr><th style="text-align:left;padding:6px 8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);font-size:9px;">District</th>';
        h += '<th style="text-align:center;padding:6px 8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);font-size:9px;">Prev %</th>';
        h += '<th style="text-align:center;padding:6px 8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);font-size:9px;">Opp %</th>';
        h += '<th style="text-align:center;padding:6px 8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);font-size:9px;">Fit</th>';
        h += '<th style="text-align:left;padding:6px 8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);font-size:9px;">Gap</th>';
        h += '</tr></thead><tbody>';

        var sortedDists = Object.keys(sw.distData).sort(function (a, b) { return sw.distData[b].opp - sw.distData[a].opp; });
        sortedDists.forEach(function (dName) {
            var dd = sw.distData[dName];
            var prevBg = dd.prev > 60 ? 'rgba(106,191,123,0.3)' : dd.prev > 35 ? 'rgba(232,184,75,0.2)' : 'rgba(30,61,39,0.3)';
            var oppBg = dd.opp >= 65 ? 'rgba(106,191,123,0.3)' : dd.opp >= 35 ? 'rgba(232,184,75,0.2)' : 'rgba(224,92,92,0.2)';
            var fc = dd.fit === 'Strong' ? '#6abf7b' : dd.fit === 'Moderate' ? '#e8b84b' : '#e05c5c';
            h += '<tr style="border-bottom:1px solid #1e3d2722;">';
            h += '<td style="padding:5px 8px;font-size:10px;color:var(--textdim);white-space:nowrap;">' + dName + '</td>';
            h += '<td style="padding:5px 8px;text-align:center;background:' + prevBg + ';font-family:\'JetBrains Mono\',monospace;color:var(--text);">' + dd.prev + '</td>';
            h += '<td style="padding:5px 8px;text-align:center;background:' + oppBg + ';font-family:\'JetBrains Mono\',monospace;color:var(--text);">' + dd.opp + '</td>';
            h += '<td style="padding:5px 8px;text-align:center;"><span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + fc + '22;color:' + fc + ';">' + dd.fit + '</span></td>';
            h += '<td style="padding:5px 8px;font-size:9px;color:var(--textmuted);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + dd.gap + '">' + dd.gap + '</td>';
            h += '</tr>';
        });
        h += '</tbody></table></div></div>';

        // Legend
        h += '<div style="display:flex;gap:12px;margin-top:10px;justify-content:center;">';
        h += '<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#6abf7b;"></div>Strong Fit</div>';
        h += '<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e8b84b;"></div>Moderate Fit</div>';
        h += '<div style="display:flex;align-items:center;gap:5px;font-size:10px;color:var(--textdim);"><div style="width:12px;height:12px;border-radius:3px;background:#e05c5c;"></div>Weak Fit</div>';
        h += '</div>';
    } else {
        h += '<div style="font-size:11px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;margin-bottom:8px;">WEED × AREA PRIORITIZATION MATRIX</div>';
        h += '<img src="' + PL_MATRIX_IMAGES[ck] + '" style="width:100%;border-radius:10px;border:1px solid var(--border);"/>';
    }
    h += '</div>';

    // Right: info panel
    h += '<div class="wd-info-panel">';
    if (sw) {
        // Summary cards for this weed
        var strongDists = Object.keys(sw.distData).filter(function (d) { return sw.distData[d].fit === 'Strong'; });
        var modDists = Object.keys(sw.distData).filter(function (d) { return sw.distData[d].fit === 'Moderate'; });
        var weakDists = Object.keys(sw.distData).filter(function (d) { return sw.distData[d].fit === 'Weak'; });
        var avgOpp = Math.round(Object.values(sw.distData).reduce(function (s, v) { return s + v.opp; }, 0) / Object.keys(sw.distData).length);
        var avgPrev = Math.round(Object.values(sw.distData).reduce(function (s, v) { return s + v.prev; }, 0) / Object.keys(sw.distData).length);

        h += '<div class="wd-info-row" style="border-left:3px solid #6abf7b;">';
        h += '<div class="wd-info-label">🎯 ATTACK ZONE — STRONG FIT</div>';
        h += '<div style="font-size:11px;color:var(--textdim);">High opportunity + Strong product fit</div>';
        h += '<div style="font-size:10px;color:#6abf7b;margin-top:4px;">' + (strongDists.length > 0 ? strongDists.join(', ') : 'None') + '</div>';
        h += '</div>';

        h += '<div class="wd-info-row" style="border-left:3px solid #e8b84b;">';
        h += '<div class="wd-info-label">⚔️ SELECTIVE BATTLE — MODERATE FIT</div>';
        h += '<div style="font-size:11px;color:var(--textdim);">Opportunity exists with differentiation</div>';
        h += '<div style="font-size:10px;color:#e8b84b;margin-top:4px;">' + (modDists.length > 0 ? modDists.join(', ') : 'None') + '</div>';
        h += '</div>';

        h += '<div class="wd-info-row" style="border-left:3px solid #e05c5c;">';
        h += '<div class="wd-info-label">🚫 AVOID — WEAK FIT</div>';
        h += '<div style="font-size:11px;color:var(--textdim);">Low opportunity + High competition</div>';
        h += '<div style="font-size:10px;color:#e05c5c;margin-top:4px;">' + (weakDists.length > 0 ? weakDists.join(', ') : 'None') + '</div>';
        h += '</div>';

        h += '<div class="wd-info-row">';
        h += '<div class="wd-info-label">📊 WEED SUMMARY</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">';
        h += '<div style="text-align:center;padding:8px;background:var(--bg);border-radius:6px;"><div style="font-size:16px;color:var(--accent);font-family:\'Playfair Display\',serif;">' + avgOpp + '%</div><div style="font-size:8px;color:var(--textmuted);">Avg Opportunity</div></div>';
        h += '<div style="text-align:center;padding:8px;background:var(--bg);border-radius:6px;"><div style="font-size:16px;color:var(--amber);font-family:\'Playfair Display\',serif;">' + avgPrev + '%</div><div style="font-size:8px;color:var(--textmuted);">Avg Prevalence</div></div>';
        h += '<div style="text-align:center;padding:8px;background:var(--bg);border-radius:6px;"><div style="font-size:16px;color:#6abf7b;font-family:\'Playfair Display\',serif;">' + strongDists.length + '</div><div style="font-size:8px;color:var(--textmuted);">Strong Fit</div></div>';
        h += '<div style="text-align:center;padding:8px;background:var(--bg);border-radius:6px;"><div style="font-size:16px;color:#e05c5c;font-family:\'Playfair Display\',serif;">' + weakDists.length + '</div><div style="font-size:8px;color:var(--textmuted);">Weak Fit</div></div>';
        h += '</div></div>';
    } else {
        h += '<div class="wd-info-row"><div class="wd-info-label">Select a weed type to view matrix</div></div>';
    }
    h += '</div></div>';

    document.getElementById('pl-matrix').innerHTML = h;
}

/* ═══════════════════════════════════════
   COMPETITOR BATTLE CARD TAB (with weed filter)
   ═══════════════════════════════════════ */
function renderPLBattle(d, weeds) {
    var sw = weeds.find(function (w) { return w.id === _plSelectedWeed; });
    var h = _buildWeedSelector(weeds, 'plWeedSelBattle');

    if (sw) {
        // Weed-specific competitor analysis
        h += '<div style="margin-bottom:18px;">';
        h += '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:12px;">🪨 Competitor Landscape for ' + sw.name + '</div>';

        // Competitor frequency analysis from the weed's distData
        var compFreq = {};
        var gapFreq = {};
        var fitCounts = { Strong: 0, Moderate: 0, Weak: 0 };
        var distKeys = Object.keys(sw.distData);
        distKeys.forEach(function (dName) {
            var dd = sw.distData[dName];
            fitCounts[dd.fit] = (fitCounts[dd.fit] || 0) + 1;
            dd.comp.forEach(function (c) {
                var cleanComp = c.replace(/\s*\(.*?\)\s*/g, '').trim();
                compFreq[cleanComp] = (compFreq[cleanComp] || 0) + 1;
            });
            if (dd.gap && dd.gap !== 'None' && dd.gap !== 'Limited' && dd.gap !== 'Saturated') {
                gapFreq[dd.gap] = (gapFreq[dd.gap] || 0) + 1;
            }
        });

        // Weed-specific district bars with competitor info
        var sortedDists = distKeys.sort(function (a, b) { return sw.distData[b].opp - sw.distData[a].opp; });
        sortedDists.forEach(function (dName) {
            var dd = sw.distData[dName];
            var tc = dd.opp >= 65 ? '#6abf7b' : dd.opp >= 35 ? '#e8b84b' : '#e05c5c';
            h += '<div style="margin-bottom:8px;">';
            h += '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">';
            h += '<span style="font-size:10px;color:var(--textdim);">' + dName + ' <span style="color:var(--textmuted);font-size:9px;">(' + dd.comp.join(', ') + ')</span></span>';
            h += '<span style="font-size:9px;color:' + tc + ';font-family:\'JetBrains Mono\',monospace;">Opp: ' + dd.opp + '% · Prev: ' + dd.prev + '%</span>';
            h += '</div>';
            // Stacked bar: prevalence vs opportunity
            h += '<div style="display:flex;height:14px;border-radius:4px;overflow:hidden;background:var(--border);">';
            h += '<div style="width:' + dd.prev + '%;background:' + _weedTypeColor(sw.type) + ';opacity:0.6;" title="Prevalence: ' + dd.prev + '%"></div>';
            h += '<div style="width:' + Math.max(0, dd.opp - dd.prev) + '%;background:' + tc + ';" title="Opportunity gap: ' + (dd.opp - dd.prev) + '%"></div>';
            h += '</div>';
            h += '</div>';
        });
        h += '</div>';

        // Bottom: competitor share + gap opportunities
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px;">';

        // Competitor frequency
        h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;">';
        h += '<div style="font-size:11px;color:var(--accent);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:10px;">COMPETITOR PRESENCE (for ' + sw.name + ')</div>';
        var compSorted = Object.keys(compFreq).sort(function (a, b) { return compFreq[b] - compFreq[a]; });
        var compColors = { 'Generic': '#78909c', 'UPL': '#e05c5c', 'Bayer': '#4a9eff', 'Syngenta': '#6abf7b', 'DuPont': '#e8b84b', 'Dhanuka': '#9b7fcf', 'Dow': '#ff8c42', 'Nissan': '#f06292' };
        compSorted.forEach(function (c) {
            var pct = Math.round(compFreq[c] / distKeys.length * 100);
            var cc = compColors[c] || '#78909c';
            h += '<div style="margin-bottom:6px;">';
            h += '<div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;">';
            h += '<span style="color:var(--textdim);">' + c + '</span>';
            h += '<span style="color:' + cc + ';font-family:\'JetBrains Mono\',monospace;">' + compFreq[c] + ' districts (' + pct + '%)</span>';
            h += '</div>';
            h += '<div style="height:6px;background:var(--border);border-radius:3px;">';
            h += '<div style="height:100%;width:' + pct + '%;background:' + cc + ';border-radius:3px;"></div>';
            h += '</div></div>';
        });
        h += '</div>';

        // Gap opportunities
        h += '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px;">';
        h += '<div style="font-size:11px;color:var(--amber);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;margin-bottom:10px;">GAP OPPORTUNITIES (for ' + sw.name + ')</div>';
        var gapSorted = Object.keys(gapFreq).sort(function (a, b) { return gapFreq[b] - gapFreq[a]; });
        gapSorted.slice(0, 8).forEach(function (g) {
            h += '<div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;border-bottom:1px solid #1e3d2722;">';
            h += '<div style="width:6px;height:6px;border-radius:50%;background:var(--amber);margin-top:4px;flex-shrink:0;"></div>';
            h += '<span style="font-size:10px;color:var(--textdim);">' + g + ' <span style="color:var(--amber);font-family:\'JetBrains Mono\',monospace;">(' + gapFreq[g] + ' districts)</span></span>';
            h += '</div>';
        });

        // Product fit distribution
        h += '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);">';
        h += '<div style="font-size:9px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;margin-bottom:6px;">PRODUCT FIT DISTRIBUTION</div>';
        h += '<div style="display:flex;height:22px;border-radius:6px;overflow:hidden;">';
        var totalDists = distKeys.length;
        if (fitCounts.Strong > 0) h += '<div style="width:' + (fitCounts.Strong / totalDists * 100) + '%;background:#6abf7b;display:flex;align-items:center;justify-content:center;font-size:8px;color:#0b1a10;font-weight:600;">' + fitCounts.Strong + ' Strong</div>';
        if (fitCounts.Moderate > 0) h += '<div style="width:' + (fitCounts.Moderate / totalDists * 100) + '%;background:#e8b84b;display:flex;align-items:center;justify-content:center;font-size:8px;color:#0b1a10;font-weight:600;">' + fitCounts.Moderate + ' Moderate</div>';
        if (fitCounts.Weak > 0) h += '<div style="width:' + (fitCounts.Weak / totalDists * 100) + '%;background:#e05c5c;display:flex;align-items:center;justify-content:center;font-size:8px;color:#0b1a10;font-weight:600;">' + fitCounts.Weak + ' Weak</div>';
        h += '</div></div>';

        h += '</div></div>';
    } else {
        // Fallback: original molecule-based view
        h += '<div style="font-size:13px;color:var(--text);font-weight:600;margin-bottom:12px;">Select a weed type for competitor analysis</div>';
    }

    document.getElementById('pl-battle').innerHTML = h;
}

/* ═══════════════════════════════════════
   LAUNCH ROADMAP TAB (unchanged)
   ═══════════════════════════════════════ */
function renderPLRoadmap(d) {
    var waves = [
        { n: 1, label: 'Wave 1 — Attack', color: '#6abf7b', season: 'Kharif 2025', desc: 'Priority launch districts' },
        { n: 2, label: 'Wave 2 — Expand', color: '#e8b84b', season: 'Rabi 2025 / Kharif 2026', desc: 'Expansion with pre-mix opportunity' },
        { n: 3, label: 'Wave 3 — Monitor', color: '#e05c5c', season: 'Kharif 2026+', desc: 'Long-term expansion targets' }
    ];
    var h = '<div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">';
    h += '<div>';
    waves.forEach(function (w) {
        var wd = d.districts.filter(function (r) { return r.wave === w.n; });
        var pot = wd.reduce(function (s, r) { return s + r.estPotCr; }, 0).toFixed(1);
        h += '<div style="background:var(--surface);border:1px solid ' + w.color + '33;border-left:4px solid ' + w.color + ';border-radius:10px;padding:14px;margin-bottom:12px;">';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><div style="font-size:13px;color:' + w.color + ';font-weight:600;">' + w.label + '</div><div style="font-size:10px;color:var(--textmuted);">' + w.season + ' · ₹' + pot + ' Cr</div></div>';
        h += '<div style="font-size:10px;color:var(--textmuted);margin-bottom:10px;">' + w.desc + '</div>';
        h += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr>';
        ['District', 'Target Weeds', 'Rationale'].forEach(function (c) {
            h += '<th style="text-align:left;padding:6px;font-size:8px;color:var(--textmuted);font-family:\'JetBrains Mono\',monospace;border-bottom:1px solid var(--border);letter-spacing:.5px;">' + c + '</th>';
        });
        h += '</tr></thead><tbody>';
        wd.forEach(function (r) {
            h += '<tr style="border-bottom:1px solid #1e3d2722;"><td style="padding:6px;font-size:11px;color:var(--text);white-space:nowrap;">' + r.name + '</td><td style="padding:6px;font-size:10px;color:var(--textdim);">' + r.topWeeds.slice(0, 2).join(', ') + '</td><td style="padding:6px;font-size:10px;color:var(--textdim);max-width:200px;">' + r.waveReason.substring(0, 60) + '</td></tr>';
        });
        h += '</tbody></table></div></div>';
    });
    h += '</div>';
    h += '<div class="wd-info-panel">';
    h += '<div class="wd-info-row"><div class="wd-info-label">⚙️ STAGE GATES</div>';
    var sg = d.stageGates;
    ['regulatory:Regulatory Readiness', 'supply:Supply Readiness', 'distributor:Distributor Onboarding'].forEach(function (x) {
        var p = x.split(':');
        var v = sg[p[0]];
        var c = v === 'High' ? '#6abf7b' : v === 'Medium' ? '#e8b84b' : '#e05c5c';
        h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1e3d2722;"><span style="font-size:11px;color:var(--textdim);">' + p[1] + '</span>';
        h += '<select class="inp" id="sg_' + p[0] + '" style="width:80px;padding:2px 6px;font-size:10px;" onchange="recalcImpact()"><option' + (v === 'High' ? ' selected' : '') + '>High</option><option' + (v === 'Medium' ? ' selected' : '') + '>Medium</option><option' + (v === 'Low' ? ' selected' : '') + '>Low</option></select></div>';
    });
    h += '</div>';
    h += '<div class="wd-info-row" id="plImpactPanel"><div class="wd-info-label">PROJECTED IMPACT</div>';
    h += impactHTML(d);
    h += '</div>';
    h += '<div style="margin-top:8px;"><button class="btn btn-primary" style="width:100%;font-size:12px;" onclick="recalcImpact()">↻ Recalculate Impact</button></div>';
    h += '</div></div>';
    document.getElementById('pl-roadmap').innerHTML = h;
}

/* ── Impact HTML ── */
function impactHTML(d) {
    var h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">';
    h += '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:var(--accent);font-family:\'Playfair Display\',serif;">₹' + d.impact.totalPotCr + '</div><div style="font-size:9px;color:var(--textmuted);">Total (Cr)</div></div>';
    h += '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:#6abf7b;font-family:\'Playfair Display\',serif;">₹' + d.impact.wave1Cr + '</div><div style="font-size:9px;color:var(--textmuted);">Wave 1 (Cr)</div></div>';
    h += '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:#e8b84b;font-family:\'Playfair Display\',serif;">' + d.impact.districtsTargeted + '</div><div style="font-size:9px;color:var(--textmuted);">Districts</div></div>';
    h += '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:8px;"><div style="font-size:18px;color:var(--text);font-family:\'Playfair Display\',serif;">' + d.impact.wave1Count + '</div><div style="font-size:9px;color:var(--textmuted);">Wave 1 Districts</div></div>';
    h += '</div>';
    return h;
}

/* ── Recalculate Impact ── */
function recalcImpact() {
    var ck = getSelectedCrop();
    var d = PL_DATA[ck];
    if (!d) return;
    var reg = document.getElementById('sg_regulatory').value;
    var sup = document.getElementById('sg_supply').value;
    var dist = document.getElementById('sg_distributor').value;
    var mult = 1;
    if (reg === 'Medium') mult *= 0.85; if (reg === 'Low') mult *= 0.6;
    if (sup === 'Medium') mult *= 0.9; if (sup === 'Low') mult *= 0.65;
    if (dist === 'Medium') mult *= 0.92; if (dist === 'Low') mult *= 0.7;
    var adj = {
        totalPotCr: +(d.impact.totalPotCr * mult).toFixed(1),
        wave1Cr: +(d.impact.wave1Cr * mult).toFixed(1),
        wave2Cr: +(d.impact.wave2Cr * mult).toFixed(1),
        wave3Cr: +(d.impact.wave3Cr * mult).toFixed(1),
        districtsTargeted: d.impact.districtsTargeted,
        wave1Count: d.impact.wave1Count
    };
    if (reg === 'Low') adj.wave1Count = Math.max(2, adj.wave1Count - 2);
    if (sup === 'Low') adj.districtsTargeted = Math.max(5, adj.districtsTargeted - 3);
    var panel = document.getElementById('plImpactPanel');
    if (panel) panel.innerHTML = '<div class="wd-info-label">PROJECTED IMPACT (ADJUSTED)</div>' + impactHTML({ impact: adj }) + '<div style="font-size:9px;color:var(--amber);margin-top:6px;font-style:italic;">Adjusted by stage gate readiness factors (x' + mult.toFixed(2) + ')</div>';
}
