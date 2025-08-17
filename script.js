// --------- SELECT SCREENS ----------
let loading = document.querySelector('.loading-screen');
let tap = document.querySelector('.tap-screen');
let hii = document.querySelector('.hii-screen');
let ihave = document.querySelector('.ihave-screen');
let gamescreen = document.querySelector('.game-screen');
let loss = document.querySelector('.loss');
let win = document.querySelector('.win');
let end = document.querySelector('.end');

// --------- SHOW SCREEN FUNCTION ----------
function showScreen(screen) {
    [loading, tap, hii, ihave, gamescreen, loss, win, end].forEach(s => s.classList.add('dn'));
    screen.classList.remove('dn');
}

// --------- GAME VARIABLES ----------
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 8;
let timeLeft = 40;
let timerInterval;

// --------- LOVE TEXT EFFECT ----------
let loveContainer = document.querySelector('.lovelod');
loveContainer.innerHTML = "";
loveContainer.style.display = "flex";
loveContainer.style.flexDirection = "column";

let i = 1;
function typeLine(text, callback) {
    let p = document.createElement("p");
    p.classList.add("love-line");
    loveContainer.appendChild(p);

    let j = 0;
    let typer = setInterval(() => {
        p.innerHTML = "<b>" + text.substring(0, j) + "</b>";
        j++;
        if (j > text.length) {
            clearInterval(typer);
            if (callback) callback();
        }
    }, 15);
}

function showNextLove(callback) {
    if (i > 10) {
        if (callback) callback();
        return;
    }
    let percent = i * 10;
    let text = `I love you ${percent}%`;
    typeLine(text, () => {
        i++;
        setTimeout(() => showNextLove(callback), 200);
    });
}

// --------- GAME LOGIC ----------
function flipCard(card) {
    if (lockBoard || card.classList.contains("flip") || card.classList.contains("matched")) return;

    card.classList.add("flip");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            showScreen(win);

            // Win hone ke baad love text chalega, uske baad end screen
            showNextLove(() => {
                setTimeout(() => showScreen(end), 2000);
            });
        }
        resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetBoard();
        }, 800);
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function setupGameBoard() {
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    timeLeft = 40;

    const board = document.getElementById("game-board");
    board.innerHTML = "";

    let cards = ["🥰", "😘", "🤑", "😩", "😍", "😎", "😡", "😇"];
    let cardPairs = [...cards, ...cards];
    cardPairs.sort(() => Math.random() - 0.5);

    cardPairs.forEach(symbol => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.image = symbol;
        card.innerHTML = `
        <div class="front">❓</div>
        <div class="back">${symbol}</div>
    `;
        board.appendChild(card);
        card.addEventListener("click", () => flipCard(card));
    });

    // Cards preview
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(c => c.classList.add("flip"));
    setTimeout(() => {
        allCards.forEach(c => c.classList.remove("flip"));
        startTimer();
    }, 2000);
}

// --------- TIMER ----------
function startTimer() {
    let timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            showScreen(loss);
        }
    }, 1000);
}

// --------- SCREENS FLOW ----------
function startFlow() {
    showScreen(loading);

    setTimeout(() => {
        showScreen(tap);

        tap.addEventListener("click", () => {
            setTimeout(() => showScreen(hii), 500);
            setTimeout(() => showScreen(ihave), 3000);
            setTimeout(() => {
                showScreen(gamescreen);
                setupGameBoard();
            }, 6000);
        }, { once: true });
    }, 3000);
}

// --------- BUTTONS ----------
document.querySelector(".retry-btn").addEventListener("click", () => {
    showScreen(gamescreen);
    setupGameBoard();
});

// Loss hone ke baad bhi "Continue" → End screen
document.querySelector(".end button").addEventListener("click", () => {
    alert("Game Finished! ❤️");
    showScreen(gamescreen);
    setupGameBoard();
});

// --------- START GAME ----------
startFlow();
