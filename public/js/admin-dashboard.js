document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SPA NAVIGATION
    // ==========================================
    const pages = {
        'dashboard': 'page-dashboard',
        'crop-repository': 'page-crop-repository',
        'digital-repository': 'page-digital-repository',
        'weather-monitor': 'page-weather-monitor',
        'global-alerts': 'page-global-alerts'
    };

    function navigateTo(pageName) {
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pages[pageName]);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.getElementById('nav-' + pageName);
        if (navItem) navItem.classList.add('active');

        document.querySelectorAll('.bnav-item').forEach(n => n.classList.remove('active'));
        const mobNav = document.getElementById('mob-nav-' + pageName);
        if (mobNav) mobNav.classList.add('active');

        closeSidebar();
        loadPageData(pageName);
    }

    document.querySelectorAll('.nav-item, .bnav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '/login') return;
            e.preventDefault();
            const pageName = href.split('/').pop();
            history.pushState({ page: pageName }, '', href);
            navigateTo(pageName);
        });
    });

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            navigateTo(e.state.page);
        }
    });

    // ==========================================
    // MOBILE SIDEBAR TOGGLE
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // ==========================================
    // TOAST NOTIFICATIONS
    // ==========================================
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    }

    // ==========================================
    // DATE DISPLAY
    // ==========================================
    const dateEl = document.getElementById('admin-date');
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // ==========================================
    // DATA LOADING ROUTER
    // ==========================================
    function loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard': loadDashboard(); break;
            case 'crop-repository': loadCrops(); break;
            case 'digital-repository': loadTrivia(); break;
            case 'weather-monitor': loadWeatherLogs(); break;
            case 'global-alerts': loadAlerts(); break;
        }
    }

    // ==========================================
    // Helpers
    // ==========================================
    function esc(s) {
        if (s === null || s === undefined) return '';
        return String(s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Crop emoji heuristic for visual variety
    function cropEmoji(name) {
        if (!name) return '🌱';
        const n = name.toLowerCase();
        if (n.includes('rice') || n.includes('palay')) return '🌾';
        if (n.includes('corn') || n.includes('maize')) return '🌽';
        if (n.includes('tomato')) return '🍅';
        if (n.includes('pepper') || n.includes('chili')) return '🌶';
        if (n.includes('eggplant') || n.includes('talong')) return '🍆';
        if (n.includes('kangkong')) return '🥬';
        if (n.includes('mongo') || n.includes('bean') || n.includes('legum')) return '🫘';
        if (n.includes('banana')) return '🍌';
        if (n.includes('mango')) return '🥭';
        if (n.includes('coconut')) return '🥥';
        if (n.includes('squash') || n.includes('kalabasa')) return '🎃';
        if (n.includes('onion') || n.includes('sibuyas')) return '🧅';
        if (n.includes('garlic') || n.includes('bawang')) return '🧄';
        if (n.includes('cabbage') || n.includes('repolyo')) return '🥗';
        return '🌱';
    }

    // ==========================================
    // PAGE 1: DASHBOARD
    // ==========================================
    async function loadDashboard() {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();

            document.getElementById('stat-farmers').textContent = data.totalFarmers;
            document.getElementById('stat-plots').textContent = data.activePlots;

            const dot = document.getElementById('api-status-dot');
            const text = document.getElementById('api-status-text');
            const lastLog = document.getElementById('api-last-log');

            if (data.apiStatus === 'online') {
                dot.className = 'status-dot online';
                text.textContent = 'Online';
                text.style.color = '#047857';
            } else {
                dot.className = 'status-dot offline';
                text.textContent = 'Offline';
                text.style.color = '#DC2626';
            }
            lastLog.textContent = data.lastLogTime ? 'Last data: ' + new Date(data.lastLogTime).toLocaleString() : 'No recent data';

            // Recent logs as activity rows
            const logsEl = document.getElementById('dash-recent-logs');
            if (data.recentLogs && data.recentLogs.length > 0) {
                logsEl.innerHTML = data.recentLogs.map(l => `
                    <div class="activity-row">
                        <div class="ar-main">
                            <div class="ar-time">${new Date(l.timestamp).toLocaleString()}</div>
                        </div>
                        <div class="ar-value">${parseFloat(l.temperature).toFixed(1)}°C</div>
                        <span class="source-badge ${l.data_source.toLowerCase()}">${esc(l.data_source)}</span>
                    </div>
                `).join('');
            } else {
                logsEl.innerHTML = '<div class="empty-state" style="padding:24px;"><p>No weather logs yet</p></div>';
            }

            // Recent alerts as activity rows
            const alertsEl = document.getElementById('dash-recent-alerts');
            if (data.recentAlerts && data.recentAlerts.length > 0) {
                alertsEl.innerHTML = data.recentAlerts.map(a => {
                    const msg = a.message.length > 70 ? a.message.substring(0, 70) + '...' : a.message;
                    return `
                        <div class="activity-row">
                            <div class="ar-main">
                                <div class="ar-msg">${esc(msg)}</div>
                                <div class="ar-time">${new Date(a.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                alertsEl.innerHTML = '<div class="empty-state" style="padding:24px;"><p>No alerts sent yet</p></div>';
            }

        } catch (err) {
            console.error('Dashboard load error:', err);
        }
    }

    // ==========================================
    // PAGE 2: CROP REPOSITORY
    // ==========================================
    let allCrops = [];
    let cropSearchQuery = '';
    let cropCurrentPage = 1;
    const CROPS_PER_PAGE = 15;

    async function loadCrops() {
        try {
            const res = await fetch('/api/crops');
            allCrops = await res.json();
            cropCurrentPage = 1;
            renderCropGrid();
            populateCropSelectors();
        } catch (err) {
            console.error('Load crops error:', err);
        }
    }

    function renderCropGrid() {
        const grid = document.getElementById('crop-grid');
        const countPill = document.getElementById('crop-count-pill');
        if (!grid) return;

        const filtered = allCrops.filter(c =>
            !cropSearchQuery || (c.crop_name || '').toLowerCase().includes(cropSearchQuery.toLowerCase())
        );

        const totalPages = Math.max(1, Math.ceil(filtered.length / CROPS_PER_PAGE));
        if (cropCurrentPage > totalPages) cropCurrentPage = totalPages;

        const startIdx = (cropCurrentPage - 1) * CROPS_PER_PAGE;
        const pageItems = filtered.slice(startIdx, startIdx + CROPS_PER_PAGE);

        if (countPill) {
            countPill.textContent = totalPages > 1
                ? `${filtered.length} crops — Page ${cropCurrentPage} of ${totalPages}`
                : `${filtered.length} crop${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = allCrops.length === 0
                ? `<div class="crop-empty empty-state">
                     <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                     <p>No crops in the repository yet.<br>Click "Add Crop" to get started.</p>
                   </div>`
                : `<div class="crop-empty empty-state">
                     <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                     <p>No crops match "${esc(cropSearchQuery)}".</p>
                   </div>`;
            return;
        }

        // Temperature scale bounds for visualization (fixed range 0–45°C)
        const TEMP_MIN = 0;
        const TEMP_MAX = 45;
        const TEMP_SPAN = TEMP_MAX - TEMP_MIN;

        grid.innerHTML = pageItems.map(c => {
            const minT = parseFloat(c.ideal_temp_min) || 0;
            const maxT = parseFloat(c.ideal_temp_max) || 0;
            const rain = parseFloat(c.rain_tolerance) || 0;
            const days = c.days_to_harvest || 0;

            // Avoid divide-by-zero — clamp
            const bandLeft = Math.max(0, Math.min(100, ((minT - TEMP_MIN) / TEMP_SPAN) * 100));
            const bandWidth = Math.max(2, Math.min(100 - bandLeft, ((maxT - minT) / TEMP_SPAN) * 100));

            // Rain bar — scale to 200mm cap
            const rainPct = Math.min(100, (rain / 200) * 100);

            return `
                <div class="crop-card">
                    <div class="cc-head">
                        <div style="display:flex;gap:12px;align-items:center;">
                            <div class="cc-icon">${cropEmoji(c.crop_name)}</div>
                            <div>
                                <div class="cc-name">${esc(c.crop_name)}</div>
                                <div class="cc-id">Crop #${c.crop_id}</div>
                            </div>
                        </div>
                        <div class="cc-actions">
                            <button class="icon-btn btn-edit-crop" data-id="${c.crop_id}" aria-label="Edit ${esc(c.crop_name)}" title="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="icon-btn danger btn-delete-crop" data-id="${c.crop_id}" data-name="${esc(c.crop_name)}" aria-label="Delete ${esc(c.crop_name)}" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                            </button>
                        </div>
                    </div>

                    <div class="temp-range">
                        <div class="temp-range-label">
                            <span>Temperature Range</span>
                            <span class="tr-val">${minT.toFixed(1)}°&ndash;${maxT.toFixed(1)}°C</span>
                        </div>
                        <div class="temp-range-track">
                            <div class="ideal-band" style="left:${bandLeft}%;width:${bandWidth}%;"></div>
                        </div>
                    </div>

                    <div class="rain-bar">
                        <div class="rb-head">
                            <span>Rain Tolerance</span>
                            <span class="rb-val">${rain.toFixed(1)} mm/hr</span>
                        </div>
                        <div class="rain-bar-track">
                            <div class="rain-bar-fill" style="width:${rainPct}%;"></div>
                        </div>
                    </div>

                    <div class="cc-footer">
                        <span class="harvest-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${days} days to harvest
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.btn-edit-crop').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                editCrop(id);
            });
        });
        grid.querySelectorAll('.btn-delete-crop').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                deleteCrop(id, name);
            });
        });

        renderPagination(totalPages, filtered.length);
    }

    function renderPagination(totalPages, totalItems) {
        const grid = document.getElementById('crop-grid');
        const existing = document.getElementById('crop-pagination');
        if (existing) existing.remove();

        if (totalPages <= 1) return;

        const nav = document.createElement('div');
        nav.id = 'crop-pagination';
        nav.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:6px;padding:20px 0 4px;flex-wrap:wrap;';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = '‹ Prev';
        prevBtn.disabled = cropCurrentPage === 1;
        prevBtn.style.cssText = `padding:6px 14px;border:1px solid #D4D2CA;border-radius:6px;background:${cropCurrentPage === 1 ? '#F3F2EE' : '#fff'};color:${cropCurrentPage === 1 ? '#B0ADA6' : '#1C1B16'};cursor:${cropCurrentPage === 1 ? 'default' : 'pointer'};font-size:13px;font-weight:600;`;
        prevBtn.addEventListener('click', () => {
            if (cropCurrentPage > 1) { cropCurrentPage--; renderCropGrid(); }
        });
        nav.appendChild(prevBtn);

        const maxVisible = 5;
        let startP = Math.max(1, cropCurrentPage - Math.floor(maxVisible / 2));
        let endP = Math.min(totalPages, startP + maxVisible - 1);
        if (endP - startP + 1 < maxVisible) startP = Math.max(1, endP - maxVisible + 1);

        if (startP > 1) {
            const first = document.createElement('button');
            first.textContent = '1';
            first.style.cssText = 'padding:6px 12px;border:1px solid #D4D2CA;border-radius:6px;background:#fff;color:#1C1B16;cursor:pointer;font-size:13px;font-weight:600;';
            first.addEventListener('click', () => { cropCurrentPage = 1; renderCropGrid(); });
            nav.appendChild(first);
            if (startP > 2) {
                const dots = document.createElement('span');
                dots.textContent = '…';
                dots.style.cssText = 'padding:6px 4px;color:#9A9790;font-size:13px;';
                nav.appendChild(dots);
            }
        }

        for (let i = startP; i <= endP; i++) {
            const btn = document.createElement('button');
            btn.textContent = String(i);
            const active = i === cropCurrentPage;
            btn.style.cssText = `padding:6px 12px;border:1px solid ${active ? '#2E7D32' : '#D4D2CA'};border-radius:6px;background:${active ? '#2E7D32' : '#fff'};color:${active ? '#fff' : '#1C1B16'};cursor:pointer;font-size:13px;font-weight:600;`;
            btn.addEventListener('click', () => { cropCurrentPage = i; renderCropGrid(); });
            nav.appendChild(btn);
        }

        if (endP < totalPages) {
            if (endP < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '…';
                dots.style.cssText = 'padding:6px 4px;color:#9A9790;font-size:13px;';
                nav.appendChild(dots);
            }
            const last = document.createElement('button');
            last.textContent = String(totalPages);
            last.style.cssText = 'padding:6px 12px;border:1px solid #D4D2CA;border-radius:6px;background:#fff;color:#1C1B16;cursor:pointer;font-size:13px;font-weight:600;';
            last.addEventListener('click', () => { cropCurrentPage = totalPages; renderCropGrid(); });
            nav.appendChild(last);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next ›';
        nextBtn.disabled = cropCurrentPage === totalPages;
        nextBtn.style.cssText = `padding:6px 14px;border:1px solid #D4D2CA;border-radius:6px;background:${cropCurrentPage === totalPages ? '#F3F2EE' : '#fff'};color:${cropCurrentPage === totalPages ? '#B0ADA6' : '#1C1B16'};cursor:${cropCurrentPage === totalPages ? 'default' : 'pointer'};font-size:13px;font-weight:600;`;
        nextBtn.addEventListener('click', () => {
            if (cropCurrentPage < totalPages) { cropCurrentPage++; renderCropGrid(); }
        });
        nav.appendChild(nextBtn);

        grid.parentNode.appendChild(nav);
    }

    function populateCropSelectors() {
        const triviaSelect = document.getElementById('trivia-crop-tag');
        if (triviaSelect) {
            const currentVal = triviaSelect.value;
            triviaSelect.innerHTML = '<option value="General">General</option>' +
                allCrops.map(c => `<option value="${esc(c.crop_name)}">${esc(c.crop_name)}</option>`).join('');
            triviaSelect.value = currentVal || 'General';
        }

        const alertSelect = document.getElementById('alert-crop-filter');
        if (alertSelect) {
            alertSelect.innerHTML = '<option value="">Select a crop...</option>' +
                allCrops.map(c => `<option value="${esc(c.crop_name)}">${esc(c.crop_name)}</option>`).join('');
        }
    }

    // Search input
    const cropSearchInput = document.getElementById('crop-search-input');
    if (cropSearchInput) {
        cropSearchInput.addEventListener('input', (e) => {
            cropSearchQuery = e.target.value;
            cropCurrentPage = 1;
            renderCropGrid();
        });
    }

    // Crop Modal
    const cropModal = document.getElementById('cropModal');
    const cropForm = document.getElementById('cropForm');
    const cropModalTitle = document.getElementById('cropModalTitle');
    const cropModalClose = document.getElementById('cropModalClose');
    const cropModalCancel = document.getElementById('cropModalCancel');
    const btnAddCrop = document.getElementById('btn-add-crop');

    function openCropModal(crop = null) {
        if (crop) {
            cropModalTitle.textContent = 'Edit Crop';
            document.getElementById('crop-edit-id').value = crop.crop_id;
            document.getElementById('crop-name').value = crop.crop_name;
            document.getElementById('crop-min-temp').value = crop.ideal_temp_min;
            document.getElementById('crop-max-temp').value = crop.ideal_temp_max;
            document.getElementById('crop-rain').value = crop.rain_tolerance;
            document.getElementById('crop-days').value = crop.days_to_harvest;
            document.getElementById('crop-practices').value = crop.best_practices || '';
        } else {
            cropModalTitle.textContent = 'Add New Crop';
            cropForm.reset();
            document.getElementById('crop-edit-id').value = '';
        }
        cropModal.classList.add('open');
    }

    function closeCropModal() {
        cropModal.classList.remove('open');
        cropForm.reset();
        document.getElementById('crop-edit-id').value = '';
    }

    if (btnAddCrop) btnAddCrop.addEventListener('click', () => openCropModal());
    if (cropModalClose) cropModalClose.addEventListener('click', closeCropModal);
    if (cropModalCancel) cropModalCancel.addEventListener('click', closeCropModal);
    cropModal.addEventListener('click', (e) => {
        if (e.target === cropModal) closeCropModal();
    });

    cropForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('crop-edit-id').value;
        const payload = {
            crop_name: document.getElementById('crop-name').value,
            ideal_temp_min: document.getElementById('crop-min-temp').value,
            ideal_temp_max: document.getElementById('crop-max-temp').value,
            rain_tolerance: document.getElementById('crop-rain').value,
            days_to_harvest: document.getElementById('crop-days').value,
            best_practices: document.getElementById('crop-practices').value
        };

        try {
            let res;
            if (editId) {
                res = await fetch('/api/admin/crops/' + editId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/admin/crops', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                showToast(editId ? 'Crop successfully updated!' : 'New crop successfully added!');
                closeCropModal();
                loadCrops();
            } else {
                const err = await res.json();
                showToast('Error: ' + (err.error || 'Failed to save'));
            }
        } catch (err) {
            showToast('Network error. Please try again.');
        }
    });

    function editCrop(id) {
        const crop = allCrops.find(c => c.crop_id === id);
        if (crop) openCropModal(crop);
    }

    async function deleteCrop(id, name) {
        if (!confirm('Delete "' + name + '" from the crop repository?')) return;
        try {
            const res = await fetch('/api/admin/crops/' + id, { method: 'DELETE' });
            if (res.ok) {
                showToast('Crop deleted.');
                loadCrops();
            } else {
                showToast('Failed to delete crop.');
            }
        } catch (err) {
            showToast('Network error.');
        }
    }

    // ==========================================
    // PAGE 3: DIGITAL REPOSITORY (TRIVIA)
    // ==========================================
    async function loadTrivia() {
        if (allCrops.length === 0) {
            try {
                const res = await fetch('/api/crops');
                allCrops = await res.json();
                populateCropSelectors();
            } catch (e) {}
        }

        try {
            const res = await fetch('/api/admin/trivia');
            const trivia = await res.json();
            const feed = document.getElementById('trivia-feed');

            if (trivia.length === 0) {
                feed.innerHTML = `<div class="empty-state">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No trivia published yet.<br>Write your first tip above!</p>
                </div>`;
                return;
            }

            feed.innerHTML = trivia.map(t => {
                const isGeneral = !t.crop_tag || t.crop_tag === 'General';
                return `
                    <div class="trivia-item">
                        <button class="trivia-delete btn-delete-trivia" data-id="${t.trivia_id}" title="Delete" aria-label="Delete trivia">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                        <div class="trivia-tag-row">
                            <span class="trivia-tag ${isGeneral ? 'general' : ''}">${esc(t.crop_tag || 'General')}</span>
                            <span class="trivia-date">${new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div class="trivia-content">${esc(t.content)}</div>
                    </div>
                `;
            }).join('');

            feed.querySelectorAll('.btn-delete-trivia').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    deleteTrivia(id);
                });
            });
        } catch (err) {
            console.error('Load trivia error:', err);
        }
    }

    const btnPublish = document.getElementById('btn-publish-trivia');
    if (btnPublish) {
        btnPublish.addEventListener('click', async () => {
            const content = document.getElementById('trivia-content').value.trim();
            const cropTag = document.getElementById('trivia-crop-tag').value;

            if (!content) {
                showToast('Please write some content first.');
                return;
            }

            try {
                const res = await fetch('/api/admin/trivia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, crop_tag: cropTag })
                });

                if (res.ok) {
                    showToast('Trivia published to all farmers.');
                    document.getElementById('trivia-content').value = '';
                    document.getElementById('trivia-crop-tag').value = 'General';
                    loadTrivia();
                } else {
                    showToast('Failed to publish trivia.');
                }
            } catch (err) {
                showToast('Network error.');
            }
        });
    }

    async function deleteTrivia(id) {
        if (!confirm('Delete this trivia entry?')) return;
        try {
            const res = await fetch('/api/admin/trivia/' + id, { method: 'DELETE' });
            if (res.ok) {
                showToast('Trivia entry deleted.');
                loadTrivia();
            }
        } catch (err) {
            showToast('Network error.');
        }
    }

    // ==========================================
    // PAGE 4: WEATHER MONITOR
    // ==========================================
    async function loadWeatherLogs(from, to) {
        try {
            let url = '/api/admin/weather-logs';
            const params = new URLSearchParams();
            if (from) params.append('from', from);
            if (to) params.append('to', to);
            if (params.toString()) url += '?' + params.toString();

            const res = await fetch(url);
            const logs = await res.json();
            const list = document.getElementById('weather-log-list');
            const countPill = document.getElementById('weather-log-count-pill');

            if (countPill) countPill.textContent = `${logs.length} log${logs.length === 1 ? '' : 's'}`;

            if (logs.length === 0) {
                list.innerHTML = `<div class="empty-state">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <p>No weather logs found for this period.</p>
                </div>`;
                return;
            }

            list.innerHTML = logs.map(l => {
                const d = new Date(l.timestamp);
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                const temp = parseFloat(l.temperature);
                const humidity = parseFloat(l.humidity);
                const wind = parseFloat(l.wind_speed);
                const rainfall = parseFloat(l.rainfall);
                const isAnomalous = rainfall > 100;

                return `
                    <div class="weather-log${isAnomalous ? ' anomalous' : ''}">
                        <div class="wl-time">
                            <span class="wl-date">${dateStr}</span>
                            <span class="wl-clock">${timeStr}</span>
                        </div>
                        <div class="wl-metrics">
                            <div class="wl-metric">
                                <span class="wlm-label">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>
                                    Temp
                                </span>
                                <span class="wlm-value">${temp.toFixed(1)}<span class="wlm-unit">°C</span></span>
                            </div>
                            <div class="wl-metric">
                                <span class="wlm-label">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
                                    Humidity
                                </span>
                                <span class="wlm-value">${humidity.toFixed(0)}<span class="wlm-unit">%</span></span>
                            </div>
                            <div class="wl-metric">
                                <span class="wlm-label">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>
                                    Wind
                                </span>
                                <span class="wlm-value">${wind.toFixed(1)}<span class="wlm-unit">km/h</span></span>
                            </div>
                            <div class="wl-metric">
                                <span class="wlm-label">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
                                    Rainfall
                                </span>
                                <span class="wlm-value${isAnomalous ? ' anomaly' : ''}">${rainfall.toFixed(1)}<span class="wlm-unit">mm</span>${isAnomalous ? '<span class="wl-anomaly-flag">⚠ High</span>' : ''}</span>
                            </div>
                        </div>
                        <div class="wl-source">
                            <span class="source-badge ${l.data_source.toLowerCase()}">${esc(l.data_source)}</span>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            console.error('Load weather logs error:', err);
        }
    }

    const btnFilter = document.getElementById('btn-filter-logs');
    const btnReset = document.getElementById('btn-reset-logs');

    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            const from = document.getElementById('weather-from').value;
            const to = document.getElementById('weather-to').value;
            loadWeatherLogs(from, to);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            document.getElementById('weather-from').value = '';
            document.getElementById('weather-to').value = '';
            loadWeatherLogs();
        });
    }

    // Set default date range to last 7 days
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const toInput = document.getElementById('weather-to');
    const fromInput = document.getElementById('weather-from');
    if (toInput) toInput.value = today.toISOString().split('T')[0];
    if (fromInput) fromInput.value = weekAgo.toISOString().split('T')[0];

    // ==========================================
    // PAGE 5: GLOBAL ALERTS
    // ==========================================
    const audienceSelector = document.getElementById('audience-selector');
    const cropFilterGroup = document.getElementById('crop-filter-group');
    let selectedAudience = 'all';

    if (audienceSelector) {
        audienceSelector.querySelectorAll('.audience-option').forEach(opt => {
            opt.addEventListener('click', () => {
                audienceSelector.querySelectorAll('.audience-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedAudience = opt.dataset.audience;

                if (selectedAudience === 'crop') {
                    cropFilterGroup.style.display = 'block';
                } else {
                    cropFilterGroup.style.display = 'none';
                }
            });
        });
    }

    let alertCurrentPage = 1;
    let alertTotalPages = 1;
    let alertSearchQuery = '';
    let alertSortOrder = 'DESC';

    // Search and Sort event listeners
    const alertSearchInput = document.getElementById('alert-search');
    const alertSortSelect = document.getElementById('alert-sort');
    const btnAlertPrev = document.getElementById('btn-alert-prev');
    const btnAlertNext = document.getElementById('btn-alert-next');

    if (alertSearchInput) {
        alertSearchInput.addEventListener('input', debounce(() => {
            alertSearchQuery = alertSearchInput.value;
            alertCurrentPage = 1;
            loadAlerts();
        }, 300));
    }

    if (alertSortSelect) {
        alertSortSelect.addEventListener('change', () => {
            alertSortOrder = alertSortSelect.value;
            alertCurrentPage = 1;
            loadAlerts();
        });
    }

    if (btnAlertPrev) {
        btnAlertPrev.addEventListener('click', () => {
            if (alertCurrentPage > 1) {
                alertCurrentPage--;
                loadAlerts();
            }
        });
    }

    if (btnAlertNext) {
        btnAlertNext.addEventListener('click', () => {
            if (alertCurrentPage < alertTotalPages) {
                alertCurrentPage++;
                loadAlerts();
            }
        });
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    async function loadAlerts() {
        if (allCrops.length === 0) {
            try {
                const res = await fetch('/api/crops');
                allCrops = await res.json();
                populateCropSelectors();
            } catch (e) {}
        }

        try {
            const url = `/api/admin/alerts?page=${alertCurrentPage}&limit=10&search=${encodeURIComponent(alertSearchQuery)}&order=${alertSortOrder}`;
            const res = await fetch(url);
            const result = await res.json();
            const alerts = result.data || [];
            const pagination = result.pagination || { page: 1, totalPages: 1 };

            alertCurrentPage = pagination.page;
            alertTotalPages = pagination.totalPages;

            const pageInfoEl = document.getElementById('alert-page-info');
            if (pageInfoEl) {
                pageInfoEl.textContent = `Page ${alertCurrentPage} of ${alertTotalPages || 1}`;
            }

            const btnPrev = document.getElementById('btn-alert-prev');
            const btnNext = document.getElementById('btn-alert-next');
            if (btnPrev) btnPrev.disabled = alertCurrentPage <= 1;
            if (btnNext) btnNext.disabled = alertCurrentPage >= alertTotalPages;

            const historyEl = document.getElementById('alert-history');

            if (alerts.length === 0) {
                historyEl.innerHTML = `<div class="empty-state">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                    <p>No advisories match your filters.</p>
                </div>`;
                return;
            }

            historyEl.innerHTML = alerts.map(a => {
                const d = new Date(a.created_at);
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="alert-history-item" style="display:flex; justify-content:space-between; align-items:center; width:100%; box-sizing:border-box;">
                        <div style="display:flex; align-items:center; flex:1;">
                            <div class="ahi-dot"></div>
                            <div class="ahi-body" style="flex:1;">
                                <div class="ahi-message">${esc(a.message)}</div>
                                <div class="ahi-meta">
                                    <span class="ahi-meta-pill">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        ${dateStr} · ${timeStr}
                                    </span>
                                    <span class="ahi-meta-pill">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        ${a.recipient_count || 0} recipient${(a.recipient_count || 0) === 1 ? '' : 's'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button class="btn-delete-alert" data-message="${esc(a.message)}" data-created="${a.created_at}" style="background:none; border:none; color:#e74c3c; cursor:pointer; padding:6px; margin-left:12px; display:flex; align-items:center; border-radius:4px; transition:background-color 0.2s;" title="Delete advisory">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                `;
            }).join('');

            // Attach event listeners for delete buttons
            document.querySelectorAll('.btn-delete-alert').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const button = e.currentTarget;
                    const msg = button.getAttribute('data-message');
                    const created = button.getAttribute('data-created');
                    
                    if (confirm('Are you sure you want to delete this advisory? This will remove the advisory from all recipients\' dashboards.')) {
                        try {
                            const delRes = await fetch('/api/admin/alerts', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ message: msg, created_at: created })
                            });
                            const delResult = await delRes.json();
                            if (delResult.success) {
                                showToast('Advisory deleted successfully.');
                                loadAlerts();
                            } else {
                                showToast('Failed to delete advisory.');
                            }
                        } catch (err) {
                            showToast('Error deleting advisory.');
                            console.error(err);
                        }
                    }
                });
            });
        } catch (err) {
            console.error('Load alerts error:', err);
        }
    }

    const btnSend = document.getElementById('btn-send-alert');
    if (btnSend) {
        btnSend.addEventListener('click', async () => {
            const message = document.getElementById('alert-message').value.trim();
            if (!message) {
                showToast('Please write an advisory message.');
                return;
            }

            const payload = {
                message,
                audience: selectedAudience
            };

            if (selectedAudience === 'crop') {
                const cropName = document.getElementById('alert-crop-filter').value;
                if (!cropName) {
                    showToast('Please select a target crop.');
                    return;
                }
                payload.crop_name = cropName;
            }

            const loadingModal = document.getElementById('advisoryLoadingModal');
            const loadingStatus = document.getElementById('advisory-loading-status');
            
            if (loadingModal && loadingStatus) {
                loadingModal.classList.add('open');
                loadingStatus.textContent = 'Initializing connection...';
            }

            try {
                const res = await fetch('/api/admin/alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let buffer = '';

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop(); // Keep the unfinished line in buffer

                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const data = JSON.parse(line);
                                    if (data.status === 'info') {
                                        if (loadingStatus) loadingStatus.textContent = data.message;
                                    } else if (data.status === 'sending') {
                                        if (loadingStatus) {
                                            loadingStatus.innerHTML = `Sending to: <strong>${data.name}</strong><br><span style="font-size:12px;color:var(--admin-text-muted);">${data.email}</span><br><span style="font-size:11px;">(${data.index} of ${data.total})</span>`;
                                        }
                                    } else if (data.status === 'complete') {
                                        showToast(`Advisory successfully sent to ${data.successCount} of ${data.recipientCount} farmer(s).`);
                                    } else if (data.status === 'error') {
                                        showToast('Error: ' + (data.error || 'Failed to send'));
                                    }
                                } catch (e) {
                                    console.error('Error parsing stream line:', e);
                                }
                            }
                        }
                    }

                    document.getElementById('alert-message').value = '';
                    loadAlerts();
                } else {
                    const err = await res.json().catch(() => ({ error: 'Failed to send' }));
                    showToast('Error: ' + (err.error || 'Failed to send'));
                }
            } catch (err) {
                showToast('Network error.');
                console.error(err);
            } finally {
                if (loadingModal) {
                    loadingModal.classList.remove('open');
                }
            }
        });
    }

    // ==========================================
    // INITIAL NAVIGATION ROUTING
    // ==========================================
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === 'admin') currentPath = 'dashboard';
    history.replaceState({ page: currentPath }, '', window.location.pathname);
    navigateTo(currentPath);

});