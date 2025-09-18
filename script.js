// Game state
let playerScore = 0;
let computerScore = 0;
let gameHistory = [];
let isPlaying = false;

// Game choices
const choices = {
    rock: { name: 'Piedra', emoji: '🪨' },
    paper: { name: 'Papel', emoji: '📄' },
    scissors: { name: 'Tijeras', emoji: '✂️' }
};

// DOM elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const resultMessageEl = document.getElementById('resultMessage');
const playerChoiceEl = document.getElementById('playerChoice');
const computerChoiceEl = document.getElementById('computerChoice');
const computerEmojiEl = document.getElementById('computerEmoji');
const loadingSpinnerEl = document.getElementById('loadingSpinner');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('resetBtn');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// Initialize game
function initGame() {
    updateScoreboard();
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.dataset.choice;
            playGame(choice);
        });
    });

    resetBtn.addEventListener('click', resetGame);
}

// Get random computer choice
function getRandomChoice() {
    const choiceKeys = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * choiceKeys.length);
    return choiceKeys[randomIndex];
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

// Play game
function playGame(playerChoice) {
    if (isPlaying) return;
    
    isPlaying = true;
    
    // Disable buttons
    choiceButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });
    
    // Highlight selected choice
    const selectedBtn = document.querySelector(`[data-choice="${playerChoice}"]`);
    selectedBtn.classList.add('selected');
    
    // Show player choice
    const playerChoiceEmoji = playerChoiceEl.querySelector('.choice-emoji');
    playerChoiceEmoji.textContent = choices[playerChoice].emoji;
    playerChoiceEmoji.style.color = 'white';
    playerChoiceEl.classList.add('selected');
    
    // Show loading state
    computerEmojiEl.textContent = '🤔';
    computerEmojiEl.style.color = 'white';
    loadingSpinnerEl.style.display = 'block';
    resultMessageEl.textContent = 'Pensando...';
    resultMessageEl.className = 'result-message';
    
    // Simulate computer thinking
    setTimeout(() => {
        const computerChoice = getRandomChoice();
        
        // Show computer choice
        computerEmojiEl.textContent = choices[computerChoice].emoji;
        computerEmojiEl.style.color = 'white';
        loadingSpinnerEl.style.display = 'none';
        
        // Determine result
        const result = determineWinner(playerChoice, computerChoice);
        
        // Update UI with result
        updateResult(result, playerChoice, computerChoice);
        
        // Update scores and history
        updateScores(result);
        addToHistory(result, playerChoice, computerChoice);
        
        // Re-enable buttons
        setTimeout(() => {
            choiceButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected');
            });
            playerChoiceEl.classList.remove('selected');
            isPlaying = false;
        }, 1000);
        
    }, 1500);
}

// Update result message
function updateResult(result, playerChoice, computerChoice) {
    let message = '';
    let className = 'result-message';
    
    switch (result) {
        case 'win':
            message = '¡Ganaste! 🎉';
            className += ' win';
            break;
        case 'lose':
            message = '¡Perdiste! 😔';
            className += ' lose';
            break;
        case 'tie':
            message = '¡Empate! 🤝';
            className += ' tie';
            break;
    }
    
    resultMessageEl.textContent = message;
    resultMessageEl.className = className;
}

// Update scores
function updateScores(result) {
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        computerScore++;
    }
    
    updateScoreboard();
}

// Update scoreboard display
function updateScoreboard() {
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
}

// Add game to history
function addToHistory(result, playerChoice, computerChoice) {
    let historyText = '';
    
    switch (result) {
        case 'win':
            historyText = `Ganaste: ${choices[playerChoice].name} vs ${choices[computerChoice].name}`;
            break;
        case 'lose':
            historyText = `Perdiste: ${choices[playerChoice].name} vs ${choices[computerChoice].name}`;
            break;
        case 'tie':
            historyText = `Empate: ${choices[playerChoice].name} vs ${choices[computerChoice].name}`;
            break;
    }
    
    gameHistory.unshift(historyText);
    
    // Keep only last 5 games
    if (gameHistory.length > 5) {
        gameHistory = gameHistory.slice(0, 5);
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    if (gameHistory.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyList.innerHTML = '';
    
    gameHistory.forEach(game => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = game;
        historyList.appendChild(historyItem);
    });
}

// Reset game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    gameHistory = [];
    isPlaying = false;
    
    // Reset UI
    updateScoreboard();
    resultMessageEl.textContent = 'Elige tu jugada';
    resultMessageEl.className = 'result-message';
    
    // Reset choices display
    const playerChoiceEmoji = playerChoiceEl.querySelector('.choice-emoji');
    const computerChoiceEmoji = computerChoiceEl.querySelector('.choice-emoji');
    
    playerChoiceEmoji.textContent = '?';
    playerChoiceEmoji.style.color = 'rgba(255, 255, 255, 0.5)';
    computerChoiceEmoji.textContent = '?';
    computerChoiceEmoji.style.color = 'rgba(255, 255, 255, 0.5)';
    
    playerChoiceEl.classList.remove('selected');
    loadingSpinnerEl.style.display = 'none';
    
    // Reset buttons
    choiceButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected');
    });
    
    // Hide history
    updateHistoryDisplay();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);