
        const defaultState = {
            money: 10000,
            debt: 0,
            totalRealizedPnL: 0,
            tickCount: 0,
            history: [createCandle(10000)],
            properties: [
                { id: 'p1', name: 'Downtown Food Kiosk', type: 'Food', cost: 4500, income: 18, risk: 0.01, owned: 0, sharesSold: 0, totalShares: 100, icon: '🌭', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=60', history: [createCandle(4500)], blog: 'Gourmet street food concepts are scaling up quickly across metropolitan downtown areas.' },
                { id: 'p2', name: 'Express Courier Hub', type: 'Logistics', cost: 12000, income: 55, risk: 0.02, owned: 0, sharesSold: 0, totalShares: 200, icon: '📦', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60', history: [createCandle(12000)], blog: 'E-commerce logistics demand pushes overnight delivery hubs into high profitability.' },
                { id: 'p3', name: 'Suburban Cafe Chain', type: 'Food', cost: 28000, income: 130, risk: 0.03, owned: 0, sharesSold: 0, totalShares: 500, icon: '☕', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=60', history: [createCandle(28000)], blog: 'Specialty coffee franchises report record morning foot traffic and robust loyalty metrics.' },
                { id: 'p4', name: 'Indie App Studio', type: 'Tech', cost: 65000, income: 310, risk: 0.05, owned: 0, sharesSold: 0, totalShares: 1000, icon: '💻', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60', history: [createCandle(65000)], blog: 'Mobile subscription models yield sustainable MRR growth for independent software studios.' },
                { id: 'p5', name: 'Freight Logistics Yard', type: 'Logistics', cost: 140000, income: 680, risk: 0.04, owned: 0, sharesSold: 0, totalShares: 2000, icon: '🚛', image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=60', history: [createCandle(140000)], blog: 'Heavy freight terminals experience supply chain bottlenecks driving contract pricing higher.' },
                { id: 'p6', name: 'Commercial Plaza Floor', type: 'Real Estate', cost: 300000, income: 1500, risk: 0.02, owned: 0, sharesSold: 0, totalShares: 5000, icon: '🏢', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60', history: [createCandle(300000)], blog: 'Prime commercial office spaces maintain high tenancy rates amidst hybrid work trends.' },
                { id: 'p7', name: 'AI Solutions SaaS', type: 'Tech', cost: 750000, income: 3800, risk: 0.08, owned: 0, sharesSold: 0, totalShares: 10000, icon: '🤖', image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60', history: [createCandle(750000)], blog: 'Generative AI enterprise infrastructure integration surges as corporations modernize.' },
                { id: 'p8', name: 'Global Shipping Port', type: 'Logistics', cost: 1800000, income: 9200, risk: 0.06, owned: 0, sharesSold: 0, totalShares: 25000, icon: '🚢', image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&auto=format&fit=crop&q=60', history: [createCandle(1800000)], blog: 'Transoceanic container terminals process record cargo volumes ahead of peak season.' },
                { id: 'p9', name: 'Skyscraper Tower', type: 'Real Estate', cost: 4500000, income: 24000, risk: 0.03, owned: 0, sharesSold: 0, totalShares: 50000, icon: '🏙️', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60', history: [createCandle(4500000)], blog: 'Mixed-use mega towers redefine skyline valuations with luxury retail and penthouse yields.' },
                { id: 'p10', name: 'Quantum Cloud Facility', type: 'Tech', cost: 12000000, income: 65000, risk: 0.10, owned: 0, sharesSold: 0, totalShares: 150000, icon: '⚡', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=60', history: [createCandle(12000000)], blog: 'Next-generation quantum computing datacenters unlock unprecedented cryptographic processing.' }
            ],
            banks: [
                { id: 'b1', name: 'Metro Microcredit', max: 15000, ratePerMin: 0.005 },
                { id: 'b2', name: 'Apex Commercial Bank', max: 75000, ratePerMin: 0.0035 },
                { id: 'b3', name: 'Global Trust Reserve', max: 350000, ratePerMin: 0.002 }
            ],
            activeLoans: [],
            activeTimedTrades: []
        };

        function createCandle(val) {
            const spread = val * 0.09; 
            const open = val + (Math.random() - 0.5) * spread;
            const close = val + (Math.random() - 0.5) * spread;
            const high = Math.max(open, close) + Math.random() * spread * 0.9;
            const low = Math.min(open, close) - Math.random() * spread * 0.9;
            return { open, close, high, low, time: Date.now() };
        }

        let state = JSON.parse(JSON.stringify(defaultState));
        let activeModalAssetId = null;

        // ===== MT7 FUNDING API =====
        const MT7_API_BASE = window.MT7_API_BASE || '/api/mt7';
        let fundingMethods = { deposit: [], withdraw: [] };

        async function apiRequest(path, options = {}) {
            const res = await fetch(`${MT7_API_BASE}${path}`, {
                headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
                ...options
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || `API request failed (${res.status})`);
            return data;
        }

        function renderFundingMethods() {
            ['deposit','withdraw'].forEach(kind => {
                const el = document.getElementById(`${kind}-method`);
                if (!el) return;
                el.innerHTML = fundingMethods[kind].map(m =>
                    `<option value="${escapeHtml(m.id)}">${escapeHtml(m.name)}</option>`
                ).join('');
            });
        }

        function escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, ch => ({
                '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
            }[ch]));
        }

        function renderTransactions(kind, transactions = []) {
            const el = document.getElementById(`${kind}-transactions`);
            if (!el) return;
            el.innerHTML = transactions.length ? transactions.map(tx => `
                <div class="tx-row">
                    <span>${escapeHtml(tx.reference || tx.id || 'Transaction')}</span>
                    <span>${tx.type === 'deposit' ? '+' : '-'}$${Number(tx.amount || 0).toFixed(2)}</span>
                    <span class="tx-status ${escapeHtml(tx.status || 'pending')}">${escapeHtml(tx.status || 'pending')}</span>
                </div>`).join('') :
                `<div class="funding-note">No ${kind} transactions yet.</div>`;
        }

        async function loadFundingData() {
            try {
                const data = await apiRequest('/config');
                fundingMethods = data.methods || fundingMethods;
                renderFundingMethods();
                document.getElementById('deposit-api-status').textContent = data.message || 'Funding API connected.';
                document.getElementById('withdraw-api-status').textContent = data.message || 'Funding API connected.';
                await refreshFundingBalance();
            } catch (err) {
                document.getElementById('deposit-api-status').textContent = `Funding API unavailable: ${err.message}`;
                document.getElementById('withdraw-api-status').textContent = `Funding API unavailable: ${err.message}`;
            }
        }

        async function refreshFundingBalance() {
            try {
                const data = await apiRequest('/account');
                const balance = Number(data.balance || 0);
                document.getElementById('deposit-balance').textContent = `$${balance.toFixed(2)}`;
                document.getElementById('withdraw-balance').textContent = `$${balance.toFixed(2)}`;
                renderTransactions('deposit', (data.transactions || []).filter(x => x.type === 'deposit').slice(0, 20));
                renderTransactions('withdraw', (data.transactions || []).filter(x => x.type === 'withdraw').slice(0, 20));
            } catch (err) {
                document.getElementById('deposit-api-status').textContent = `Unable to load account: ${err.message}`;
                document.getElementById('withdraw-api-status').textContent = `Unable to load account: ${err.message}`;
            }
        }

        async function submitFunding(kind) {
            const errorEl = document.getElementById(`${kind}-error`);
            errorEl.textContent = '';
            const amount = Number(document.getElementById(`${kind}-amount`).value);
            const method = document.getElementById(`${kind}-method`).value;
            const reference = document.getElementById(kind === 'deposit' ? 'deposit-reference' : 'withdraw-destination').value.trim();

            if (!Number.isFinite(amount) || amount <= 0) {
                errorEl.textContent = 'Enter a valid amount.';
                return;
            }
            try {
                const data = await apiRequest(`/${kind}`, {
                    method: 'POST',
                    body: JSON.stringify({ amount, method, reference })
                });
                errorEl.style.color = 'var(--primary)';
                errorEl.textContent = data.message || `${kind} request submitted.`;
                document.getElementById(`${kind}-amount`).value = '';
                await refreshFundingBalance();
            } catch (err) {
                errorEl.style.color = 'var(--danger)';
                errorEl.textContent = err.message;
            }
        }



        const chartViews = {
            dashboard: { zoom: 1, pan: 0 },
            modal: { zoom: 1, pan: 0 }
        };

        function loadGame() {
            const saved = localStorage.getItem('mt7_enterprise_save');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    state.money = parsed.money ?? state.money;
                    state.debt = parsed.debt ?? state.debt;
                    state.totalRealizedPnL = parsed.totalRealizedPnL ?? state.totalRealizedPnL;
                    state.tickCount = parsed.tickCount ?? state.tickCount;
                    state.history = parsed.history ?? state.history;
                    state.activeLoans = parsed.activeLoans ?? state.activeLoans;
                    state.activeTimedTrades = parsed.activeTimedTrades ?? state.activeTimedTrades;
                    if (parsed.properties) {
                        parsed.properties.forEach(sp => {
                            const p = state.properties.find(x => x.id === sp.id);
                            if (p) {
                                p.owned = sp.owned;
                                p.sharesSold = sp.sharesSold;
                                p.cost = sp.cost;
                                if (sp.history) p.history = sp.history;
                            }
                        });
                    }
                } catch(e) {
                    console.error("Failed to load save", e);
                }
            }
        }

        function saveGame() {
            localStorage.setItem('mt7_enterprise_save', JSON.stringify({
                money: state.money,
                debt: state.debt,
                totalRealizedPnL: state.totalRealizedPnL,
                tickCount: state.tickCount,
                history: state.history,
                activeLoans: state.activeLoans,
                activeTimedTrades: state.activeTimedTrades,
                properties: state.properties.map(p => ({ id: p.id, owned: p.owned, sharesSold: p.sharesSold, cost: p.cost, history: p.history }))
            }));
        }

        function resetSave() {
            if (confirm("Are you sure you want to reset your entire MT7 account?")) {
                localStorage.removeItem('mt7_enterprise_save');
                state = JSON.parse(JSON.stringify(defaultState));
                updateAll();
                log("MT7 account reset to initial state.", "expense");
            }
        }

        const elMoney = document.getElementById('stat-money');
        const elIncome = document.getElementById('stat-income');
        const elDebt = document.getElementById('stat-debt');
        const elPnL = document.getElementById('stat-pnl');
        const logBox = document.getElementById('log-box');

        function formatNum(n) {
            if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
            if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
            if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
            return Math.floor(n).toLocaleString();
        }

        function switchView(viewName, event) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(`${viewName}-view`).classList.add('active');
            if (event && event.target) {
                event.target.classList.add('active');
            }
            if(viewName === 'dashboard') renderChart('dashboard', state.history, 'dash-max', 'dash-mid', 'dash-min', 'dashboard-candles', 'dash-wrap', 'dash-tooltip');
        }

        function log(msg, type = 'info') {
            const div = document.createElement('div');
            div.className = `log-entry ${type}`;
            div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logBox.prepend(div);
            if (logBox.children.length > 40) logBox.lastChild.remove();
        }

        function renderBlog() {
            const container = document.getElementById('blog-container');
            container.innerHTML = state.properties.map(p => `
                <div class="blog-card">
                    <img src="${p.image}" class="blog-img" alt="${p.name}" />
                    <div class="blog-content">
                        <div class="card-header">
                            <span class="blog-title">${p.icon} ${p.name}</span>
                            <span class="card-badge">${p.type}</span>
                        </div>
                        <div class="blog-snippet">${p.blog}</div>
                        <div class="card-metrics" style="margin-top: 0.3rem;">
                            <div>Valuation: <span class="metric-val">$${formatNum(p.cost)}</span></div>
                            <div>Yield: <span class="metric-val">+$${formatNum(p.income)}/s</span></div>
                            <div>Owned: <span class="metric-val">${p.owned}</span></div>
                        </div>
                        <button class="btn secondary" style="margin-top:0.3rem;" onclick="openAssetModal('${p.id}')">View Chart & Trade</button>
                    </div>
                </div>
            `).join('');
        }

        function openAssetModal(id) {
            activeModalAssetId = id;
            const p = state.properties.find(x => x.id === id);
            document.getElementById('modal-asset-name').textContent = `${p.icon} ${p.name}`;
            document.getElementById('modal-asset-desc').textContent = p.blog;
            document.getElementById('modal-asset-price').textContent = `$${formatNum(p.cost)}`;
            document.getElementById('modal-asset-owned').textContent = p.owned;
            document.getElementById('modal-asset-yield').textContent = `+$${formatNum(p.income)}/s`;
            document.getElementById('asset-modal').classList.add('active');
            renderChart('modal', p.history, 'modal-max', 'modal-mid', 'modal-min', 'modal-candles', 'modal-wrap', 'modal-tooltip');
            renderActiveTimedTrades();
        }

        function closeModal() {
            document.getElementById('asset-modal').classList.remove('active');
            activeModalAssetId = null;
            document.getElementById('graph-popup').style.display = 'none';
        }

        function zoomChart(key, factor) {
            chartViews[key].zoom = Math.max(0.5, Math.min(5, chartViews[key].zoom * factor));
            refreshActiveCharts(key);
        }

        function resetZoom(key) {
            chartViews[key].zoom = 1;
            chartViews[key].pan = 0;
            refreshActiveCharts(key);
        }

        function refreshActiveCharts(key) {
            if (key === 'dashboard') {
                renderChart('dashboard', state.history, 'dash-max', 'dash-mid', 'dash-min', 'dashboard-candles', 'dash-wrap', 'dash-tooltip');
            } else if (activeModalAssetId) {
                const p = state.properties.find(x => x.id === activeModalAssetId);
                renderChart('modal', p.history, 'modal-max', 'modal-mid', 'modal-min', 'modal-candles', 'modal-wrap', 'modal-tooltip');
            }
        }

        function renderChart(key, data, maxId, midId, minId, svgGroupId, wrapId, tooltipId) {
            const maxEl = document.getElementById(maxId);
            const midEl = document.getElementById(midId);
            const minEl = document.getElementById(minId);
            const group = document.getElementById(svgGroupId);
            const wrap = document.getElementById(wrapId);
            const tooltip = document.getElementById(tooltipId);
            if (!group || !wrap || !Array.isArray(data) || !data.length) return;

            const view = chartViews[key];
            const visibleCount = Math.min(data.length, Math.max(8, Math.floor(55 / view.zoom)));
            const maxStart = Math.max(0, data.length - visibleCount);
            const startIndex = Math.max(0, Math.min(maxStart, Math.round(view.pan)));
            const slice = data.slice(startIndex, startIndex + visibleCount);

            const highs = slice.map(d => Number(d.high) || 0);
            const lows = slice.map(d => Number(d.low) || 0);
            const maxVal = Math.max(...highs, 1);
            const minVal = Math.min(...lows, 0);
            const range = Math.max(maxVal - minVal, 1);

            maxEl.textContent = formatNum(maxVal);
            midEl.textContent = formatNum((maxVal + minVal) / 2);
            minEl.textContent = formatNum(minVal);

            const W = 500, H = 300, padY = 25;
            const colWidth = W / Math.max(slice.length, 1);
            group.replaceChildren();

            const y = value => H - padY - ((value - minVal) / range) * (H - padY * 2);
            slice.forEach((d, idx) => {
                const x = idx * colWidth + colWidth / 2;
                const isGreen = d.close >= d.open;
                const color = isGreen ? '#10b981' : '#f43f5e';

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x); line.setAttribute('y1', y(d.high));
                line.setAttribute('x2', x); line.setAttribute('y2', y(d.low));
                line.setAttribute('stroke', color); line.setAttribute('stroke-width', '2');

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x - Math.max(2, colWidth * .32));
                rect.setAttribute('y', Math.min(y(d.open), y(d.close)));
                rect.setAttribute('width', Math.max(2, colWidth * .64));
                rect.setAttribute('height', Math.max(Math.abs(y(d.open)-y(d.close)), 3));
                rect.setAttribute('fill', color); rect.setAttribute('rx', '1.5');

                g.append(line, rect);
                g.onmouseenter = () => {
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `${d.time ? new Date(d.time).toLocaleTimeString() : ''}<br>O: $${formatNum(d.open)} | C: $${formatNum(d.close)}<br>H: $${formatNum(d.high)} | L: $${formatNum(d.low)}`;
                };
                g.onmouseleave = () => tooltip.style.display = 'none';
                group.appendChild(g);
            });

            // Single pointer handler per chart, rather than replacing window handlers on every redraw.
            if (!wrap._chartHandlersAttached) {
                wrap._chartHandlersAttached = true;
                let dragging = false, lastX = 0;
                const pointerMove = e => {
                    if (!dragging) return;
                    const dx = e.clientX - lastX;
                    lastX = e.clientX;
                    const currentData = key === 'dashboard' ? state.history :
                        (activeModalAssetId ? state.properties.find(p => p.id === activeModalAssetId)?.history : []);
                    const count = Math.min(currentData.length, Math.max(8, Math.floor(55 / chartViews[key].zoom)));
                    chartViews[key].pan = Math.max(0, Math.min(Math.max(0, currentData.length-count),
                        chartViews[key].pan - (dx / Math.max(wrap.clientWidth,1)) * count));
                    refreshActiveCharts(key);
                };
                wrap.addEventListener('pointerdown', e => { dragging=true; lastX=e.clientX; wrap.setPointerCapture?.(e.pointerId); });
                wrap.addEventListener('pointermove', pointerMove);
                wrap.addEventListener('pointerup', () => dragging=false);
                wrap.addEventListener('pointercancel', () => dragging=false);
                wrap.addEventListener('wheel', e => {
                    if (!e.ctrlKey) return;
                    e.preventDefault();
                    zoomChart(key, e.deltaY < 0 ? 1.15 : 0.87);
                }, {passive:false});
            }
        }

        function executeTimedTrade(type) {
            if (!activeModalAssetId) return;
            const p = state.properties.find(x => x.id === activeModalAssetId);
            const invAmt = Math.max(10, parseFloat(document.getElementById('trade-inv-amt').value) || 1000);
            const duration = Math.max(3, Math.min(120, parseInt(document.getElementById('trade-time-sec').value) || 10));

            if (state.money < invAmt) {
                log("Insufficient capital for this trade investment.", "expense");
                return;
            }

            state.money -= invAmt;
            const startPrice = p.cost;
            const trade = {
                id: 't_' + Math.random().toString(36).substring(2, 9),
                assetId: p.id, assetName: p.name, type, investment: invAmt,
                startPrice, duration, remainingTime: duration,
                openedAt: Date.now()
            };
            state.activeTimedTrades.push(trade);
            log(`Placed ${type} trade on ${p.name}: $${formatNum(invAmt)} for ${duration}s`, 'market');
            showGraphPopup(type, invAmt, startPrice);
            updateAll();
        }

        function settleTrade(trade, p) {
            const endPrice = p ? p.cost : trade.startPrice;
            const direction = endPrice - trade.startPrice;
            const won = trade.type === 'BUY' ? direction > 0 : direction < 0;
            const magnitude = Math.min(0.95, Math.max(0.05, Math.abs(direction) / Math.max(trade.startPrice,1)));
            const payoutRate = won ? Math.min(0.95, 0.15 + magnitude * 4) : Math.min(1, 0.15 + magnitude * 4);
            const pnl = Math.max(1, Math.floor(trade.investment * payoutRate));

            if (won) {
                const payout = trade.investment + pnl;
                state.money += payout;
                state.totalRealizedPnL += pnl;
                log(`Trade Win (${trade.assetName}): ${trade.type} matched price direction. Profit: +$${formatNum(pnl)}`, 'income');
            } else {
                const loss = Math.min(trade.investment, pnl);
                const refund = trade.investment - loss;
                state.money += refund;
                state.totalRealizedPnL -= loss;
                log(`Trade Loss (${trade.assetName}): ${trade.type} moved against the position. Loss: -$${formatNum(loss)}`, 'expense');
            }

            // Add an explicit settlement candle so the graph visibly records the result.
            if (p) {
                const last = p.history[p.history.length - 1] || createCandle(endPrice);
                const settlementOpen = trade.startPrice;
                const settlementClose = endPrice;
                p.history.push({
                    open: settlementOpen,
                    close: settlementClose,
                    high: Math.max(settlementOpen, settlementClose, last.high),
                    low: Math.min(settlementOpen, settlementClose, last.low),
                    time: Date.now(),
                    tradeId: trade.id,
                    tradeOutcome: won ? 'win' : 'loss'
                });
                if (p.history.length > 150) p.history.shift();
            }

            state.history.push({
                ...createCandle(state.money),
                tradeId: trade.id,
                tradeOutcome: won ? 'win' : 'loss'
            });
            if (state.history.length > 150) state.history.shift();

            if (activeModalAssetId === trade.assetId) {
                showGraphPopup(won ? 'WIN' : 'LOSS', won ? pnl : -Math.min(trade.investment,pnl), endPrice);
            }
        }


        function renderActiveTimedTrades() {
            const container = document.getElementById('active-trades-container');
            if (!activeModalAssetId) {
                container.innerHTML = '';
                return;
            }
            const assetTrades = state.activeTimedTrades.filter(t => t.assetId === activeModalAssetId);
            if (assetTrades.length === 0) {
                container.innerHTML = `<div style="font-size:0.65rem; color:var(--text-dim); text-align:center;">No active fixed-time trades for this asset.</div>`;
                return;
            }

            container.innerHTML = assetTrades.map(t => `
                <div class="active-trade-pill">
                    <span>${t.type === 'BUY' ? '📈 Bullish' : '📉 Bearish'} ($${formatNum(t.investment)})</span>
                    <span>⏱️ ${t.remainingTime}s remaining</span>
                </div>
            `).join('');
        }

        function processTimedTradesTick() {
            let changed = false;
            for (let i = state.activeTimedTrades.length - 1; i >= 0; i--) {
                const t = state.activeTimedTrades[i];
                t.remainingTime--;
                if (t.remainingTime <= 0) {
                    const p = state.properties.find(x => x.id === t.assetId);
                    settleTrade(t, p);
                    state.activeTimedTrades.splice(i, 1);
                    changed = true;
                }
            }
            if (activeModalAssetId) renderActiveTimedTrades();
            return changed;
        }

        function renderMarket() {
            const grid = document.getElementById('market-grid');
            grid.innerHTML = state.properties.map(p => `
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">${p.icon} ${p.name}</span>
                        <span class="card-badge">${p.type}</span>
                    </div>
                    <div class="card-desc">Stable asset generating consistent corporate returns. Risk: ${(p.risk*100).toFixed(0)}%</div>
                    <div class="card-metrics">
                        <div>Cost: <span class="metric-val">$${formatNum(p.cost)}</span></div>
                        <div>Yield: <span class="metric-val">+$${formatNum(p.income)}/s</span></div>
                        <div>Owned: <span class="metric-val">${p.owned}</span></div>
                    </div>
                    <div class="card-actions">
                        <button class="btn secondary" onclick="openAssetModal('${p.id}')">Chart & Trade</button>
                        <button class="btn" onclick="buyProperty('${p.id}')" ${state.money < p.cost ? 'disabled' : ''}>Buy ($${formatNum(p.cost)})</button>
                    </div>
                </div>
            `).join('');
        }

        function buyProperty(id) {
            const p = state.properties.find(x => x.id === id);
            if (state.money >= p.cost) {
                state.money -= p.cost;
                p.owned++;
                p.cost = Math.floor(p.cost * 1.18);
                log(`Acquired enterprise: ${p.name}`, 'market');
                updateAll();
            }
        }

        function renderPortfolio() {
            const grid = document.getElementById('portfolio-grid');
            const ownedProps = state.properties.filter(p => p.owned > 0);

            if (ownedProps.length === 0) {
                grid.innerHTML = `<div class="card"><div class="card-desc" style="text-align:center; padding: 1rem;">No corporate assets owned. Visit the market or MT7 feed to buy businesses.</div></div>`;
                return;
            }

            grid.innerHTML = ownedProps.map(p => {
                const sharePrice = Math.floor(p.cost / p.totalShares);
                const availableShares = p.totalShares - p.sharesSold;
                return `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">${p.icon} ${p.name} (x${p.owned})</span>
                            <span class="card-badge">Shares: ${p.sharesSold}/${p.totalShares}</span>
                        </div>
                        <div class="card-metrics">
                            <div>Revenue: <span class="metric-val">+$${formatNum(p.income * p.owned)}/s</span></div>
                            <div>Share Val: <span class="metric-val">$${formatNum(sharePrice)}</span></div>
                            <div>Liquidation: <span class="metric-val">$${formatNum(p.cost * 0.8 * p.owned)}</span></div>
                        </div>
                        <div class="card-actions">
                            <button class="btn secondary" onclick="issueShare('${p.id}')" ${availableShares <= 0 ? 'disabled' : ''}>Issue Share</button>
                            <button class="btn danger" onclick="sellBusiness('${p.id}')">Liquidate</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function issueShare(id) {
            const p = state.properties.find(x => x.id === id);
            if (p.sharesSold < p.totalShares) {
                const val = Math.floor(p.cost / p.totalShares);
                state.money += val;
                p.sharesSold++;
                log(`Issued equity share for ${p.name} yielding +$${val}. Shares issued: ${p.sharesSold}/${p.totalShares}`, 'market');
                updateAll();
            }
        }

        function sellBusiness(id) {
            const p = state.properties.find(x => x.id === id);
            if (p.owned > 0) {
                const value = Math.floor(p.cost * 0.8);
                state.money += value;
                p.owned--;
                log(`Liquidated 1x ${p.name} for $${formatNum(value)}`, 'expense');
                updateAll();
            }
        }

        function renderBanks() {
            const grid = document.getElementById('bank-grid');
            grid.innerHTML = state.banks.map(b => {
                const currentLoan = state.activeLoans.find(l => l.bankId === b.id);
                const loanAmt = currentLoan ? currentLoan.amt : 0;
                return `
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">🏦 ${b.name}</span>
                            <span class="card-badge">${(b.ratePerMin*100).toFixed(2)}% /min interest</span>
                        </div>
                        <div class="card-metrics">
                            <div>Credit Limit: <span class="metric-val">$${formatNum(b.max)}</span></div>
                            <div>Active Debt: <span class="metric-val">$${formatNum(loanAmt)}</span></div>
                        </div>
                        <div class="card-actions">
                            <button class="btn" onclick="takeLoan('${b.id}', ${b.max * 0.5})" ${loanAmt > 0 ? 'disabled' : ''}>Borrow $${formatNum(b.max * 0.5)}</button>
                            <button class="btn danger" onclick="repayLoan('${b.id}')" ${loanAmt <= 0 ? 'disabled' : ''}>Repay Loan</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function takeLoan(bankId, amt) {
            const bank = state.banks.find(b => b.id === bankId);
            state.money += amt;
            state.debt += amt;
            state.activeLoans.push({ bankId, amt, ratePerMin: bank.ratePerMin });
            log(`Secured loan of $${formatNum(amt)} from ${bank.name}`, 'expense');
            updateAll();
        }

        function repayLoan(bankId) {
            const loanIndex = state.activeLoans.findIndex(l => l.bankId === bankId);
            if (loanIndex !== -1) {
                const loan = state.activeLoans[loanIndex];
                if (state.money >= loan.amt) {
                    state.money -= loan.amt;
                    state.debt -= loan.amt;
                    state.activeLoans.splice(loanIndex, 1);
                    log(`Fully repaid loan of $${formatNum(loan.amt)}`, 'income');
                    updateAll();
                } else {
                    log(`Insufficient capital to repay loan`, 'expense');
                }
            }
        }

        function getTotalIncome() {
            let total = 0;
            state.properties.forEach(p => {
                total += p.income * p.owned;
            });
            return total;
        }

        function updateAll() {
            elMoney.textContent = `$${formatNum(state.money)}`;
            elDebt.textContent = `$${formatNum(state.debt)}`;
            elIncome.textContent = `+$${formatNum(getTotalIncome())}`;
            
            elPnL.textContent = (state.totalRealizedPnL >= 0 ? '+' : '') + `$${formatNum(state.totalRealizedPnL)}`;
            elPnL.className = `stat-value ${state.totalRealizedPnL > 0 ? 'profit' : (state.totalRealizedPnL < 0 ? 'loss' : '')}`;

            renderBlog();
            renderMarket();
            renderPortfolio();
            renderBanks();

            if (document.getElementById('dashboard-view').classList.contains('active')) {
                renderChart('dashboard', state.history, 'dash-max', 'dash-mid', 'dash-min', 'dashboard-candles', 'dash-wrap', 'dash-tooltip');
            }
            if (activeModalAssetId) {
                const p = state.properties.find(x => x.id === activeModalAssetId);
                if(p) renderChart('modal', p.history, 'modal-max', 'modal-mid', 'modal-min', 'modal-candles', 'modal-wrap', 'modal-tooltip');
            }
            saveGame();
        }

        setInterval(() => {
            state.tickCount++;
            const income = getTotalIncome();
            state.money += income;

            processTimedTradesTick();

            state.history.push(createCandle(state.money));
            if (state.history.length > 100) state.history.shift();

            state.properties.forEach(p => {
                const change = (Math.random() - 0.48) * 0.05 * p.cost;
                p.cost = Math.max(Math.floor(p.cost * 0.2), Math.floor(p.cost + change));
                p.history.push(createCandle(p.cost));
                if (p.history.length > 100) p.history.shift();
            });

            if (state.tickCount % 60 === 0) {
                let totalInterest = 0;
                state.activeLoans.forEach(loan => {
                    const interest = loan.amt * loan.ratePerMin;
                    totalInterest += interest;
                    loan.amt += interest;
                });
                if (totalInterest > 0) {
                    state.debt += totalInterest;
                    log(`Monthly interest applied: -$${formatNum(totalInterest)}`, 'expense');
                }
            }

            if (income > 0) log(`Revenue collected: +$${formatNum(income)}`, 'income');

            updateAll();
        }, 1000);

        loadGame();
        updateAll();
        loadFundingData();
        setInterval(refreshFundingBalance, 15000);
    