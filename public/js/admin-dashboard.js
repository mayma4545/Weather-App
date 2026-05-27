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
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
        // Show target
        const target = document.getElementById(pages[pageName]);
        if (target) target.classList.add('active');

        // Update sidebar active
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const navItem = document.getElementById('nav-' + pageName);
        if (navItem) navItem.classList.add('active');

        // Update bottom nav active
        document.querySelectorAll('.bnav-item').forEach(n => n.classList.remove('active'));
        const mobNav = document.getElementById('mob-nav-' + pageName);
        if (mobNav) mobNav.classList.add('active');

        // Close mobile sidebar if open
        closeSidebar();

        // Load data for that page
        loadPageData(pageName);
    }

    // Intercept all nav clicks for SPA behavior
    document.querySelectorAll('.nav-item, .bnav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const pageName = href.split('/').pop();
            history.pushState({ page: pageName }, '', href);
            navigateTo(pageName);
        });
    });

    // Handle browser back/forward
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
        setTimeout(() => toast.classList.remove('show'), 3000);
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
    const loadedPages = {};

    function loadPageData(pageName) {
        // Always reload for freshness
        switch (pageName) {
            case 'dashboard': loadDashboard(); break;
            case 'crop-repository': loadCrops(); break;
            case 'digital-repository': loadTrivia(); break;
            case 'weather-monitor': loadWeatherLogs(); break;
            case 'global-alerts': loadAlerts(); break;
        }
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
                text.style.color = '#5A8A42';
            } else {
                dot.className = 'status-dot offline';
                text.textContent = 'Offline';
                text.style.color = '#C0531A';
            }
            lastLog.textContent = data.lastLogTime ? 'Last data: ' + new Date(data.lastLogTime).toLocaleString() : 'No recent data';

            // Recent logs
            const logsEl = document.getElementById('dash-recent-logs');
            if (data.recentLogs && data.recentLogs.length > 0) {
                logsEl.innerHTML = data.recentLogs.map(l => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #F0EDE8;font-size:12px;">
                        <span style="color:#7A7773;">${new Date(l.timestamp).toLocaleString()}</span>
                        <span style="font-weight:500;">${parseFloat(l.temperature).toFixed(1)}°C</span>
                        <span class="source-badge ${l.data_source.toLowerCase()}">${l.data_source}</span>
                    </div>
                `).join('');
            } else {
                logsEl.innerHTML = '<div class="empty-state"><p>No weather logs yet</p></div>';
            }

            // Recent alerts
            const alertsEl = document.getElementById('dash-recent-alerts');
            if (data.recentAlerts && data.recentAlerts.length > 0) {
                alertsEl.innerHTML = data.recentAlerts.map(a => `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid #F0EDE8;font-size:12px;gap:12px;">
                        <span style="color:#3B3B38;flex:1;">${a.message.length > 60 ? a.message.substring(0, 60) + '...' : a.message}</span>
                        <span style="color:#9A9790;white-space:nowrap;">${new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                `).join('');
            } else {
                alertsEl.innerHTML = '<div class="empty-state"><p>No alerts sent yet</p></div>';
            }

        } catch (err) {
            console.error('Dashboard load error:', err);
        }
    }

    // ==========================================
    // PAGE 2: CROP REPOSITORY
    // ==========================================
    let allCrops = [];

    async function loadCrops() {
        try {
            const res = await fetch('/api/crops');
            allCrops = await res.json();
            renderCropTable();
            populateCropSelectors();
        } catch (err) {
            console.error('Load crops error:', err);
        }
    }

    function renderCropTable() {
        const tbody = document.getElementById('crop-table-body');
        if (allCrops.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9A9790;padding:30px;">No crops in the repository yet. Click "Add Crop" to start.</td></tr>';
            return;
        }
        tbody.innerHTML = allCrops.map(c => `
            <tr>
                <td style="font-weight:500;">${c.crop_name}</td>
                <td>${parseFloat(c.ideal_temp_min).toFixed(1)}</td>
                <td>${parseFloat(c.ideal_temp_max).toFixed(1)}</td>
                <td>${parseFloat(c.rain_tolerance).toFixed(1)}</td>
                <td>${c.days_to_harvest}</td>
                <td>
                    <div style="display:flex;gap:6px;">
                        <button class="btn-primary btn-sm btn-edit-crop" data-id="${c.crop_id}">Edit</button>
                        <button class="btn-danger btn-sm btn-delete-crop" data-id="${c.crop_id}" data-name="${c.crop_name}">
                            Del
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Attach event listeners dynamically to comply with strict CSP
        tbody.querySelectorAll('.btn-edit-crop').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                editCrop(id);
            });
        });
        tbody.querySelectorAll('.btn-delete-crop').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const name = btn.dataset.name;
                deleteCrop(id, name);
            });
        });
    }

    function populateCropSelectors() {
        // Trivia crop tag dropdown
        const triviaSelect = document.getElementById('trivia-crop-tag');
        if (triviaSelect) {
            const currentVal = triviaSelect.value;
            triviaSelect.innerHTML = '<option value="General">General</option>' +
                allCrops.map(c => `<option value="${c.crop_name}">${c.crop_name}</option>`).join('');
            triviaSelect.value = currentVal || 'General';
        }

        // Alert crop filter dropdown
        const alertSelect = document.getElementById('alert-crop-filter');
        if (alertSelect) {
            alertSelect.innerHTML = '<option value="">Select a crop...</option>' +
                allCrops.map(c => `<option value="${c.crop_name}">${c.crop_name}</option>`).join('');
        }
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

    // Save crop
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
                showToast(editId ? 'Crop successfully updated!' : 'New crop successfully added to the database!');
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

    // Local helper functions for table button actions
    function editCrop(id) {
        const crop = allCrops.find(c => c.crop_id === id);
        if (crop) openCropModal(crop);
    }

    async function deleteCrop(id, name) {
        if (!confirm('Delete "' + name + '" from the crop repository?')) return;
        try {
            const res = await fetch('/api/admin/crops/' + id, { method: 'DELETE' });
            if (res.ok) {
                showToast('Crop deleted successfully.');
                loadCrops();
            } else {
                showToast('Failed to delete crop.');
            }
        } catch (err) {
            showToast('Network error.');
        }
    };

    // ==========================================
    // PAGE 3: DIGITAL REPOSITORY (TRIVIA)
    // ==========================================
    async function loadTrivia() {
        // Also ensure crop selectors are populated
        if (allCrops.length === 0) {
            try {
                const res = await fetch('/api/crops');
                allCrops = await res.json();
                populateCropSelectors();
            } catch(e) {}
        }

        try {
            const res = await fetch('/api/admin/trivia');
            const trivia = await res.json();
            const feed = document.getElementById('trivia-feed');

            if (trivia.length === 0) {
                feed.innerHTML = '<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><p>No trivia published yet. Write your first tip above!</p></div>';
                return;
            }

            feed.innerHTML = trivia.map(t => {
                const tagClass = (!t.crop_tag || t.crop_tag === 'General') ? 'general' : '';
                return `
                    <div class="trivia-item">
                        <button class="trivia-delete btn-delete-trivia" data-id="${t.trivia_id}" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                        <div class="trivia-content">${t.content}</div>
                        <div class="trivia-meta">
                            <span class="trivia-tag ${tagClass}">${t.crop_tag || 'General'}</span>
                            <span>${new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach event listeners dynamically to comply with strict CSP
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

    // Publish trivia
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
            const tbody = document.getElementById('weather-table-body');

            if (logs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#9A9790;padding:30px;">No weather logs found for this period.</td></tr>';
                return;
            }

            tbody.innerHTML = logs.map(l => {
                const rainfall = parseFloat(l.rainfall);
                const isAnomalous = rainfall > 100;
                return `
                    <tr class="${isAnomalous ? 'highlight-row' : ''}">
                        <td>${new Date(l.timestamp).toLocaleString()}</td>
                        <td>${parseFloat(l.temperature).toFixed(1)}</td>
                        <td>${parseFloat(l.humidity).toFixed(1)}</td>
                        <td>${parseFloat(l.wind_speed).toFixed(1)}</td>
                        <td style="${isAnomalous ? 'font-weight:600;color:#C0531A;' : ''}">${rainfall.toFixed(1)}${isAnomalous ? ' ⚠️' : ''}</td>
                        <td><span class="source-badge ${l.data_source.toLowerCase()}">${l.data_source}</span></td>
                    </tr>
                `;
            }).join('');
        } catch (err) {
            console.error('Load weather logs error:', err);
        }
    }

    // Date filter buttons
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
    // Audience selector
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

    async function loadAlerts() {
        // Also ensure crop selectors are populated
        if (allCrops.length === 0) {
            try {
                const res = await fetch('/api/crops');
                allCrops = await res.json();
                populateCropSelectors();
            } catch(e) {}
        }

        try {
            const res = await fetch('/api/admin/alerts');
            const alerts = await res.json();
            const historyEl = document.getElementById('alert-history');

            if (alerts.length === 0) {
                historyEl.innerHTML = '<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9A9790" stroke-width="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg><p>No advisories sent yet.</p></div>';
                return;
            }

            historyEl.innerHTML = alerts.map(a => `
                <div class="alert-history-item">
                    <div class="ahi-message">${a.message}</div>
                    <div class="ahi-meta">
                        <span>Sent: ${new Date(a.created_at).toLocaleString()}</span>
                        <span>Recipients: ${a.recipient_count || 'N/A'}</span>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.error('Load alerts error:', err);
        }
    }

    // Send alert
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

            try {
                const res = await fetch('/api/admin/alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    showToast(`Advisory successfully sent to ${data.recipientCount} farmer(s).`);
                    document.getElementById('alert-message').value = '';
                    loadAlerts();
                } else {
                    const err = await res.json();
                    showToast('Error: ' + (err.error || 'Failed to send'));
                }
            } catch (err) {
                showToast('Network error.');
            }
        });
    }

    // ==========================================
    // INITIAL NAVIGATION ROUTING (Run after all declarations)
    // ==========================================
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === 'admin') currentPath = 'dashboard';
    history.replaceState({ page: currentPath }, '', window.location.pathname);
    navigateTo(currentPath);

});
