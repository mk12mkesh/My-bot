const express = require('express'); // 'const' अब छोटा है
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000; // Render के लिए 10000 बेहतर है

// --- आपका HTML Content यहाँ से शुरू होता है ---
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BDG WIN Tournament</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
body { 
    font-family: 'Segoe UI', Arial, sans-serif; 
    background-color: #1c1c1e;
    color: #fff; 
    text-align: center; 
    margin: 0; 
    padding: 0; 
    -webkit-tap-highlight-color: transparent;
    min-height: 100vh;
    overflow-x: hidden;
}
.container { 
    margin: 0 auto; 
    width: 100%; 
    max-width: 450px; 
    background-color: #121212;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7); 
    min-height: 100vh;
}
.top-bar {
    background-color: #181818;
    color: #ffd700;
    padding: 15px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); 
    position: sticky;
    top: 0;
    z-index: 10;
}
.top-bar-left, .top-bar-right {
    display: flex;
    gap: 15px;
    align-items: center;
}
.top-bar-title { color: #ffd700; font-size: 20px; }
.icon { font-size: 24px; color: #fff; cursor: pointer; }
#user-id-display { font-size: 14px; color: #aaa; font-weight: normal; }
.wallet-section {
    padding: 20px 15px;
    background-color: #121212;
    border-bottom: 1px solid #333; 
}
.balance-display {
    color: #fff;
    font-size: 36px; 
    font-weight: bold;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.balance-text { font-size: 14px; color: #aaa; margin-bottom: 20px; }
.wallet-buttons { display: flex; justify-content: space-between; gap: 15px; }
.wallet-btn {
    width: 100%;
    padding: 12px 0; 
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 10px; 
    cursor: pointer;
    transition: background-color 0.1s;
}
.withdraw-btn { background-color: #c0392b; color: #fff; } 
.deposit-btn { background-color: #27ae60; color: #fff; } 
.wallet-btn:active { opacity: 0.8; }
.info-notice {
    background-color: #2c2c2e;
    color: #fff;
    padding: 12px 15px; 
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px; 
    border-radius: 0; 
}
.info-notice .wallet-btn {
    background-color: #f39c12 !important; 
    padding: 5px 12px !important;
    font-size: 13px !important;
}
.tournament-timer-display {
    padding: 8px; 
    margin-bottom: 5px; 
    border: 2px solid #ffd700; 
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); 
    flex-shrink: 0; 
}
.tournament-main-timer {
    font-size: 38px; 
    font-weight: bold;
    color: #ffd700;
}
.tournament-main-timer.warning { color: #e74c3c; }
.tournament-round-timer {
    font-size: 16px; 
    color: #f39c12;
    margin-top: 3px; 
}
.tournament-round-timer.warning { color: #e74c3c; }
.last-number-display {
    padding: 5px; 
    margin: 5px 0 5px; 
    border-bottom: 1px solid #333;
}
.last-number-display span:first-child { 
    font-size: 14px; 
}
.last-number {
    font-size: 32px; 
    font-weight: bold;
    padding: 3px 15px; 
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    display: inline-block;
}
.last-number.green { color: #2ecc71; background-color: rgba(46, 204, 113, 0.1); }
.last-number.red { color: #e74c3c; background-color: rgba(231, 76, 60, 0.1); }
.last-number.violet { color: #9b59b6; background-color: rgba(155, 89, 182, 0.1); }
.tournament-players {
    margin: 3px 0 5px 0; 
    flex-shrink: 0;
}
.tournament-player {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px; 
    margin: 3px 0; 
    border-radius: 8px;
    background-color: #252525; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); 
    transition: all 0.3s;
}
.tournament-player.user { background-color: #1e3a2d; border: 2px solid #2ecc71; } 
.tournament-player.winner { background-color: #4a3e1a; border: 3px solid #ffd700; } 
.tournament-player.loser { background-color: #3b201d; opacity: 0.8; } 
.player-rank { font-size: 20px; margin-right: 10px; } 
.player-name { font-weight: bold; flex: 1; text-align: left; font-size: 14px; } 
.player-name.user-name { color: #2ecc71; }
.player-balance { font-weight: bold; color: #ffd700; font-size: 16px; } 
.tournament-bet-section {
    background-color: #1a1a1a;
    padding: 8px; 
    border-radius: 12px;
    margin-top: 5px; 
    flex-shrink: 0; 
    overflow-y: hidden; 
    flex-grow: 0; 
    max-height: auto; 
}
.tournament-bet-info {
    font-size: 13px; 
    color: #ccc;
    margin-bottom: 5px;
    padding: 3px 0;
    border-bottom: 1px dashed #444;
}
.tournament-current-bet {
    font-size: 14px;
    padding: 8px;
    border-radius: 6px;
    margin-bottom: 10px;
}
.tournament-bet-section label {
    font-size: 12px !important;
    color: #aaa;
    margin-bottom: 2px !important;
    display: block;
    text-align: left;
}
#currentBetAmount {
    width: 95%; 
    padding: 8px; 
    font-size: 16px !important; 
    margin: 3px 0 5px !important; 
    border: 1px solid #555;
    border-radius: 6px;
    background: #1c1c1e; 
    color: #fff;
}
.entry-presets { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 5px; 
    margin: 5px 0; 
    justify-content: center;
}
.preset-btn {
    padding: 6px 10px; 
    font-size: 12px; 
    border: 1px solid #555;
    border-radius: 6px;
    background-color: #333; 
    color: #fff; 
}
.entry-presets .preset-btn.active {
    background-color: #ffd700 !important; 
    color: #121212 !important;          
    border: 1px solid #ffd700 !important;
    font-weight: bold;
}
.tournament-bet-buttons, .tournament-bet-buttons-2 {
    gap: 5px !important; 
}
.t-bet-btn {
    padding: 8px !important; 
    font-size: 13px; 
    font-weight: bold;
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2); 
    transition: transform 0.1s;
}
.t-bet-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}
.t-btn-green { background-color: #2ecc71 !important; }
.t-btn-violet { background-color: #9b59b6 !important; }
.t-btn-red { background-color: #e74c3c !important; }
.t-btn-big { background-color: #d35400 !important; } 
.t-btn-small { background-color: #2980b9 !important; } 
.modal {
    display: none; 
    position: fixed; 
    z-index: 1001; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0,0,0,0.85); 
}
.modal-content {
    background-color: #2c2c2e;
    margin: 1vh auto; 
    padding: 10px; 
    border-radius: 15px; 
    width: 90%; 
    max-width: 380px; 
    box-shadow: 0 5px 20px rgba(0,0,0,0.8);
    display: flex; 
    flex-direction: column;
    max-height: 98vh; 
    overflow: hidden; 
}
#tournament-game-screen {
    display: flex;
    flex-direction: column;
    flex-grow: 1; 
    overflow-y: hidden; 
    padding: 0 5px; 
}
.modal-content h2 { 
    color: #ffd700; 
    margin-top: 0; 
    font-size: 18px; 
}
.modal-close {
    color: #ccc;
    float: right;
    font-size: 32px;
}
.modal-content input[type="number"], 
.modal-content input[type="password"] {
    width: 95%;
    padding: 10px;
    margin: 8px 0 15px 0;
    display: inline-block;
    border: 1px solid #555;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #1c1c1e;
    color: #fff;
    font-size: 16px;
    text-align: center;
}
.modal-submit-btn {
    width: 100%;
    background-color: #007aff;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.2s;
}
.modal-submit-btn:hover {
    background-color: #005bb5;
}
.history-container-upgrade {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #444;
}
.history-container-upgrade h3 {
    color: #fff;
    font-size: 16px;
    margin-bottom: 10px;
    text-align: left;
}
.transaction-list {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 5px; 
}
.transaction-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 10px;
    background-color: #1a1a1a;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.transaction-card.deposit-tx {
    border-left: 5px solid #2ecc71;
}
.transaction-card.withdrawal-tx {
    border-left: 5px solid #e74c3c;
}
.tx-amount {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
}
.tx-amount .icon {
    font-size: 18px;
    margin-right: 8px;
}
.tx-details {
    text-align: right;
}
.tx-date {
    font-size: 12px;
    color: #aaa;
    display: block;
}
.tx-status {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 2px;
}
.tx-status.success { color: #2ecc71; }
.tx-status.pending { color: #f1c40f; }
.tx-status.failed { color: #e74c3c; }
</style>
</head>
<body>
<div class="container">
    <div class="top-bar">
        <div class="top-bar-left">
            <span class="top-bar-title">BDG WIN Tournament</span>
        </div>
        <div class="top-bar-right">
            <span class="icon">🏆</span> 
            <span id="user-id-display"></span> 
            <span class="icon" onclick="showModal('rules')">🔔</span>
        </div>
    </div>
    <div class="wallet-section">
        <div class="balance-display">
            <span id="balance-rupee">₹</span><span id="balance">0.00</span>
            <span class="icon" style="color: #ffd700;">🏆</span> 
        </div>
        <p class="balance-text">Wallet balance</p>
        <div class="wallet-buttons">
            <button class="wallet-btn withdraw-btn" onclick="showModal('withdrawal')">Withdraw</button>
            <button class="wallet-btn deposit-btn" onclick="showModal('deposit')">Deposit</button>
        </div>
    </div>
    <div class="info-notice">
        <span class="icon">📢</span>
        <span>Participate in 5-minute tournaments now!</span>
        <button class="wallet-btn" style="width: auto; padding: 5px 10px; font-size: 12px; background-color: #f39c12;">Join</button>
    </div>
    <div id="active-tournament-message" style="display: none; padding: 15px; background-color: #4a3e1a; border-radius: 10px; margin: 15px; border: 1px solid #ffd700; cursor: pointer;" onclick="continueTournament()">
        <span class="icon" style="color: #ffd700; margin-right: 10px;">🚨</span>
        <span style="font-weight: bold; font-size: 16px;">Active Tournament Found!</span>
        <p style="font-size: 13px; margin-top: 5px; color: #ccc;">Click to rejoin your 5-minute match.</p>
    </div>
    <div id="start-new-tournament-section" style="padding: 20px 15px; text-align: center;">
        <h3 style="color: #ffd700;">Tournament Mode Active</h3>
        <p id="win-target-status" style="color: #ccc; font-size: 14px; margin-bottom: 10px;">
             Target Status: Off
        </p>
        <p style="color: #aaa;">Tap the button below to join the next 5-minute Tournament.</p>
        <button class="wallet-btn" style="background-color: #ffd700; color: #121212; margin-top: 15px; width: 80%;" onclick="showModal('tournament')">
            <span class="icon" style="color: #121212;">⚔️</span> Start New Tournament
        </button>
    </div>
</div>
<div id="tournament-modal" class="modal">
    <div class="modal-content">
        <span class="modal-close" onclick="closeModal('tournament-modal')">&times;</span>
        <h2>🏆 Tournament</h2>
        <div id="tournament-entry-screen">
            <div style="background-color: #31260e; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #ffd700;">
                <p style="font-size: 14px; color: #ffd700; margin-bottom: 5px;">
                    5-MINUTE **HIGH-STAKES** CHALLENGE
                </p>
                <p style="margin: 10px 0; font-size: 16px;">
                    <span style="color: #aaa;">Duration:</span> 
                    <span style="color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 4px; background-color: #1a1a1a;">5 Minutes</span>
                </p>
                <p style="margin: 5px 0;">
                    <span style="color: #aaa;">Prize Pool:</span> 
                    <span style="color: #ffd700; font-weight: bold; font-size: 24px;">2.35x</span> <span style="font-size: 14px;">Entry Fee for Winner</span>
                </p>
                <p style="font-size: 12px; color: #2ecc71; margin-top: 15px;">
                    ✓ Tournament winnings are **FREE from Rollover**!
                </p>
            </div>
            <div style="background-color: #1a1a1a; padding: 15px; border-radius: 12px;">
                <label for="tournamentAmount">Select Entry Amount (₹100 - ₹20000):</label>
                <input type="number" id="tournamentAmount" value="100" min="100" max="20000" step="100" 
                       style="width: 95%; padding: 10px; font-size: 18px; margin: 5px 0 15px; border: 2px solid #555; border-radius: 8px; background: #252525; color: #ffd700; text-align: center; font-weight: bold;">
                <div class="entry-presets" style="margin-bottom: 20px;">
                    <button class="preset-btn active" onclick="setEntryAmount(100)">₹100</button>
                    <button class="preset-btn" onclick="setEntryAmount(500)">₹500</button>
                    <button class="preset-btn" onclick="setEntryAmount(1000)">₹1000</button>
                    <button class="preset-btn" onclick="setEntryAmount(5000)">₹5000</button>
                    <button class="preset-btn" onclick="setEntryAmount(10000)">₹10000</button>
                    <button class="preset-btn" onclick="setEntryAmount(20000)">₹20000</button>
                </div>
                <button class="modal-submit-btn" onclick="startTournament()" style="background-color: #ffd700; color: #121212; border: none; font-size: 18px; padding: 15px 0;">
                    <span class="icon" style="color: #121212;">⚔️</span> Join Tournament (₹<span id="join-btn-amount">100</span>)
                </button>
                <p id="insufficient-balance-msg" style="font-size: 12px; color: #e74c3c; margin-top: 10px; display: none;">
                    🚨 Insufficient wallet balance to cover the entry fee.
                </p>
            </div>
        </div>
        <div id="tournament-game-screen" style="display: none;">
            <div class="tournament-timer-display">
                <p style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Tournament Time</p>
                <div class="tournament-main-timer" id="tournament-main-timer">5:00</div>
                <p style="color: #aaa; font-size: 12px; margin-top: 3px;">Round Timer</p>
                <div class="tournament-round-timer" id="tournament-round-timer">30s</div>
                <p style="font-size: 11px; color: #aaa; margin-top: 5px;">Period: <span id="tournament-period">T000000</span></p>
            </div>
            <div class="last-number-display" id="last-number-display" style="text-align: center;">
                <span style="color: #aaa;">Last Result: </span>
                <span class="last-number" id="last-result-number" style="display: none;">-</span>
            </div>
            <div class="tournament-players" id="tournament-players"></div>
            <div class="tournament-bet-section" id="tournament-bet-section">
                <p class="tournament-bet-info">Your Balance: ₹<span id="t-user-balance">0</span> | Bet Amount: ₹<span id="t-bet-amount">10</span></p>
                <p class="tournament-current-bet" id="t-current-bet" style="display: none;">Current Bet: <span id="t-bet-choice">-</span></p>
                <label for="currentBetAmount">Set Bet Amount (₹10 - ₹1000):</label>
                <input type="number" id="currentBetAmount" value="10" min="10" max="1000" step="10">
                <div class="entry-presets">
                    <button class="preset-btn active" onclick="setTournamentBetAmount(10)">₹10</button>
                    <button class="preset-btn" onclick="setTournamentBetAmount(50)">₹50</button>
                    <button class="preset-btn" onclick="setTournamentBetAmount(100)">₹100</button>
                    <button class="preset-btn" onclick="setTournamentBetAmount(500)">₹500</button>
                </div>
                <div class="tournament-bet-buttons" style="display: grid; grid-template-columns: repeat(3, 1fr);">
                    <button class="t-bet-btn t-btn-green" onclick="placeTournamentBet('Green')">Green</button>
                    <button class="t-bet-btn t-btn-violet" onclick="placeTournamentBet('Violet')">Violet</button>
                    <button class="t-bet-btn t-btn-red" onclick="placeTournamentBet('Red')">Red</button>
                </div>
                <div class="tournament-bet-buttons-2" style="display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 5px;">
                    <button class="t-bet-btn t-btn-big" onclick="placeTournamentBet('Big')">Big (5-9)</button>
                    <button class="t-bet-btn t-btn-small" onclick="placeTournamentBet('Small')">Small (0-4)</button>
                </div>
            </div>
        </div>
        <div id="tournament-result-screen" style="display: none;">
             <div class="tournament-result" id="tournament-result-box" style="padding: 20px; border-radius: 10px; text-align: center; margin-top: 15px;">
                <p class="result-title" id="result-title" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">-</p>
                <p class="result-prize" id="result-prize" style="font-size: 32px; font-weight: bold; color: #ffd700;">-</p>
                <p class="result-note" id="result-note" style="font-size: 12px; color: #2ecc71; margin-top: 10px;"></p>
            </div>
            <div class="tournament-players" id="final-players"></div>
            <button class="modal-submit-btn" onclick="resetTournament()" style="background-color: #e67e22; margin-top: 15px;">Play Again</button>
        </div>
    </div>
</div>
<div id="deposit-modal" class="modal">
    <div class="modal-content">
        <span class="modal-close" onclick="closeModal('deposit-modal')">&times;</span>
        <h2>💰 Deposit</h2>
        <p>Add funds to your account for testing.</p>
        <label for="depositAmount">Amount (₹):</label>
        <input type="number" id="depositAmount" value="100" min="100" max="20000" step="100">
        <label for="depositPin" style="font-size: 14px; color: #ccc; margin-bottom: 8px; display: block; text-align: left;">Control PIN:</label>
        <input type="number" id="depositPin" placeholder="Enter PIN">
        <button class="modal-submit-btn" onclick="handleDeposit()">Add Funds</button>
        <div id="deposit-history-container" class="history-container-upgrade"></div>
    </div>
</div>
<div id="withdrawal-modal" class="modal">
    <div class="modal-content">
        <span class="modal-close" onclick="closeModal('withdrawal-modal')">&times;</span>
        <h2>💸 Withdrawal</h2>
        <div style="background-color: #1a1a1a; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <p id="rollover-status-text" style="font-size: 14px; margin: 0; color: #ffd700;">
                Required Rollover Remaining
            </p>
            <p id="rollover-display-amount" style="font-size: 24px; font-weight: bold; margin: 5px 0 0 0; color: #fff;">
                ₹0.00
            </p>
        </div>
        <label for="withdrawAmount">Amount (₹):</label>
        <input type="number" id="withdrawAmount" value="200" min="200" max="10000" step="10">
        <label for="withdrawPin" style="font-size: 14px; color: #ccc; margin-bottom: 8px; display: block; text-align: left;">Withdrawal PIN (User ID Sum):</label>
        <input type="number" id="withdrawPin" placeholder="Withdrawal PIN"> 
        <button class="modal-submit-btn" onclick="handleWithdrawal()">Withdraw</button>
        <div id="withdrawal-history-container" class="history-container-upgrade"></div>
    </div>
</div>
<div id="rules-modal" class="modal">
    <div class="modal-content">
        <span class="modal-close" onclick="closeModal('rules-modal')">&times;</span>
        <h2>📖 Tournament Rules</h2>
        <p style="text-align: left; font-size: 14px;">
            <span style="color: #ffd700; font-weight: bold;">Objective:</span> Achieve the highest balance after 5 minutes.<br><br>
            <span style="color: #2ecc71;">Betting Payouts:</span> Green/Red/Big/Small (approx 1.95x), Violet (4.5x).<br><br>
            <span style="color: #e74c3c;">Prize:</span> Highest balance wins **2.35x** the player's entry fee.<br><br>
            <span style="color: #2ecc71;">Withdrawal:</span> Tournament winnings are credited to the main balance with **NO Rollover**.
        </p>
    </div>
</div>
<div id="notification-popup" style="position: fixed; bottom: 55px; left: 50%; transform: translateX(-50%); background-color: #333; color: #fff; padding: 10px 20px; border-radius: 8px; z-index: 1000; transition: bottom 0.5s; display: none;"></div>
<script>
let userid = localStorage.getItem('userid') || 'USER' + Math.floor(Math.random() * 1000000);
localStorage.setItem('userid', userid);
document.getElementById('user-id-display').innerText = userid;
let balance = parseFloat(localStorage.getItem('balance_' + userid)) || 0; 
let totalDeposits = parseFloat(localStorage.getItem('total_deposits_' + userid)) || 0;
let totalWagered = parseFloat(localStorage.getItem('total_wagered_' + userid)) || 0;
let usedPinEpochs = JSON.parse(localStorage.getItem('used_pin_epochs_' + userid)) || [];
let depositHistory = JSON.parse(localStorage.getItem('depositHistory_' + userid)) || [];
let withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory_' + userid)) || [];
let tournamentActive = false;
let tournamentTime = 300; 
let tournamentRoundTime = 30;
let tournamentPlayers = [];
let tournamentBet = null;
let tournamentInterval = null;
let tournamentEntryAmount = 0; 
let savedTournamentState = null; 
let lastDepositTime = parseInt(localStorage.getItem('lastDepositTime_' + userid)) || 0;
let lastDepositAmount = parseFloat(localStorage.getItem('lastDepositAmount_' + userid)) || 0;
const TARGET_KEY = 'tournament_random_rate_data';
let randomRateData = JSON.parse(localStorage.getItem(TARGET_KEY)) || {
    isActive: false,      
    winRate: 0.30,        
    tournamentsPlayed: 0, 
    targetAmount: 0      
};
const DEFAULT_WIN_RATE = 0.30; 
let botBaseWinRate = 0.40; 
let currentPinEpoch = 0;
let currentDynamicPin = ''; 
function pseudoRandom(seed) {
    let hash = 0x811c9dc5; 
    const prime = 0x01000193; 
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = (hash * prime) >>> 0; 
    }
    return (Math.abs(hash) % 1000000);
}
function generateDynamicPin() {
    const now = new Date();
    const periodIndex = Math.floor(now.getTime() / 30000); 
    const seedString = periodIndex.toString();
    const pseudoRandomPin = pseudoRandom(seedString).toString().padStart(6, '0');
    return pseudoRandomPin;
}
function updateDynamicPin() {
    const newPinEpoch = Math.floor(Date.now() / 30000);
    if (newPinEpoch !== currentPinEpoch) {
        currentPinEpoch = newPinEpoch;
        currentDynamicPin = generateDynamicPin(); 
        const currentTimestamp = Math.floor(Date.now() / 1000);
        usedPinEpochs = usedPinEpochs.filter(epoch => (currentTimestamp - (epoch * 30)) < 3600); 
        localStorage.setItem('used_pin_epochs_' + userid, JSON.stringify(usedPinEpochs));
    }
}
updateDynamicPin();
setInterval(updateDynamicPin, 1000); 
function setRandomRateCycle(controlCode, entryAmount) {
    const digit = parseInt(controlCode);
    let newWinRate = DEFAULT_WIN_RATE;
    if (digit === 2 || digit === 3 || digit === 4 || digit === 5 || digit === 8 || digit === 9) {
        newWinRate = digit / 10; 
        randomRateData = {
            isActive: true,
            winRate: newWinRate,
            tournamentsPlayed: 0,
            targetAmount: entryAmount
        };
        localStorage.setItem(TARGET_KEY, JSON.stringify(randomRateData));
        return true;
    }
    return false; 
}
function updateRandomRateStatusDisplay() {
    const el = document.getElementById('win-target-status');
    const rollover = Math.max(0, totalDeposits - totalWagered);
    if (randomRateData.isActive) {
        const remaining = 10 - randomRateData.tournamentsPlayed;
        el.style.color = '#2ecc71';
        el.innerHTML = \`✅ Remaining: \${remaining} Tournaments\`; 
    } else if (rollover <= 0) {
        randomRateData.winRate = DEFAULT_WIN_RATE;
        el.style.color = '#2ecc71'; 
        el.innerHTML = '🎉 **Rollover Complete!** | Withdrawal is now open.';
    } else {
        el.style.color = '#aaa';
        el.innerHTML = 'Rate Status: Off (Use PIN to set rate for 10 tournaments)';
    }
}
function updateBalanceDisplay() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('balance_' + userid, balance);
}
function showNotification(message, type) {
    const popup = document.getElementById('notification-popup');
    popup.innerText = message;
    popup.style.display = 'block'; 
    popup.style.backgroundColor = type === 'error' ? '#e74c3c' : (type === 'success' ? '#2ecc71' : '#f39c12');
    setTimeout(() => popup.style.display = 'none', 3000);
}
function saveHistory(type, historyArray) {
    const limitedHistory = historyArray.slice(-5);
    localStorage.setItem(type + 'History_' + userid, JSON.stringify(limitedHistory));
    return limitedHistory;
}
function renderHistory(type) {
    const history = type === 'deposit' ? depositHistory : withdrawalHistory;
    const isDeposit = type === 'deposit';
    if (history.length === 0) return '<p style="text-align: center;">No recent transactions.</p>';
    let html = '<h3>Recent Transactions</h3><div class="transaction-list">';
    const reversedHistory = [...history].reverse();
    reversedHistory.forEach(item => {
        html += \`<div class="transaction-card">₹\${item.amount} - \${item.date}</div>\`;
    });
    html += '</div>';
    return html;
}
function showModal(id) {
    document.getElementById(id + '-modal').style.display = 'block';
    if (id === 'withdrawal') {
        const rollover = Math.max(0, totalDeposits - totalWagered);
        document.getElementById('rollover-display-amount').innerText = rollover > 0 ? '₹' + rollover.toFixed(2) : 'Complete!';
        document.getElementById('withdrawal-history-container').innerHTML = renderHistory('withdrawal');
    }
    if (id === 'deposit') document.getElementById('deposit-history-container').innerHTML = renderHistory('deposit');
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function calculateUserIdSum() {
    const idDigits = userid.replace('USER', ''); 
    let sum = 0;
    for (let i = 0; i < idDigits.length; i++) sum += parseInt(idDigits[i]);
    return sum;
}
function handleDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const userEnteredSum = document.getElementById('depositPin').value.trim(); 
    if (amount < 100 || amount % 100 !== 0) {
        showNotification('Invalid amount', 'error');
        return;
    }
    const currentUserIdLastDigit = userid.slice(-1);
    const validControlDigits = [2, 3, 4, 5, 8, 9];
    let validPinFound = false;
    let finalControlCode = 0;
    for (const digit of validControlDigits) {
        const expectedPin = parseInt(currentDynamicPin + currentUserIdLastDigit + digit);
        if (parseFloat(userEnteredSum) === expectedPin + amount) {
            validPinFound = true;
            finalControlCode = digit;
            break;
        }
    }
    if (!validPinFound || usedPinEpochs.includes(currentPinEpoch)) {
        showNotification('🚨 Invalid PIN.', 'error');
        return;
    }
    setRandomRateCycle(finalControlCode.toString(), amount); 
    recordPinUsage(); 
    balance += amount;
    totalDeposits += amount;
    localStorage.setItem('total_deposits_' + userid, totalDeposits);
    depositHistory.push({ amount: amount.toFixed(2), date: new Date().toLocaleString() });
    saveHistory('deposit', depositHistory);
    updateBalanceDisplay();
    updateRandomRateStatusDisplay();
    closeModal('deposit-modal');
    showNotification('Success!', 'success');
}
function handleWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const pin = parseInt(document.getElementById('withdrawPin').value);
    if (pin !== calculateUserIdSum()) {
        showNotification('🚨 Incorrect PIN.', 'error');
        return;
    }
    if (amount > balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    balance -= amount;
    withdrawalHistory.push({ amount: amount.toFixed(2), date: new Date().toLocaleString() });
    saveHistory('withdrawal', withdrawalHistory);
    updateBalanceDisplay();
    closeModal('withdrawal-modal');
    showNotification('Withdrawn!', 'success');
}
function recordPinUsage() {
    usedPinEpochs.push(currentPinEpoch);
    localStorage.setItem('used_pin_epochs_' + userid, JSON.stringify(usedPinEpochs));
}
function startTournament() {
    const entry = parseInt(document.getElementById('tournamentAmount').value);
    if (balance < entry) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    tournamentEntryAmount = entry;
    totalWagered += entry;
    balance -= entry;
    updateBalanceDisplay();
    tournamentActive = true;
    tournamentTime = 300;
    tournamentPlayers = [
        { name: 'You', isUser: true, balance: entry },
        { name: 'Bot1', isUser: false, balance: entry },
        { name: 'Bot2', isUser: false, balance: entry }
    ];
    document.getElementById('tournament-entry-screen').style.display = 'none';
    document.getElementById('tournament-game-screen').style.display = 'flex';
    restartTournamentInterval();
}
function restartTournamentInterval() {
    if (tournamentInterval) clearInterval(tournamentInterval);
    tournamentInterval = setInterval(() => {
        if (tournamentTime <= 0) { endTournament(); return; }
        tournamentTime--;
        document.getElementById('tournament-main-timer').innerText = tournamentTime + 's';
    }, 1000);
}
function endTournament() {
    clearInterval(tournamentInterval);
    tournamentActive = false;
    showNotification('Tournament Ended!', 'success');
    closeModal('tournament-modal');
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onload = function() { updateBalanceDisplay(); updateRandomRateStatusDisplay(); };
</script>
</body>
</html>\`;

// API routes
app.get('/', (req, res) => { res.send(htmlContent); });

// सर्वर स्टार्ट
app.listen(port, '0.0.0.0', () => { 
    console.log("Server running on port " + port); 
});

// कीप-अलाइव पिंग (ताकि सर्वर सोए नहीं)
setInterval(() => {
    axios.get('https://www.google.com').catch(() => {});
}, 600000);
