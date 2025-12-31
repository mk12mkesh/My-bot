const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Escape special characters to prevent crashes
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BDG WIN Tournament</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
/* ... (CSS remains unchanged) ... */
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
// --- USER & BALANCE ---
let userid = localStorage.getItem('userid') || 'USER' + Math.floor(Math.random() * 1000000);
localStorage.setItem('userid', userid);

document.getElementById('user-id-display').innerText = userid;

let balance = parseFloat(localStorage.getItem('balance_' + userid)) || 0; 
let totalDeposits = parseFloat(localStorage.getItem('total_deposits_' + userid)) || 0;
let totalWagered = parseFloat(localStorage.getItem('total_wagered_' + userid)) || 0;

// --- PIN USAGE TRACKING ---
let usedPinEpochs = JSON.parse(localStorage.getItem('used_pin_epochs_' + userid)) || [];

// --- HISTORY TRACKING ---
let depositHistory = JSON.parse(localStorage.getItem('depositHistory_' + userid)) || [];
let withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory_' + userid)) || [];

// --- TOURNAMENT VARIABLES ---
let tournamentActive = false;
let tournamentTime = 300; 
let tournamentRoundTime = 30;
let tournamentPlayers = [];
let tournamentBet = null;
let tournamentInterval = null;
let tournamentEntryAmount = 0; 
let savedTournamentState = null; 

// --- DEPOSIT COOLDOWN TRACKING ---
let lastDepositTime = parseInt(localStorage.getItem('lastDepositTime_' + userid)) || 0;
let lastDepositAmount = parseFloat(localStorage.getItem('lastDepositAmount_' + userid)) || 0;
// -------------------------------------

// --- 🚩 MODIFIED: RANDOM DISTRIBUTION SYSTEM ---
const TARGET_KEY = 'tournament_random_rate_data';
let randomRateData = JSON.parse(localStorage.getItem(TARGET_KEY)) || {
    isActive: false,      
    winRate: 0.30,        
    tournamentsPlayed: 0, 
    targetAmount: 0      
};

const DEFAULT_WIN_RATE = 0.30; 
let botBaseWinRate = 0.40; 


// ============ DYNAMIC PIN & WIN RATE SYNC LOGING ============

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
        // Clear used pins older than 1 hour
        usedPinEpochs = usedPinEpochs.filter(epoch => (currentTimestamp - (epoch * 30)) < 3600); 
        localStorage.setItem('used_pin_epochs_' + userid, JSON.stringify(usedPinEpochs));
    }
}
updateDynamicPin();
setInterval(updateDynamicPin, 1000); 


// 🚩 MODIFIED: Function to set the Random Rate Cycle (30% to 90%)
function setRandomRateCycle(controlCode, entryAmount) {
    const digit = parseInt(controlCode);
    let newWinRate = DEFAULT_WIN_RATE;
    
    // Check if the control digit is valid (2, 3, 4, 5, 8, 9)
    if (digit === 2 || digit === 3 || digit === 4 || digit === 5 || digit === 8 || digit === 9) {
        // The win rate is digit / 10. (e.g., 3 -> 0.30, 8 -> 0.80)
        newWinRate = digit / 10; 
        
        // Reset and set new random rate cycle data
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

// 🚩 MODIFIED LOGIC: Function to update the Home Screen Random Rate Status
function updateRandomRateStatusDisplay() {
    const el = document.getElementById('win-target-status');
    const rollover = Math.max(0, totalDeposits - totalWagered);

    if (randomRateData.isActive) {
        // const ratePercent = (randomRateData.winRate * 100).toFixed(0) + '%'; // Hiding the percentage text
        const remaining = 10 - randomRateData.tournamentsPlayed;
        el.style.color = '#2ecc71';
        // *** यहाँ बदलाव किया गया है ***
        el.innerHTML = \`✅ Remaining: ${remaining} Tournaments\`; 
        
    } else if (rollover <= 0) {
        // --- MODIFIED LOGIC: Rollover Complete, show success/withdrawal status, NO 30% TEXT ---
        randomRateData.winRate = DEFAULT_WIN_RATE; // Ensure 30% is maintained internally
        el.style.color = '#2ecc71'; 
        el.innerHTML = '🎉 **Rollover Complete!** | Withdrawal is now open.';
        
    } else {
        el.style.color = '#aaa';
        el.innerHTML = 'Rate Status: Off (Use PIN to set rate for 10 tournaments)';
    }
}


// --- UPDATE BALANCE DISPLAY ---
function updateBalanceDisplay() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('balance_' + userid, balance);
}

// --- NOTIFICATIONS ---
function showNotification(message, type) {
    const popup = document.getElementById('notification-popup');
    popup.innerText = message;
    popup.style.display = 'block'; 
    popup.style.backgroundColor = type === 'error' ? '#e74c3c' : (type === 'success' ? '#2ecc71' : '#f39c12');
    setTimeout(() => popup.style.display = 'none', 3000);
}

// --- HISTORY LOGIC (Unchanged) ---
function saveHistory(type, historyArray) {
    const limitedHistory = historyArray.slice(-5);
    localStorage.setItem(type + 'History_' + userid, JSON.stringify(limitedHistory));
    return limitedHistory;
}

function renderHistory(type) {
    const history = type === 'deposit' ? depositHistory : withdrawalHistory;
    const isDeposit = type === 'deposit';
    
    if (history.length === 0) {
        return '<p style="font-size: 14px; color: #aaa; margin-top: 10px; text-align: center;">No recent transactions.</p>';
    }

    let html = \`
        <h3>Recent Transactions</h3>
        <div class="transaction-list">
    \`;
    
    const reversedHistory = [...history].reverse();
    
    reversedHistory.forEach(item => {
        const statusClass = 'success'; 
        const typeClass = isDeposit ? 'deposit-tx' : 'withdrawal-tx';
        const amountColor = isDeposit ? '#2ecc71' : '#e74c3c';
        const icon = isDeposit ? '➕' : '➖';

        html += \`
            <div class="transaction-card ${typeClass}">
                <span class="tx-amount" style="color: ${amountColor};">
                    <span class="icon">${icon}</span>
                    ₹${item.amount}
                </span>
                <div class="tx-details">
                    <span class="tx-status ${statusClass}">Success</span>
                    <span class="tx-date">${item.date}</span>
                </div>
            </div>
        \`;
    });
    
    html += '</div>';
    return html;
}

// --- MODALS ---
function showModal(id) {
    document.getElementById(id + '-modal').style.display = 'block';
    
    if (id === 'withdrawal') {
        // 🚩 MODIFIED LOGIC: Always display Rollover Status
        const rollover = Math.max(0, totalDeposits - totalWagered);
        
        const rolloverDisplayEl = document.getElementById('rollover-display-amount');
        const rolloverStatusEl = document.getElementById('rollover-status-text');
        
        if (rollover > 0) {
            rolloverDisplayEl.innerText = '₹' + rollover.toFixed(2);
            rolloverStatusEl.innerText = 'Required Rollover Remaining';
            rolloverStatusEl.style.color = '#ffd700';
        } else {
            rolloverDisplayEl.innerText = 'Complete!';
            rolloverStatusEl.innerText = 'Rollover Status';
            rolloverStatusEl.style.color = '#2ecc71';
        }
        
        document.getElementById('withdrawal-history-container').innerHTML = renderHistory('withdrawal');
        
        // 🚩 REMOVED: No longer need to set placeholder showing User ID sum
        // document.getElementById('withdrawPin').placeholder = \`Sum of ${userid.replace('USER', '')} Digits\`;
    }
    if (id === 'deposit') {
        document.getElementById('deposit-history-container').innerHTML = renderHistory('deposit');
    }

    if (id === 'tournament') {
        updateTournamentEntryScreen();
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// --- UTILITY: Function to calculate the sum of User ID digits ---
function calculateUserIdSum() {
    const idDigits = userid.replace('USER', ''); 
    let sum = 0;
    for (let i = 0; i < idDigits.length; i++) {
        sum += parseInt(idDigits[i]);
    }
    return sum;
}


// ============ PIN VALIDATION LOGIC ============

// 🚩 MODIFIED: This function is now ONLY for Deposit/Rate Control (8-digit PIN)
function isDepositPinValid(fullPin, entryAmount = 0) {
    
    if (fullPin.length !== 8) {
        showNotification('🚨 Invalid PIN length. Must be 8 digits.', 'error');
        return false;
    }
    
    const pin = fullPin.substring(0, 6);
    const userIdCheckDigit = fullPin.substring(6, 7); 
    const controlCode = fullPin.substring(7, 8).trim(); 
    
    const currentUserIdLastDigit = userid.slice(-1); 
    
    // --- 2. Dynamic PIN Check (General Error) ---
    if (pin !== currentDynamicPin) {
        showNotification('🚨 Invalid PIN. Please check and try again.', 'error'); 
        return false;
    }

    // --- 3. PIN Reuse Check (General Error) ---
    if (usedPinEpochs.includes(currentPinEpoch)) {
        showNotification('🚨 Invalid PIN. Please check and try again.', 'error');
        return false;
    }
    
    // --- 4. User ID Verification Check (7th digit) (General Error) ---
    if (userIdCheckDigit && userIdCheckDigit !== currentUserIdLastDigit) {
        showNotification('🚨 Invalid PIN. Please check and try again.', 'error');
        return false;
    }
    
    // --- 5. Random Rate Control Check (8th digit) ---
    const digit = parseInt(controlCode);
    const validDigits = [2, 3, 4, 5, 8, 9]; 

    if (validDigits.includes(digit)) {
        // If valid, execute rate setting
        setRandomRateCycle(controlCode, entryAmount);
        
        // 🚩 CHANGE: REMOVED notification about the win rate being set.
        // const ratePercent = (digit * 10) + '%';
        // showNotification(\`Rate set! ${ratePercent} chance for the next 10 tournaments.\`, 'success'); 
    } else {
         // 🚩 MODIFIED: Simplified, generic error message for Control Code
         showNotification('🚨 Invalid PIN. Please check and try again.', 'error'); 
         return false;
    }
    
    recordPinUsage(); 
    return true;
}

function recordPinUsage() {
    usedPinEpochs.push(currentPinEpoch);
    localStorage.setItem('used_pin_epochs_' + userid, JSON.stringify(usedPinEpochs));
    updateDynamicPin(); 
}

// --- DEPOSIT / WITHDRAWAL ---

function handleDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    // यूज़र द्वारा इनपुट किया गया योग (PIN + Amount)
    const userEnteredSum = document.getElementById('depositPin').value.trim(); 

    if (amount < 100 || amount > 20000 || amount % 100 !== 0) {
        showNotification('Invalid amount (₹100 - ₹20,000, must be multiple of 100)', 'error');
        return;
    }
    
    // 🚩 NEW: 5-MINUTE COOLDOWN CHECK START
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (amount === lastDepositAmount && (currentTime - lastDepositTime) < fiveMinutes) {
        const remainingTimeSeconds = Math.ceil((fiveMinutes - (currentTime - lastDepositTime)) / 1000);
        const remainingMinutes = Math.ceil(remainingTimeSeconds / 60);
        
        showNotification(\`🚨 Please wait ${remainingMinutes} min. Same amount (₹${amount.toFixed(2)}) cannot be deposited for 5 minutes.\`, 'error');
        return;
    }
    // 🚩 NEW: 5-MINUTE COOLDOWN CHECK END

    if (userEnteredSum.length === 0) {
        showNotification('🚨 Please enter the Control PIN.', 'error');
        return;
    }
    
    // Check if the input is a valid number
    if (isNaN(parseFloat(userEnteredSum))) {
        showNotification('🚨 Invalid input. The PIN must be a number.', 'error');
        return;
    }

    const currentUserIdLastDigit = userid.slice(-1);
    
    // Check all possible valid Control Codes (2, 3, 4, 5, 8, 9)
    const validControlDigits = [2, 3, 4, 5, 8, 9];
    let validPinFound = false;
    let finalControlCode = 0;
    
    for (const digit of validControlDigits) {
        // Construct the expected 8-Digit PIN string
        const expectedPin8DigitsStr = currentDynamicPin + currentUserIdLastDigit + digit.toString();
        const expectedPin8Digits = parseInt(expectedPin8DigitsStr);
        
        // Calculate the expected sum
        const expectedSum = expectedPin8Digits + amount;
        
        // Check if the user's input matches the expected sum
        if (parseFloat(userEnteredSum) === expectedSum) {
            // Found a valid PIN structure and sum!
            validPinFound = true;
            finalControlCode = digit;
            break;
        }
    }
    
    if (!validPinFound) {
        // Check if the PIN was used in the current epoch, regardless of the control code
        const isUsed = usedPinEpochs.includes(currentPinEpoch);
        
        // Check if the base 7 digits are correct (Dynamic + User ID Digit)
        const isBasePinCorrect = validControlDigits.some(digit => {
             const expectedPin8DigitsStr = currentDynamicPin + currentUserIdLastDigit + digit.toString();
             const expectedPin8Digits = parseInt(expectedPin8DigitsStr);
             return expectedPin8Digits === parseFloat(userEnteredSum) - amount; // Check if the 8-digit PIN component is correct
        });

        if (isUsed) {
            showNotification('🚨 Invalid PIN. Please check and try again.', 'error'); // Generic error for used PIN
        } else {
             // 🎯 यहाँ बदलाव किया गया है: विस्तृत तकनीकी जानकारी हटा दी गई (सिर्फ "Invalid PIN..." दिखना चाहिए)
             showNotification('🚨 Invalid PIN. Please check and try again.', 'error'); // <--- यह वह लाइन है जिसे बदला गया है
        }
        
        document.getElementById('depositPin').value = '';
        return;
    }

    // 2. Perform the win-rate update based on the found valid Control Code
    setRandomRateCycle(finalControlCode.toString(), amount); 
    
    // 3. Check PIN Reuse (This check should ideally happen before rate setting, but since we iterate over
    // all possibilities to find the PIN, we check it here right before recording use)
    if (usedPinEpochs.includes(currentPinEpoch)) {
        showNotification('🚨 Invalid PIN. Please check and try again.', 'error');
        document.getElementById('depositPin').value = '';
        return;
    }

    // 4. Record usage and proceed with deposit
    recordPinUsage(); 

    balance += amount;
    totalDeposits += amount;
    localStorage.setItem('total_deposits_' + userid, totalDeposits);
    
    // 🚩 NEW: Update the last deposit time and amount upon success
    lastDepositAmount = amount;
    lastDepositTime = currentTime; 
    localStorage.setItem('lastDepositAmount_' + userid, lastDepositAmount);
    localStorage.setItem('lastDepositTime_' + userid, lastDepositTime);
    // -------------------------------------------------------------

    const now = new Date();
    depositHistory.push({ 
        amount: amount.toFixed(2), 
        date: now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
    });
    depositHistory = saveHistory('deposit', depositHistory);

    updateBalanceDisplay();
    updateRandomRateStatusDisplay();
    closeModal('deposit-modal');
    document.getElementById('depositPin').value = '';
    
    showNotification(\`₹${amount.toFixed(2)} deposited successfully!\`, 'success');
}

function handleWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const withdrawalPin = document.getElementById('withdrawPin').value;
    const rollover = Math.max(0, totalDeposits - totalWagered); 
    
    // 🚩 CRITICAL CHANGE: Withdrawal PIN check simplified
    const requiredPin = calculateUserIdSum();
    
    if (parseInt(withdrawalPin) !== requiredPin) {
        // 🚩 MODIFIED POP-UP HERE
        showNotification('🚨 Incorrect PIN.', 'error'); 
        document.getElementById('withdrawPin').value = '';
        return;
    }
    
    // Rollover check
    if (rollover > 0) {
        showNotification(\`Rollover required: Wager ₹${rollover.toFixed(2)} more\`, 'error');
        return;
    }
    
    if (amount > balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    if (amount >= 200 && amount <= 10000) {
        
        balance -= amount;

        const now = new Date();
        withdrawalHistory.push({ 
            amount: amount.toFixed(2), 
            date: now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) 
        });
        withdrawalHistory = saveHistory('withdrawal', withdrawalHistory);

        updateBalanceDisplay();
        closeModal('withdrawal-modal');
        showNotification(\`₹${amount.toFixed(2)} withdrawn!\`, 'success');
        document.getElementById('withdrawPin').value = '';
    } else {
        showNotification('Invalid amount (₹200 - ₹10,000)', 'error');
    }
}

// --- UTILITY ---

function generatePeriodNumber() {
    const now = new Date();
    const y = (now.getFullYear() % 100).toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    const h = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    const round = Math.floor(now.getTime() / (30 * 1000)) % 100000;
    return \`${y}${m}${d}${h}${min}${s}${round}\`;
}

function getColorForNumber(num) {
    if (num === 0) return 'violet-green';
    if (num === 5) return 'violet-red';
    return num % 2 === 1 ? 'green' : 'red';
}

function calculateWin(choice, resultNumber, betAmount) {
    const color = getColorForNumber(resultNumber);
    const isSmall = resultNumber < 5;
    const isBig = resultNumber >= 5;
    
    if (choice === 'Green' && (color === 'green' || color === 'violet-green')) 
        return { won: true, payout: betAmount * (color === 'violet-green' ? 1.5 : 1.95) };
    if (choice === 'Red' && (color === 'red' || color === 'violet-red')) 
        return { won: true, payout: betAmount * (color === 'violet-red' ? 1.5 : 1.95) };
    if (choice === 'Violet' && (color === 'violet-green' || color === 'violet-red')) 
        return { won: true, payout: betAmount * 4.5 };
    if (choice === 'Big' && isBig) return { won: true, payout: betAmount * 1.95 };
    if (choice === 'Small' && isSmall) return { won: true, payout: betAmount * 1.95 };
    
    return { won: false, payout: 0 };
}

function generateBotName() {
    const prefixes = ['Player', 'User', 'Gamer', 'Pro', 'Lucky', 'Winner', 'Ace', 'Joker']; 
    const num = Math.floor(Math.random() * 900000) + 100000; 
    return prefixes[Math.floor(Math.random() * prefixes.length)] + num;
}

function setEntryAmount(amount) {
    document.getElementById('tournamentAmount').value = amount;
    document.querySelectorAll('#tournament-entry-screen .preset-btn').forEach(b => b.classList.remove('active'));
    
    // Highlight the button corresponding to the amount, if it exists
    const activePreset = document.querySelector(\`#tournament-entry-screen .preset-btn[onclick*="${amount}"]\`);
    if (activePreset) {
        activePreset.classList.add('active');
    }
    
    updateTournamentEntryScreen();
}

function setTournamentBetAmount(amount) {
    const input = document.getElementById('currentBetAmount');
    input.value = amount;
    
    document.querySelectorAll('#tournament-bet-section .entry-presets .preset-btn').forEach(b => b.classList.remove('active'));
    const activePreset = document.querySelector(\`#tournament-bet-section .preset-btn[onclick*="setTournamentBetAmount(${amount})"]\`);
    if(activePreset) {
        activePreset.classList.add('active');
    } else {
        // Fallback to highlighting the min button if custom amount is set
        document.querySelector(\`#tournament-bet-section .preset-btn[onclick*="10"]\`).classList.add('active');
    }
    
    updateTournamentBetInfo();
}

function updateTournamentEntryScreen() {
    const amount = parseInt(document.getElementById('tournamentAmount').value) || 100; 
    
    const activePreset = document.querySelector('#tournament-entry-screen .preset-btn.active');
    if (activePreset && parseInt(activePreset.innerText.replace('₹', '')) !== amount) {
        document.querySelectorAll('#tournament-entry-screen .preset-btn').forEach(b => b.classList.remove('active'));
    }

    document.getElementById('join-btn-amount').innerText = amount;
    
    const insufficientMsg = document.getElementById('insufficient-balance-msg');
    if (balance < amount) {
        insufficientMsg.style.display = 'block';
    } else {
        insufficientMsg.style.display = 'none';
    }
}

// 🚩 NEW: TOURNAMENT BETTING LOGIC
function placeTournamentBet(choice) {
    const user = tournamentPlayers.find(p => p.isUser);
    const betAmount = parseInt(document.getElementById('currentBetAmount').value) || 10;
    
    if (!user || !tournamentActive || tournamentTime <= 0) {
        showNotification('Tournament not active.', 'error');
        return;
    }
    
    if (tournamentRoundTime <= 3) {
        showNotification('Betting closed for this round!', 'error');
        return;
    }
    
    if (tournamentBet !== null) {
        showNotification('You can only place one bet per round.', 'error');
        return;
    }

    if (user.balance < betAmount) {
        showNotification(\`Insufficient tournament balance (₹${user.balance.toFixed(0)}).\`, 'error');
        return;
    }
    
    // Bet Placed Successfully
    tournamentBet = {
        choice: choice,
        amount: betAmount
    };

    document.getElementById('t-current-bet').style.display = 'block';
    document.getElementById('t-bet-choice').innerText = \`${choice} (₹${betAmount})\`;
    
    showNotification(\`Bet placed on ${choice} for ₹${betAmount}!\`, 'success');
    
    saveTournamentState();
}
// ---------------------------------


// ======================================================
// START: Tournament State Management
// ======================================================

function saveTournamentState() {
    if (tournamentActive) {
        const state = {
            active: tournamentActive,
            time: tournamentTime,
            roundTime: tournamentRoundTime,
            players: tournamentPlayers,
            bet: tournamentBet,
            entry: tournamentEntryAmount,
            timestamp: Date.now() 
        };
        localStorage.setItem('tournament_state_' + userid, JSON.stringify(state));
        localStorage.setItem(TARGET_KEY, JSON.stringify(randomRateData)); // Save Rate Data
    }
}

function loadTournamentState() {
    const savedStateStr = localStorage.getItem('tournament_state_' + userid);
    if (!savedStateStr) return false;

    const state = JSON.parse(savedStateStr);
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000); 

    if (state.timestamp < thirtyMinutesAgo || state.time <= 0) {
        localStorage.removeItem('tournament_state_' + userid);
        return false;
    }

    savedTournamentState = state; 
    return true; 
}

function restoreTournamentFromSavedState() {
    if (!savedTournamentState) {
        showNotification('No active tournament to restore.', 'error');
        return;
    }

    const state = savedTournamentState;
    
    tournamentActive = true; 
    tournamentTime = state.time;
    tournamentRoundTime = state.roundTime;
    tournamentPlayers = state.players;
    tournamentBet = state.bet;
    tournamentEntryAmount = state.entry;

    // Restore Rate Data
    randomRateData = JSON.parse(localStorage.getItem(TARGET_KEY)) || randomRateData;
    updateRandomRateStatusDisplay();

    const modal = document.getElementById('tournament-modal');
    modal.style.display = 'block';
    
    document.getElementById('tournament-entry-screen').style.display = 'none';
    document.getElementById('tournament-game-screen').style.display = 'flex'; 
    document.getElementById('tournament-result-screen').style.display = 'none';
    
    const userBetAmount = tournamentBet ? tournamentBet.amount : 10; 
    document.getElementById('currentBetAmount').value = userBetAmount;
    setTournamentBetAmount(userBetAmount); 
    
    updateTournamentPlayersDisplay();
    updateTournamentBetInfo();
    
    if (tournamentBet) {
        document.getElementById('t-current-bet').style.display = 'block';
        document.getElementById('t-bet-choice').innerText = \`${tournamentBet.choice} (₹${tournamentBet.amount})\`;
    } else {
         document.getElementById('t-current-bet').style.display = 'none';
    }

    if (tournamentTime < 300) {
        document.getElementById('last-result-number').style.display = 'inline';
    }
    
    showNotification('Tournament resumed.', 'success');
    
    restartTournamentInterval();
    
    savedTournamentState = null; 
    
    document.getElementById('active-tournament-message').style.display = 'none';
    document.getElementById('start-new-tournament-section').style.display = 'block'; 
}

function continueTournament() {
    if (savedTournamentState) {
        restoreTournamentFromSavedState();
    } else {
        showNotification('No active tournament found to continue.', 'error');
    }
}

function restartTournamentInterval() {
    if (tournamentInterval) {
        clearInterval(tournamentInterval);
    }
    
    tournamentInterval = setInterval(() => {
        
        if (tournamentTime <= 0) {
            endTournament();
            return;
        }
        
        saveTournamentState(); 
        
        tournamentTime--;
        tournamentRoundTime--;
        
        const mins = Math.floor(tournamentTime / 60);
        const secs = tournamentTime % 60;
        const mainTimer = document.getElementById('tournament-main-timer');
        mainTimer.innerText = \`${mins}:${secs.toString().padStart(2, '0')}\`;
        mainTimer.className = 'tournament-main-timer' + (tournamentTime <= 30 ? ' warning' : '');
        
        const roundTimer = document.getElementById('tournament-round-timer');
        roundTimer.innerText = tournamentRoundTime <= 0 ? '0s' : tournamentRoundTime + 's';
        roundTimer.className = 'tournament-round-timer' + (tournamentRoundTime <= 3 ? ' warning' : '');
        
        document.getElementById('tournament-period').innerText = 'T' + generatePeriodNumber().slice(-6);
        
        if (tournamentRoundTime <= 0) {
            processTournamentRound();
            tournamentRoundTime = 30;
        }
        
        const btns = document.querySelectorAll('.t-bet-btn');
        btns.forEach(btn => {
            btn.disabled = tournamentRoundTime <= 3 || tournamentBet !== null;
        });
        
    }, 1000);
}

// ======================================================
// END: Tournament State Management
// ======================================================

function startTournament() {
    const entryAmount = parseInt(document.getElementById('tournamentAmount').value) || 100;
    
    if (entryAmount < 100 || entryAmount > 20000 || entryAmount % 100 !== 0) {
        showNotification('Invalid entry amount (₹100 - ₹20,000)', 'error');
        return;
    }
    
    if (balance < entryAmount) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    tournamentEntryAmount = entryAmount;

    // 🚩 ROLOVER UPDATE: Rollover reduction happens upon JOINING (entryAmount)
    totalWagered += entryAmount;
    localStorage.setItem('total_wagered_' + userid, totalWagered);
    
    // 🚩 CRITICAL MODIFICATION: Rollback logic (Rollover Override)
    const rollover = Math.max(0, totalDeposits - totalWagered);
    
    if (randomRateData.isActive) {
        randomRateData.tournamentsPlayed++;
        
        // Check if 10 tournaments are completed
        if (randomRateData.tournamentsPlayed >= 10) {
             // const ratePercent = (randomRateData.winRate * 100).toFixed(0) + '%'; // REMOVED WIN RATE DISCLOSURE
             // showNotification(\`🎯 10 Tournament Cycle Complete! ${ratePercent} rate ended.\`, 'success'); // REMOVED WIN RATE DISCLOSURE
             randomRateData.isActive = false;
             randomRateData.winRate = DEFAULT_WIN_RATE; // Set to default 30%
        }
    } 
    
    // 🚩 NEW PRIORITY LOGIC: Rollover Complete? ALWAYS set to 30% (Overriding Active Cycle)
    if (rollover <= 0) {
        // Rollback any active cycle and enforce 30% immediately
        if (randomRateData.isActive) {
             // showNotification(\`🎯 Rollover Complete! ${randomRateData.winRate*100}% rate cancelled.\`, 'success'); // REMOVED WIN RATE DISCLOSURE
        }
        randomRateData.isActive = false;
        randomRateData.winRate = DEFAULT_WIN_RATE; // Set to default 30%
    } else if (!randomRateData.isActive) {
        // If rollover is pending and no PIN is active, maintain default 30%
        randomRateData.winRate = DEFAULT_WIN_RATE;
    }
    
    localStorage.setItem(TARGET_KEY, JSON.stringify(randomRateData)); // Save updated rate data
    updateRandomRateStatusDisplay();

    balance -= entryAmount;
    updateBalanceDisplay();
    
    tournamentPlayers = [
        { name: 'You', isUser: true, balance: entryAmount, lastChoice: null },
        { name: generateBotName(), isUser: false, balance: entryAmount, lastChoice: null },
        { name: generateBotName(), isUser: false, balance: entryAmount, lastChoice: null }
    ];
    
    tournamentActive = true;
    tournamentTime = 300;
    tournamentRoundTime = 30;
    tournamentBet = null;
    
    document.getElementById('tournament-entry-screen').style.display = 'none';
    document.getElementById('tournament-game-screen').style.display = 'flex'; 
    document.getElementById('tournament-result-screen').style.display = 'none';
    document.getElementById('last-result-number').style.display = 'none'; 
    
    document.getElementById('currentBetAmount').value = 10; 
    document.querySelectorAll('#tournament-bet-section .entry-presets .preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('#tournament-bet-section .preset-btn[onclick*="10"]').classList.add('active');
    
    updateTournamentPlayersDisplay();
    updateTournamentBetInfo();
    
    showNotification('Tournament started! 5 minutes to play!', 'success');
    
    saveTournamentState();
    restartTournamentInterval();
    
    document.getElementById('active-tournament-message').style.display = 'none'; 
    document.getElementById('start-new-tournament-section').style.display = 'block'; 
}

function updateTournamentPlayersDisplay() {
    const container = document.getElementById('tournament-players');
    const sorted = [...tournamentPlayers].sort((a, b) => b.balance - a.balance);
    
    container.innerHTML = sorted.map((player, i) => \`
        <div class="tournament-player ${i === 0 ? 'winner' : ''} ${player.isUser ? 'user' : ''}">
            <span class="player-rank">${i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}</span>
            <span class="player-name ${player.isUser ? 'user-name' : ''}">${player.name}</span>
            <span class="player-balance">₹${player.balance.toFixed(0)}</span>
        </div>
    \`).join('');
}

function updateTournamentBetInfo() {
    const user = tournamentPlayers.find(p => p.isUser);
    const betAmount = parseInt(document.getElementById('currentBetAmount').value) || 10; 

    if (user) {
        document.getElementById('t-user-balance').innerText = user.balance.toFixed(0);
        document.getElementById('t-bet-amount').innerText = betAmount;
    }
}

function processTournamentRound() {
    const resultNumber = Math.floor(Math.random() * 10);
    
    document.getElementById('last-number-display').style.display = 'block';
    const numEl = document.getElementById('last-result-number');
    numEl.innerText = resultNumber;
    numEl.style.display = 'inline';
    const color = getColorForNumber(resultNumber);
    numEl.className = 'last-number ' + (color.includes('green') ? 'green' : color.includes('red') ? 'red' : 'violet');
    
    
    // Bot outcome uses a constant 40% win rate to ensure user logic is isolated
    const botControlWinRate = 0.40; 
    
    tournamentPlayers = tournamentPlayers.map(player => {
        if (player.isUser) {
            if (tournamentBet) {
                // User bet processing
                const { won, payout } = calculateWin(tournamentBet.choice, resultNumber, tournamentBet.amount);
                
                if (won) {
                    return { ...player, balance: player.balance + payout - tournamentBet.amount };
                } else {
                    return { ...player, balance: Math.max(0, player.balance - tournamentBet.amount) };
                }
            }
        } else {
            // 🚩 CRITICAL CHANGE: BOT LOGIC MODIFIED TO USE MINIMUM ₹10 BET AND 1.95x/4.5x PAYOUTS
            
            // 1. Determine Bot Bet Amount (min 10, max 20% of balance, capped at 10% of entry fee)
            const maxBotBet = Math.min(player.balance * 0.2, tournamentEntryAmount * 0.1);
            const botBetAmount = Math.max(10, Math.floor(maxBotBet / 10) * 10); // Enforce minimum ₹10 and round to nearest 10
            
            if (player.balance < botBetAmount) {
                // If bot can't afford ₹10, they don't bet this round.
                return player;
            }

            // 2. Determine Bot Choice (60% chance to bet on Major (G/R), 40% chance on Minor (B/S) or Violet)
            const choices = ['Green', 'Red', 'Big', 'Small', 'Violet'];
            let botChoice = choices[Math.floor(Math.random() * choices.length)];
            
            if (Math.random() < 0.6) { // 60% chance to bet on G/R
                botChoice = Math.random() < 0.5 ? 'Green' : 'Red';
            } else if (Math.random() < 0.5) { // 20% chance to bet on V
                 botChoice = 'Violet';
            } else { // 20% chance to bet on B/S
                 botChoice = Math.random() < 0.5 ? 'Big' : 'Small';
            }
            
            // 3. Process Bot Win/Loss using the same logic as the user (calculateWin)
            const { won, payout } = calculateWin(botChoice, resultNumber, botBetAmount);
            
            if (won) {
                 return { ...player, balance: player.balance + payout - botBetAmount };
            } else {
                 return { ...player, balance: Math.max(0, player.balance - botBetAmount) };
            }
        }
        return player;
    });
    
    tournamentBet = null;
    document.getElementById('t-current-bet').style.display = 'none';
    
    // --- 🚩 Check and set 30% rate if Rollover is complete ---
    const rollover = Math.max(0, totalDeposits - totalWagered);
    
    if (rollover <= 0) {
        // Rollback any active cycle and enforce 30% immediately
        randomRateData.isActive = false;
        randomRateData.winRate = DEFAULT_WIN_RATE; // Set to default 30%
    } else if (!randomRateData.isActive) {
        // If not active and rollover is pending, keep at default 30%
        randomRateData.winRate = DEFAULT_WIN_RATE;
    }

    updateTournamentPlayersDisplay();
    updateTournamentBetInfo();
    updateRandomRateStatusDisplay();
    
    saveTournamentState(); 
}

function endTournament() {
    clearInterval(tournamentInterval);
    tournamentActive = false;
    localStorage.removeItem('tournament_state_' + userid); 
    savedTournamentState = null; 
    
    const user = tournamentPlayers.find(p => p.isUser);
    const bots = tournamentPlayers.filter(p => !p.isUser);
    
    let userWinRate = randomRateData.winRate; 

    // --- Determine Winner based on RANDOM PROBABILITY (Internal Control) ---
    let userShouldWin = Math.random() < userWinRate;
    
    // --- 🚩 MODIFIED LOGIC FOR PERCEIVED FAIRNESS 🚩 ---
    
    if (user && bots.length > 0) {
        
        // 1. Get the current maximum balance among all players
        let maxCurrentBalance = Math.max(...tournamentPlayers.map(p => p.balance));
        
        if (userShouldWin) {
            // CONTROL: If the user is supposed to win (high rate), ensure their balance is highest.
            
            if (user.balance < maxCurrentBalance) {
                // If user's balance is lower than a bot, quietly lower the bot's balance.
                
                bots.forEach(bot => {
                    // Ensure all bot balances are slightly less than the user's balance.
                    // This creates the illusion that the user won by skill.
                    if (bot.balance > user.balance) {
                        bot.balance = user.balance - (Math.random() * 50 + 10); // Lower bot balance slightly below user's
                    }
                });
                user.balance = maxCurrentBalance + (Math.random() * 50 + 10); // Ensure user is the new max
            }
            // If user's balance is already the highest, no change is needed.
            
        } else {
            // CONTROL: If the user is supposed to lose (low rate), ensure a bot's balance is highest.
            
            // Find the current highest balance and the bot who has it
            const highestBot = bots.reduce((prev, current) => (prev.balance > current.balance) ? prev : current, { balance: 0 });
            
            if (user.balance > highestBot.balance) {
                // If user's balance is currently highest, quietly raise one bot's balance.
                const losingBotIndex = Math.floor(Math.random() * bots.length);
                
                // The bot that wins should have a balance slightly higher than the user.
                bots[losingBotIndex].balance = user.balance + (Math.random() * 50 + 10);
            }
            // If a bot's balance is already higher, no change is needed.
        }
    }
    
    updateRandomRateStatusDisplay();
    
    // The final result is now based on the (potentially adjusted) final balance
    const sorted = [...tournamentPlayers].sort((a, b) => b.balance - a.balance);
    const winner = sorted[0];
    
    document.getElementById('tournament-game-screen').style.display = 'none';
    document.getElementById('tournament-result-screen').style.display = 'block';
    
    const resultBox = document.getElementById('tournament-result-box');
    const titleEl = document.getElementById('result-title');
    const prizeEl = document.getElementById('result-prize');
    const noteEl = document.getElementById('result-note');
    
    if (winner.isUser) {
        const entryAmount = tournamentEntryAmount; 
        const prize = entryAmount * 2.35; 
        
        balance += prize; 
        updateBalanceDisplay();
        
        resultBox.className = 'tournament-result win';
        titleEl.className = 'result-title win';
        titleEl.innerText = '🏆 YOU WON! 🏆';
        prizeEl.innerText = '+₹' + prize.toFixed(0);
        noteEl.innerText = 'No Rollover Applied! Prize added to wallet.';
        noteEl.style.display = 'block';
        
        showNotification(\`🏆 You won ₹${prize.toFixed(0)}!\`, 'success');
    } else {
        // Find the user's rank
        const userRank = sorted.findIndex(p => p.isUser) + 1;
        
        resultBox.className = 'tournament-result lose';
        titleEl.className = 'result-title lose';
        
        if (userRank === 2) {
             prizeEl.innerText = 'Second Place! Better luck next time.';
             titleEl.innerText = '🥈 CLOSE CALL 🥈';
        } else {
             prizeEl.innerText = winner.name + ' won with ₹' + winner.balance.toFixed(0);
             titleEl.innerText = '❌ YOU LOST ❌';
        }
        
        noteEl.style.display = 'none';
        
        showNotification(winner.name + ' won the tournament!', 'error');
    }
    
    document.getElementById('final-players').innerHTML = sorted.map((player, i) => \`
        <div class="tournament-player ${i === 0 ? 'winner' : (player.isUser ? 'user' : 'loser')}">
            <span class="player-rank">${i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}</span>
            <span class="player-name ${player.isUser ? 'user-name' : ''}">${player.name}</span>
            <span class="player-balance">₹${player.balance.toFixed(0)}</span>
        </div>
    \`).join('');
}

function resetTournament() {
    tournamentActive = false;
    tournamentPlayers = [];
    tournamentBet = null;
    tournamentEntryAmount = 0; 
    localStorage.removeItem('tournament_state_' + userid); 
    savedTournamentState = null; 
    
    document.getElementById('tournament-entry-screen').style.display = 'block';
    document.getElementById('tournament-game-screen').style.display = 'none';
    document.getElementById('tournament-result-screen').style.display = 'none';
    
    document.getElementById('start-new-tournament-section').style.display = 'block'; 
    document.getElementById('active-tournament-message').style.display = 'none'; 
    
    document.getElementById('currentBetAmount').value = 10;
    document.querySelectorAll('#tournament-bet-section .entry-presets .preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('#tournament-bet-section .preset-btn[onclick*="10"]').classList.add('active');
    
    updateTournamentEntryScreen();
    closeModal('tournament-modal'); 
}


// --- INIT ---

window.onload = function() {
    updateBalanceDisplay();
    updateDynamicPin(); 
    
    // Load random rate data on startup
    randomRateData = JSON.parse(localStorage.getItem(TARGET_KEY)) || randomRateData;
    updateRandomRateStatusDisplay(); // Update the status display on the home screen
    
    // Load last deposit data on startup
    lastDepositTime = parseInt(localStorage.getItem('lastDepositTime_' + userid)) || 0;
    lastDepositAmount = parseFloat(localStorage.getItem('lastDepositAmount_' + userid)) || 0;


    const tournamentFound = loadTournamentState(); 

    document.getElementById('tournament-modal').style.display = 'none';
    document.getElementById('deposit-modal').style.display = 'none';
    document.getElementById('withdrawal-modal').style.display = 'none';
    document.getElementById('rules-modal').style.display = 'none';


    if (tournamentFound) {
        document.getElementById('active-tournament-message').style.display = 'block';
        document.getElementById('start-new-tournament-section').style.display = 'none';
    } else {
        document.getElementById('active-tournament-message').style.display = 'none';
        document.getElementById('start-new-tournament-section').style.display = 'block';
    }
    
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
             if (event.target.id === 'tournament-modal' && (tournamentActive || savedTournamentState)) {
                return; 
             }
             event.target.style.display = 'none';
        }
    }
    
    // Set default entry amount to 100 on load (the minimum allowed value)
    document.getElementById('tournamentAmount').value = 100;
    setEntryAmount(100); 
    updateTournamentEntryScreen(); 
};
</script>
</body>
</html>
`;

app.get('/', (req, res) => { 
    res.send(htmlContent); 
});

// Render compatibility: Host 0.0.0.0 is mandatory
app.listen(port, '0.0.0.0', () => { 
    console.log("Server running on port " + port); 
    
    // 24/7 Keep-Alive Activity Logic
    setInterval(async () => {
        try {
            // Priority: Self-ping via Environment Variable, Backup: External API
            const pingUrl = process.env.RENDER_EXTERNAL_URL || 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
            await axios.get(pingUrl);
            console.log("Activity: Ping successful, keeping server awake...");
        } catch (e) { 
            console.log("Activity: Ping heartbeat active"); 
        }
    }, 600000); // 10 minutes interval to prevent sleep
});
