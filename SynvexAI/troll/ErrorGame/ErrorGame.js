// scripts/modules/ErrorGame.js
window.ErrorGame = (function () {
    const CSS_ID = 'error-game-css';
    const CSS_PATH = 'error-game.css'; // скорректируй при необходимости

    let hostElement = null;
    let gameContainer = null;
    let scoreDisplay, timerDisplay;
    let score = 0;
    let highScore = 0;
    let timeLeft = 1; // seconds
    let timerInterval = null;
    let spawnInterval = null;
    let isRunning = false;

    const targetEmojis = ['⚠️', '😵', '💥', '🔥', '500', '❌'];

    // Динамическая подгрузка CSS
    function loadStylesheetOnce() {
        if (document.getElementById(CSS_ID)) return;
        const link = document.createElement('link');
        link.id = CSS_ID;
        link.rel = 'stylesheet';
        link.href = CSS_PATH;
        document.head.appendChild(link);
    }

    function createTarget() {
        if (!gameContainer || !isRunning) return;

        const target = document.createElement('div');
        target.className = 'aim-target';
        target.textContent = targetEmojis[Math.floor(Math.random() * targetEmojis.length)];

        const size = 40;
        const maxX = gameContainer.clientWidth - size;
        const maxY = gameContainer.clientHeight - size;

        target.style.left = Math.random() * maxX + 'px';
        target.style.top = Math.random() * maxY + 'px';

        target.addEventListener('click', () => {
            score++;
            updateScoreDisplay();
            adjustDifficulty();
            target.remove();
        });

        gameContainer.appendChild(target);

        // Удалим цель, если не кликнули через 2 сек
        setTimeout(() => {
            if (target.parentElement) target.remove();
        }, 2000);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Счёт: ${score}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = `Время: ${timeLeft}s`;
    }

    function loadHighScore() {
        const saved = parseInt(localStorage.getItem('miniAimHighScore'), 10);
        highScore = isNaN(saved) ? 0 : saved;
    }

    function saveHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('miniAimHighScore', highScore);
        }
    }

    // По мере набора каждых 10 очков чуть ускоряем появление целей
    function adjustDifficulty() {
        const newInterval = Math.max(300, 700 - Math.floor(score / 10) * 50);
        if (spawnInterval) {
            clearInterval(spawnInterval);
            spawnInterval = setInterval(createTarget, newInterval);
        }
    }

    function startGameLoop() {
        score = 0;
        timeLeft = 30;
        isRunning = true;
        loadHighScore();
        updateScoreDisplay();
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) endGame();
        }, 1000);

        spawnInterval = setInterval(createTarget, 700);
    }

    function endGame() {
        isRunning = false;
        clearInterval(timerInterval);
        clearInterval(spawnInterval);
        saveHighScore();

        const message = document.createElement('div');
        message.className = 'game-over-message';
        message.innerHTML = `
            <p>⏱️ Время вышло!</p>
            <p>Ваш счёт: <strong>${score}</strong></p>
            <p>Рекорд: <strong>${highScore}</strong></p>
            <button id="restart-btn">Играть снова</button>
        `;
        message.querySelector('#restart-btn').addEventListener('click', () => {
            message.remove();
            startGameLoop();
        });

        gameContainer.appendChild(message);
    }

    function init(hostEl) {
        if (!hostEl) {
            console.error("ErrorGame: Host element not provided.");
            return;
        }
        hostElement = hostEl;
        loadStylesheetOnce();
        hostElement.innerHTML = '';

        // Заголовок
        const title = document.createElement('h3');
        title.textContent = 'Потренируй меткость!';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        hostElement.appendChild(title);

        // UI счёта и таймера
        const uiWrapper = document.createElement('div');
        uiWrapper.id = 'error-game-ui';
        uiWrapper.innerHTML = `
            <span id="error-game-score">Счёт: 0</span>
            <span id="error-game-timer">Время: 30s</span>
        `;
        hostElement.appendChild(uiWrapper);
        scoreDisplay = uiWrapper.querySelector('#error-game-score');
        timerDisplay = uiWrapper.querySelector('#error-game-timer');

        // Контейнер для игры
        gameContainer = document.createElement('div');
        Object.assign(gameContainer.style, {
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            height: '250px',
            margin: '0 auto',
            border: '1px solid var(--color-border-medium)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-main)',
            overflow: 'hidden',
            userSelect: 'none'
        });
        hostElement.appendChild(gameContainer);

        startGameLoop();
        console.log("ErrorGame initialized in:", hostElement);
    }

    function destroy() {
        clearInterval(timerInterval);
        clearInterval(spawnInterval);
        if (gameContainer && gameContainer.parentElement) {
            gameContainer.parentElement.innerHTML = '';
        }
        hostElement = gameContainer = null;
        score = timeLeft = 0;
        isRunning = false;
        console.log("ErrorGame destroyed.");
    }

    return { init, destroy };
})();
