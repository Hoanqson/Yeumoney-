(function () {
    'use strict';

    GM_addStyle(`
        #ym-container {
            position: fixed;
            top: 15px;
            left: 15px;
            background-image: url('https://i.postimg.cc/KzPvTkyg/1751555822013.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            backdrop-filter: blur(8px);
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 16px 16px 42px 16px;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            z-index: 9999;
            width: 240px;
        }

        #ym-container::after {
            content: 'By HoanqSon2107';
            position: absolute;
            bottom: 22px;
            right: 8px;
            font-size: 14px;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            background: linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbowText 10s linear infinite;
        }

        #ym-reno {
            position: absolute;
            bottom: 4px;
            right: 8px;
            font-size: 13px;
            font-weight: bold;
            font-family: monospace;
            color: black;
            text-decoration: underline;
            cursor: pointer;
        }

        @keyframes rainbowText {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        #ym-timer, #ym-result {
            margin-top: 10px;
            font-weight: bold;
            color: rgba(255,255,255,0.95);
        }
    `);

    const types = {
        m88: {
            url: 'https://bet88ec.com/cach-danh-bai-sam-loc',
            traffic: 'https://bet88ec.com/',
            code: 'taodeptrai'
        },
        fb88: {
            url: 'https://fb88mg.com/ty-le-cuoc-hong-kong-la-gi',
            traffic: 'https://fb88mg.com/',
            code: 'taodeptrai'
        },
        '188bet': {
            url: 'https://88betag.com/cach-choi-game-bai-pok-deng',
            traffic: 'https://88betag.com/',
            code: 'taodeptrailamnhe'
        },
        w88: {
            url: 'https://188.166.185.213/tim-hieu-khai-niem-3-bet-trong-poker-la-gi',
            traffic: 'https://188.166.185.213/',
            code: 'taodeptrai'
        },
        v9bet: {
            url: 'https://v9betse.com/ca-cuoc-dua-cho',
            traffic: 'https://v9betse.com/',
            code: 'taodeptrai'
        },
        bk8: {
            url: 'https://bk8ze.com/cach-choi-bai-catte',
            traffic: 'https://bk8ze.com/',
            code: 'taodeptrai'
        }
    };

    const imageMapping = {
        'User-traffic.com-44-03-07-2025-1751522786.jpg': 'm88',
        'User-traffic.com-42-03-07-2025-1751525315.jpg': '188bet',
        'User-traffic.com-41-03-07-2025-1751522697.jpg': 'bk8',
        'User-traffic.com-37-03-07-2025-1751522656.jpg': 'fb88',
        'User-traffic.com-23-30-05-2025-1748599654.jpg': 'v9bet',
        'User-traffic.com-30-05-05-2025-1746452056.jpg': 'w88'
    };

    let hasAutoStarted = false;

    function detectImageAndSetType() {
        const images = document.querySelectorAll('img');
        for (const img of images) {
            const src = img.src || img.getAttribute('src') || '';
            const filename = src.split('/').pop();
            if (imageMapping[filename]) return imageMapping[filename];
        }

        const elementsWithBg = document.querySelectorAll('*');
        for (const el of elementsWithBg) {
            const bgImage = window.getComputedStyle(el).backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const matches = bgImage.match(/url\(["']?(.*?)["']?\)/);
                if (matches && matches[1]) {
                    const filename = matches[1].split('/').pop();
                    if (imageMapping[filename]) return imageMapping[filename];
                }
            }
        }

        return null;
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'ym-container';

        const timer = document.createElement('div');
        timer.id = 'ym-timer';

        const result = document.createElement('div');
        result.id = 'ym-result';

        const renoLink = document.createElement('div');
        renoLink.id = 'ym-reno';
        renoLink.textContent = 'Code By reno';
        renoLink.addEventListener('click', () => {
            window.open('https://github.com/nguy3nlong', '_blank');
        });

        container.appendChild(timer);
        container.appendChild(result);
        container.appendChild(renoLink);

        document.body.appendChild(container);

        checkAndAutoSelect();
    }

    function checkAndAutoSelect() {
        const detectedType = detectImageAndSetType();
        if (detectedType && !hasAutoStarted) {
            hasAutoStarted = true;
            startCountdown(75, detectedType);
        }
    }

    function startCountdown(seconds, type) {
        const timerEl = document.getElementById('ym-timer');
        const resultEl = document.getElementById('ym-result');
        resultEl.textContent = '';
        timerEl.textContent = `⏳ Đợi ${seconds} giây...`;

        const interval = setInterval(() => {
            seconds--;
            timerEl.textContent = `⏳ Đợi ${seconds} giây...`;
            if (seconds <= 0) {
                clearInterval(interval);
                timerEl.textContent = '⏱ Đang lấy mã...';
                fetchCode(type, resultEl, timerEl);
            }
        }, 1000);
    }

    function fetchCode(type, resultEl, timerEl) {
        const item = types[type];
        const apiUrl = `https://traffic-user.net/GET_MA.php?codexn=${item.code}&url=${encodeURIComponent(item.url)}&loai_traffic=${encodeURIComponent(item.traffic)}&clk=1000`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            onload: function (response) {
                const html = response.responseText;
                const match = html.match(/<span id="layma_me_vuatraffic"[^>]*>\s*(\d+)\s*<\/span>/);
                const code = match ? match[1] : null;

                if (code) {
                    resultEl.textContent = 'Mã: ' + code;

                    setTimeout(() => {
                        const input = document.querySelector('input[placeholder="Nhập mã vào đây"]');
                        if (input) {
                            input.value = code;
                            input.dispatchEvent(new Event('input', { bubbles: true }));

                            setTimeout(() => {
                                const button = Array.from(document.querySelectorAll('button'))
                                    .find(btn => btn.innerText.trim() === "Xác nhận");
                                if (button) button.click();
                            }, 1000);
                        }
                    }, 3000);
                } else {
                    resultEl.textContent = 'Lỗi Đeo Biết, Làm Nhiệm Vụ Khác Đi';
                }

                timerEl.textContent = '';
            },
            onerror: function () {
                resultEl.textContent = 'Lỗi Đeo Biết, Làm Nhiệm Vụ Khác Đi';
                timerEl.textContent = '';
            }
        });
    }

    const observer = new MutationObserver(() => {
        checkAndAutoSelect();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
