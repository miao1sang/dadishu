document.addEventListener('DOMContentLoaded', () => {
    const introPage = document.getElementById('intro-page');
    const gamePage = document.getElementById('game-page');
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');
    const adjectiveInput = document.getElementById('adjective');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time-left');
    const hammer = document.getElementById('hammer');
    const holes = document.querySelectorAll('.hole');

    let playerName = '';
    let adjective = '';
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let moleTimeout;

    // 初始化页面状态
    introPage.classList.remove('hidden');
    gamePage.classList.add('hidden');

    startButton.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        adjective = adjectiveInput.value.trim();

        if (playerName === '' || adjective === '') {
            alert('请输入完整的信息！');
            return;
        }

        introPage.classList.add('hidden');
        gamePage.classList.remove('hidden');

        startGame();
    });

    function startGame() {
        score = 0;
        timeLeft = 30; // 初始化时间
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;

        if (gameInterval) clearInterval(gameInterval); // 防止重复计时器
        gameInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);

        spawnMole();
    }

   function spawnMole() {
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.textContent = `${adjective}${playerName}`; // 地鼠上的文字
    randomHole.appendChild(mole);

    const message = document.createElement('div'); // 创建消息元素
    message.classList.add('message'); // 设置样式类，方便CSS控制
    randomHole.appendChild(message);

    mole.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = score;

        // 显示“谁让你打的”
        message.textContent = '谁让你打的';
        message.style.color = 'green';
        message.style.opacity = 1;

        setTimeout(() => {
            message.style.opacity = 0; // 消失动画
        }, 1000);

        mole.remove();
        clearTimeout(moleTimeout);
        spawnMole();
    });

    moleTimeout = setTimeout(() => {
        // 如果超时未点中，显示“打不中，傻逼”
        if (mole.parentElement) {
            message.textContent = '打不中，傻逼';
            message.style.color = 'red';
            message.style.opacity = 1;

            setTimeout(() => {
                message.style.opacity = 0; // 消失动画
            }, 1000);

            mole.remove();
        }

        if (timeLeft > 0) {
            spawnMole();
        }
    }, 1000);
}


    function endGame() {
        clearInterval(gameInterval);
        clearTimeout(moleTimeout);

        const popup = document.createElement('div');
        popup.id = 'end-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>游戏结束！</h3>
                <p>英明神武的梁一凡锤中了你 <span>${score}</span> 次！</p>
                <button onclick="window.location.reload()">再来一次</button>
            </div>
        `;
        document.body.appendChild(popup);
    }

    document.addEventListener('mousemove', (event) => {
        if (hammer) {
            hammer.style.left = `${event.clientX - hammer.offsetWidth / 2}px`;
            hammer.style.top = `${event.clientY - hammer.offsetHeight / 2}px`;

            // 添加文字到锤子上
            if (!hammer.querySelector('.hammer-text')) {
                const hammerText = document.createElement('div');
                hammerText.classList.add('hammer-text');
                hammerText.textContent = '英明神武的梁一凡';
                hammerText.style.position = 'absolute';
                hammerText.style.bottom = '-20px';
                hammerText.style.left = '50%';
                hammerText.style.transform = 'translateX(-50%)';
                hammerText.style.color = 'black';
                hammerText.style.fontSize = '12px';
                hammerText.style.fontWeight = 'bold';
                hammer.appendChild(hammerText);
            }
        }
    });
});
