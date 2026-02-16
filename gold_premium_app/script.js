/**
 * 실시간 금 가격 + Manana 실시간 환율 반영 스크립트
 */

const nf0 = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let apiData = {
    latest: null,
    xauPrice: 0,
    realTimeUsdKrw: 0
};

// Premium Chart
let fullChartData = null;
let premiumChart = null;

function renderPremiumChart(rows) {
    if (!premiumChart) {
        premiumChart = echarts.init(document.getElementById('premium-chart'));
    }

    // 데이터 추출 (인덱스 0: 날짜, 4: 실제 괴리율, 6: 1년 평균 괴리율)
    const dates = rows.map(r => r[0]);
    const preValues = rows.map(r => parseFloat(r[4]));
    const pre1yValues = rows.map(r => parseFloat(r[6]));

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }, // 막대 그래프에 적합한 포인터
            formatter: function(params) {
                let res = `${params[0].name}<br/>`;
                params.forEach(item => {
                    res += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${item.color};"></span>`;
                    res += `${item.seriesName}: <b>${item.value}%</b><br/>`;
                });
                return res;
            }
        },
        legend: { 
            data: ['실제 괴리율', '평균 기준선(1y)'], 
            bottom: 0,
            textStyle: { fontSize: 11 }
        },
        grid: { left: '3%', right: '4%', top: '10%', bottom: '15%', containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { fontSize: 10, color: '#94a3b8' },
            axisLine: { lineStyle: { color: '#e2e8f0' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { formatter: '{value}%', fontSize: 10 },
            splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }
        },
        // 색상 분기 처리 (0 기준 초록/빨강)
        visualMap: {
            show: false,
            dimension: 1, // y축 값을 기준으로 색상 결정
            pieces: [
                { gt: 0, color: '#22c55e' }, // 양수 괴리: 초록
                { lte: 0, color: '#ef4444' } // 음수 괴리: 빨강
            ],
            seriesIndex: 0 // 첫 번째 시리즈(막대)에만 적용
        },
        series: [
            {
                name: '실제 괴리율',
                type: 'bar', // 막대 그래프로 복구
                data: preValues,
                barMaxWidth: 15,
                z: 2
            },
            {
                name: '평균 기준선(1y)',
                type: 'line', // 기준선은 선형으로 유지
                data: pre1yValues,
                showSymbol: false,
                smooth: true,
                lineStyle: { 
                    width: 2, 
                    type: 'solid', 
                    color: '#f59e0b' // 평균선은 황금색(오렌지)
                },
                z: 3 // 막대보다 위에 표시
            }
        ]
    };

    premiumChart.setOption(option);
}

function changeChartPeriod(period) {
    if (!fullChartData) return;

    const rows = fullChartData.weekly.rows;
    let filteredRows = [];
    const now = new Date();

    if (period === '2y') {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(now.getFullYear() - 2);
        filteredRows = rows.filter(r => new Date(r[0]) >= twoYearsAgo);
    } else if (period === '10y') {
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(now.getFullYear() - 10);
        filteredRows = rows.filter(r => new Date(r[0]) >= tenYearsAgo);
    } else {
        filteredRows = rows; // 전체
    }

    renderPremiumChart(filteredRows);
}

// 1. 차트 초기화 함수
function initPremiumChart() {
    premiumChart = echarts.init(document.getElementById('premium-chart'));
    window.addEventListener('resize', () => premiumChart.resize());
}

function initTradingViewWidget() {
    new TradingView.widget({
        "autosize": true,
        "symbol": "FX_IDC:USDKRW", // 원화/달러 환율 심볼
        "interval": "D",           // 일봉 기준 (1, 5, 15, 60, D, W 등 설정 가능)
        "timezone": "Asia/Seoul",
        "theme": "light",
        "style": "1",              // 1번 스타일: 캔들스틱
        "locale": "kr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": false, // 상단 도구 모음 표시 (이동평균선 추가 가능)
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_usdkrw",
        "studies": [
            {
                "id": "MASimple@tv-basicstudies",
                "inputs": { "length": 120 } // 120일선 (경기선)
            },
            {
                "id": "MASimple@tv-basicstudies",
                "inputs": { "length": 250 } // 250일선
            },
            {"id": "BB@tv-basicstudies"},
            {"id": "RSI@tv-basicstudies"}
        ]
    });

    new TradingView.widget({
        "autosize": true,
        "symbol": "OANDA:XAUUSD",
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "light",
        "style": "1",
        "locale": "kr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_xauusd",
        "studies": [
            { "id": "MASimple@tv-basicstudies", "inputs": { "length": 60 } },
            { "id": "MASimple@tv-basicstudies", "inputs": { "length": 120 } },
            { "id": "MASimple@tv-basicstudies", "inputs": { "length": 250 } },
            {"id": "BB@tv-basicstudies"},
            {"id": "RSI@tv-basicstudies"}
        ]
    });
}

function getLongTermAverages() {
    if (!fullChartData || !fullChartData.weekly) return [0, 0];

    const rows = fullChartData.recent_daily.rows;
    // 인덱스 3이 환율(fx) 종가
    // 인덱스 2이 XAU 종가
    const recentRows = rows.slice(-250); 
    const fx_sum = recentRows.reduce((acc, row) => acc + parseFloat(row[3]), 0);
    const xau_sum = recentRows.reduce((acc, row) => acc + parseFloat(row[2]), 0);
    
    return [fx_sum / recentRows.length, xau_sum / recentRows.length];
}

function evaluateValue(currentFx, currentXau, currentKimp) {
    const [fxAvg, xauAvg] = getLongTermAverages();
    if (fxAvg <= 0 || xauAvg <= 0) return;
    const fxStatusEl = document.getElementById('fx-value-status');
    const fxStatusText = document.getElementById('fx-status-text');
    const fxDiffBadge = document.getElementById('fx-diff-badge');
    const fxAvgVal = document.getElementById('fx-avg-val');
    const kimpStatusEl = document.getElementById('kimp-status');
    const xauStatusEl = document.getElementById('xau-value-status');
    const xauStatusText = document.getElementById('xau-status-text');
    const xauDiffBadge = document.getElementById('xau-diff-badge');
    const xauAvgVal = document.getElementById('xau-avg-val');

    // 환율 판단 (평균 대비 편차 계산)
    const fxDiffPct = ((currentFx - fxAvg) / fxAvg) * 100;
    
    fxStatusEl.style.display = 'block';
    fxAvgVal.textContent = `${nf2.format(fxAvg)}원`; // 평균값 표시
    // 평균보다 2% 이상 낮으면 매수 유리, 5% 이상 높으면 주의
    if (fxDiffPct < -2) {
        fxStatusText.textContent = "환율 저평가";
        fxStatusEl.className = "mt-2 rounded p-2 bg-success text-white"; // bg-good 대응
        fxDiffBadge.className = "badge rounded-pill bg-white text-success";
    } else if (fxDiffPct > 5) {
        fxStatusText.textContent = "환율 고평가";
        fxStatusEl.className = "mt-2 rounded p-2 bg-danger text-white"; // bg-danger 대응
        fxDiffBadge.className = "badge rounded-pill bg-white text-danger";
    } else {
        fxStatusText.textContent = "환율 적정 수준";
        fxStatusEl.className = "mt-2 rounded p-2 bg-secondary text-white"; // bg-normal 대응
        fxDiffBadge.className = "badge rounded-pill bg-white text-secondary";
    }
    fxDiffBadge.textContent = `${fxDiffPct > 0 ? '+' : ''}${fxDiffPct.toFixed(1)}%`;

    // 국제 금 가격 판단 (평균 대비 편차 계산)
    const xauDiffPct = ((currentXau - xauAvg) / xauAvg) * 100;
    
    xauStatusEl.style.display = 'block';
    xauAvgVal.textContent = `${nf2.format(xauAvg)} 달러`; // 평균값 표시
    // 평균보다 2% 이상 낮으면 매수 유리, 5% 이상 높으면 주의
    if (xauDiffPct < -2) {
        xauStatusText.textContent = "금값 저평가";
        xauStatusEl.className = "mt-2 rounded p-2 bg-success text-white"; // bg-good 대응
        xauDiffBadge.className = "badge rounded-pill bg-white text-success";
    } else if (xauDiffPct > 5) {
        xauStatusText.textContent = "금값 고평가";
        xauStatusEl.className = "mt-2 rounded p-2 bg-danger text-white"; // bg-danger 대응
        xauDiffBadge.className = "badge rounded-pill bg-white text-danger";
    } else {
        xauStatusText.textContent = "금값 적정 수준";
        xauStatusEl.className = "mt-2 rounded p-2 bg-secondary text-white"; // bg-normal 대응
        xauDiffBadge.className = "badge rounded-pill bg-white text-secondary";
    }
    xauDiffBadge.textContent = `${xauDiffPct > 0 ? '+' : ''}${xauDiffPct.toFixed(1)}%`;

    // 괴리율 판단 (장기 평균 0.5% 기준)
    const KIMP_TARGET = 0.5;
    const kimpDiff = currentKimp - KIMP_TARGET;

    if (currentKimp < 0) {
        kimpStatusEl.textContent = "역프리미엄";
        kimpStatusEl.className = "status-badge bg-good";
    } else if (currentKimp <= KIMP_TARGET) {
        kimpStatusEl.textContent = "적정 괴리율";
        kimpStatusEl.className = "status-badge bg-normal";
    } else {
        kimpStatusEl.textContent = `평균대비 고평가 (+${kimpDiff.toFixed(2)}%)`;
        kimpStatusEl.className = "status-badge bg-caution";
    }
}

// 2. 괴리율 시리즈 데이터 가져오기 및 차트 업데이트
async function updatePremiumChart() {
//    const SERIES_URL = 'https://goldkimp.com/wp-content/uploads/json/gold_premium_series.json';
    const SERIES_URL = 'json/gold_premium_series.json';
    
    try {
        const response = await fetch(SERIES_URL, { cache: 'no-store' });
        fullChartData = await response.json();

        // 초기 로딩 시 '2년' 기준으로 표시
        changeChartPeriod('2y');
        
    } catch (error) {
        console.error("차트 데이터 로드 실패:", error);
    }
}

// 윈도우 리사이즈 대응
window.addEventListener('resize', () => {
    if (premiumChart) premiumChart.resize();
});

async function fetchRealTimeFxFinancialData() {
    try {
        const fxUrl = 'https://api.manana.kr/exchange/rate/KRW/USD.json';
        const fxRes = await fetch(fxUrl, { cache: 'no-store' });
        const fxData = await fxRes.json();
        // 환율 파싱
        if (fxData && fxData.length > 0) {
            apiData.realTimeUsdKrw = parseFloat(fxData[0].rate);
        }
    } catch (e) {
        console.error("데이터 로드 실패 (Manana):", e);
    }
}

function XauCallback(goldData) {
    // 국제 금값 파싱
    // 응답 예시: { "items": [ { "curr": "USD", "xauPrice": 2345.50, ... } ] }
    if (goldData.items && goldData.items.length > 0) {
        const spotPrice = goldData.items[0].xauPrice;
        apiData.xauPrice = parseFloat(spotPrice);
        console.log(`국제 금 스팟 시세 갱신: $${apiData.xauPrice}`);
    }
}

async function fetchRealTimeXauFinancialData() {
    try {
        // 국제 금 스팟 시세 (GoldPrice.org의 숨겨진 JSON 엔드포인트)
        const goldUrl = 'https://data-asg.goldprice.org/dbXRates/USD';
        const goldUrlProxy = 'https://corsproxy.io/?' + encodeURIComponent(goldUrl) + '?callback=XauCallback';
        $.ajax({
            url: goldUrlProxy,
            dataType: 'jsonp',
        });
    } catch (e) {
        console.error("데이터 로드 실패 (GoldPrice.org):", e);
    }
}

/**
 * 2. 프리미엄(괴리율) 실시간 재계산 및 UI 업데이트
 */
function renderUI() {
    const L = apiData.latest;
    if (!L) return;

    const unit = document.querySelector('input[name="unit"]:checked').value;
    const scale = (unit === 'don') ? 3.75 : 1;
    const ozToG = 31.1034768;
    const unitText = (unit === 'don') ? '한 돈' : '1g'; 

    // 1. 환율 결정 (Manana 실시간 또는 기본값)
    const currentFx = apiData.realTimeUsdKrw || L.usdkrw;
    const currentXau = apiData.xauPrice || L.xauusd_oz;
    // 2. 국제 시세 계산 (1g 기준)
    const intlPriceG_Usd = currentXau / ozToG; // 1g 당 USD
    const realTimeIntlKrw = intlPriceG_Usd * currentFx; // 1g 당 KRW

    // --- 국내 금시세 & 환율 업데이트 (기존 코드와 동일) ---
    document.getElementById('val-krx').textContent = nf0.format(Math.round(L.krxkrw * scale));
    document.getElementById('val-fx').textContent = nf2.format(currentFx);

    // --- 국제 금시세 상세 업데이트 ---
    // (A) 1g 당 KRW 표시 (단위 선택에 따라 '돈'으로 환산 가능)
    document.getElementById('val-intl-krw').textContent = nf0.format(Math.round(realTimeIntlKrw * scale));
    
    // (B) 1g 당 USD 표시 (달러는 보통 g 단위로만 보므로 scale 제외하거나 필요시 적용)
    document.getElementById('val-intl-usd').textContent = `$${usd2.format(intlPriceG_Usd * scale)}`;
    
    // (C) 참고용 온스($/oz) 정보
    document.getElementById('usd-oz-info').textContent = `${usd2.format(currentXau)} $/oz`;

    // 델타 및 프리미엄 재계산
    renderDelta('delta-krx', L.delta?.krxkrw, 'krx', scale);
    renderDelta('delta-intl', L.delta?.intl_g, 'intl', scale);
    renderDelta('delta-fx', L.delta?.usdkrw, 'fx', 1);

    const currentKrxPrice = L.krxkrw * scale;
    const currentIntlKrwPrice = realTimeIntlKrw * scale;
    const priceDiff = currentKrxPrice - currentIntlKrwPrice;
    const realTimeKimpPct = (priceDiff / currentIntlKrwPrice) * 100;
    
    // 퍼센트 업데이트
    const kv = document.getElementById('kimp-val');
    kv.textContent = nf2.format(realTimeKimpPct) + '%';
   
    // 금액 업데이트
    const kd = document.getElementById('kimp-price-diff');
    const sign = priceDiff > 0 ? '+' : '';
    kd.textContent = `${unitText}당 ${sign}${nf0.format(Math.round(priceDiff))}원`;
    
    // 색상 적용 (양수면 빨강/주의, 음수면 초록/기회)
    const statusClass = priceDiff > 0 ? 'up' : priceDiff < 0 ? 'down' : 'flat';
    kv.className = `premium-val ${statusClass}`;
    kd.className = `small fw-bold ${statusClass}`;

    evaluateValue(currentFx, currentXau, realTimeKimpPct);
}

/**
 * 3. 공통 함수들 (이전과 동일)
 */
function renderDelta(id, deltaObj, type, scale = 1) {
    const el = document.getElementById(id);
    if (!el || !deltaObj) return;
    const diff = Number(deltaObj.diff) * scale;
    const pct = Number(deltaObj.pct);
    let cls = 'flat', sign = '-';
    if (diff > 0) { cls = 'up'; sign = '▲'; }
    else if (diff < 0) { cls = 'down'; sign = '▼'; }
    const diffFormatted = (type === 'fx') ? nf2.format(Math.abs(diff)) : nf0.format(Math.abs(Math.round(diff)));
    el.className = `delta-text ${cls}`;
    el.textContent = `${sign} ${diffFormatted} / ${nf2.format(Math.abs(pct))}%`;
}

async function initFetch() {
    const API_URL = 'https://goldkimp.com/wp-json/gk/gold/v1?tf=15m';
    try {
        const response = await fetch(API_URL, { cache: 'no-store' });
        const data = await response.json();
        
        apiData.latest = data.latest;
        const H = {}; 
        data.header.forEach((key, i) => H[key] = i);
        const lastRow = data.rows[data.rows.length - 1];
        apiData.xauPrice = Number(lastRow[H.xauusd_oz]);

        // 금값 가져온 직후 실시간 환율도 동기화
        await fetchRealTimeFxFinancialData();
        await fetchRealTimeXauFinancialData();

        if (!premiumChart) initPremiumChart();
        updatePremiumChart();
        if (!document.getElementById('tradingview_usdkrw').hasChildNodes()) {
            initTradingViewWidget();
        }
        renderUI();
        tickStatus();
    } catch (error) {
        console.error("데이터 로딩 실패:", error);
    }
}

// 초기 구동 및 주기적 갱신 설정
initFetch();
setInterval(initFetch, 60000);
setInterval(fetchRealTimeFxFinancialData, 10000);
setInterval(fetchRealTimeXauFinancialData, 10000);
setInterval(renderUI, 5000);

// 단위 변경 이벤트
document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', renderUI);
});

// 시간 업데이트 (장 상태 표시용)
function nowKST() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })); }
function isKrxOpen(d) { const day = d.getDay(); if (day === 0 || day === 6) return false; const m = d.getHours() * 60 + d.getMinutes(); return m >= 540 && m < 930; }
function isFxOpen(d) { const wd = (d.getDay() + 6) % 7; const m = wd * 1440 + d.getHours() * 60 + d.getMinutes(); return m >= 420 && m < 7500; }

function tickStatus() {
    const t = nowKST();
    updateStatusUI('st-krx', isKrxOpen(t));
    const fx = isFxOpen(t);
    updateStatusUI('st-intl', fx);
    updateStatusUI('st-fx', fx);
}

function updateStatusUI(id, isOpen) {
    const el = document.getElementById(id);
    if (!el) return;
    el.querySelector('.status-dot').style.background = isOpen ? '#22c55e' : '#94a3b8';
    el.querySelector('b').textContent = isOpen ? '실시간' : '장마감';
}
setInterval(tickStatus, 60000);
