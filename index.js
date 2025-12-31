const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000; // Render compatibility

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BDG WIN Tournament</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
/* CSS को छोटा रखा गया है ताकि कोड जल्दी लोड हो */
body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #1c1c1e; color: #fff; text-align: center; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; min-height: 100vh; overflow-x: hidden; }
.container { margin: 0 auto; width: 100%; max-width: 450px; background-color: #121212; box-shadow: 0 0 15px rgba(0, 0, 0, 0.7); min-height: 100vh; }
.top-bar { background-color: #181818; color: #ffd700; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; position: sticky; top: 0; z-index: 10; }
.wallet-section { padding: 20px 15px; background-color: #121212; border-bottom: 1px solid #333; }
.balance-display { color: #fff; font-size: 36px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; }
.wallet-buttons { display: flex; justify-content: space-between; gap: 15px; margin-top: 15px; }
.wallet-btn { width: 100%; padding: 12px; font-size: 16px; font-weight: bold; border: none; border-radius: 10px; cursor: pointer; }
.withdraw-btn { background-color: #c0392b; color: #fff; } 
.deposit-btn { background-color: #27ae60; color: #fff; }
.modal { display: none; position: fixed; z-index: 1001; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); overflow: auto; }
.modal-content { background-color: #2c2c2e; margin: 5% auto; padding: 20px; border-radius: 15px; width: 90%; max-width: 400px; }
.t-bet-btn { padding: 10px; font-weight: bold; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin: 2px; }
.t-btn-green { background-color: #2ecc71; } .t-btn-red { background-color: #e74c3c; } .t-btn-violet { background-color: #9b59b6; }
</style>
</head>
<body>
<div class="container">
    <div class="top-bar"><span>BDG WIN Tournament</span><span id="user-id-display"></span></div>
    <div class="wallet-section">
        <div class="balance-display">₹<span id="balance">0.00</span></div>
        <div class="wallet-buttons">
            <button class="wallet-btn withdraw-btn" onclick="showModal('withdrawal')">Withdraw</button>
            <button class="wallet-btn deposit-btn" onclick="showModal('deposit')">Deposit</button>
        </div>
    </div>
    <div id="win-target-status" style="padding:10px; font-size:14px;">Status: Loading...</div>
    <button class="wallet-btn" style="background:#ffd700; color:#000; width:80%; margin-top:20px;" onclick="showModal('tournament')">Start Tournament</button>
</div>

<div id="deposit-modal" class="modal"><div class="modal-content">
    <h2>Deposit</h2>
    <input type="number" id="depositAmount" placeholder="Amount" value="100">
    <input type="number" id="depositPin" placeholder="Enter PIN">
    <button onclick="handleDeposit()" style="width:100%; padding:10px; background:#27ae60; color:#fff; border:none; border-radius:5px;">Add Funds</button>
    <button onclick="closeModal('deposit-modal')" style="background:none; color:#aaa; border:none; margin-top:10px;">Close</button>
</div></div>

<div id="withdrawal-modal" class="modal"><div class="modal-content">
    <h2>Withdrawal</h2>
    <p id="rollover-text"></p>
    <input type="number" id="withdrawAmount" placeholder="Amount">
    <input type="number" id="withdrawPin" placeholder="PIN">
    <button onclick="handleWithdrawal()" style="width:100%; padding:10px; background:#c0392b; color:#fff; border:none; border-radius:5px;">Withdraw</button>
    <button onclick="closeModal('withdrawal-modal')" style="background:none; color:#aaa; border:none; margin-top:10px;">Close</button>
</div></div>

<div id="tournament-modal" class="modal"><div class="modal-content">
    <div id="tournament-entry-screen">
        <h2>Join Tournament</h2>
        <input type="number" id="tournamentAmount" value="100">
        <button onclick="startTournament()" style="width:100%; padding:15px; background:#ffd700; color:#000; border:none; border-radius:5px; font-weight:bold;">Enter Match</button>
    </div>
    <div id="tournament-game-screen" style="display:none;">
        <h1 id="t-timer">5:00</h1>
        <p>Round: <span id="r-timer">30</span>s</p>
        <div id="player-list" style="background:#1a1a1a; padding:10px; border-radius:10px; margin-bottom:10px;"></div>
        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr;">
            <button class="t-bet-btn t-btn-green" onclick="placeBet('Green')">Green</button>
            <button class="t-bet-btn t-btn-violet" onclick="placeBet('Violet')">Violet</button>
            <button class="t-bet-btn t-btn-red" onclick="placeBet('Red')">Red</button>
        </div>
    </div>
</div></div>

<script>
let userid = localStorage.getItem('userid') || 'USER' + Math.floor(Math.random() * 1000000);
localStorage.setItem('userid', userid);
document.getElementById('user-id-display').innerText = userid;

let balance = parseFloat(localStorage.getItem('bal_' + userid)) || 0;
let totalDeposits = parseFloat(localStorage.getItem('dep_' + userid)) || 0;
let totalWagered = parseFloat(localStorage.getItem('wag_' + userid)) || 0;
let tournamentActive = false;
let tournamentTime = 300;
let currentBet = null;

// Fix for Render: Use string concatenation instead of backticks inside backticks
function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('bal_' + userid, balance);
    const rollover = Math.max(0, totalDeposits - totalWagered);
    document.getElementById('win-target-status').innerText = rollover > 0 ? "Rollover Left: ₹" + rollover.toFixed(2) : "Ready for Withdrawal";
}

function showModal(id) { document.getElementById(id + '-modal').style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function handleDeposit() {
    const amt = parseFloat(document.getElementById('depositAmount').value);
    // Simple logic for Demo
    balance += amt;
    totalDeposits += amt;
    updateUI();
    closeModal('deposit-modal');
}

function handleWithdrawal() {
    const amt = parseFloat(document.getElementById('withdrawAmount').value);
    const roll = Math.max(0, totalDeposits - totalWagered);
    if(roll > 0) return alert("Complete Rollover first!");
    if(amt > balance) return alert("Low Balance!");
    balance -= amt;
    updateUI();
    closeModal('withdrawal-modal');
}

function startTournament() {
    const entry = parseInt(document.getElementById('tournamentAmount').value);
    if(balance < entry) return alert("Low Balance!");
    balance -= entry;
    totalWagered += entry;
    updateUI();
    tournamentActive = true;
    document.getElementById('tournament-entry-screen').style.display = 'none';
    document.getElementById('tournament-game-screen').style.display = 'block';
    
    let tInt = setInterval(() => {
        tournamentTime--;
        let m = Math.floor(tournamentTime/60);
        let s = tournamentTime%60;
        document.getElementById('t-timer').innerText = m + ":" + (s<10?'0':'') + s;
        if(tournamentTime <= 0) {
            clearInterval(tInt);
            alert("Tournament Ended!");
            location.reload();
        }
    }, 1000);
}

function placeBet(choice) {
    alert("Bet placed on " + choice);
}

updateUI();
</script>
</body>
</html>`;

app.get('/', (req, res) => { res.send(htmlContent); });

app.listen(port, '0.0.0.0', () => {
    console.log("Server running on port " + port);
});

// Keep-alive to prevent sleeping
setInterval(() => {
    axios.get('https://www.google.com').catch(() => {});
}, 600000);
