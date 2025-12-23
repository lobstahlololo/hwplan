// Data Initialization
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

// --- TAB SYSTEM ---
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- TRACKER LOGIC ---
function addAssignment() {
    const name = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const priority = parseInt(document.getElementById('priorityInput').value);

    if (!name || !date) return alert("Fill in all fields!");

    assignments.push({ id: Date.now(), name, date, priority });
    saveAndRender();
    
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

function saveAndRender() {
    // Sort by Date, then by Priority
    assignments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA - dateB !== 0) return dateA - dateB;
        return b.priority - a.priority; // Higher priority (3) first
    });

    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderTable();
}

function renderTable() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";
    assignments.forEach(task => {
        const pLabels = {3: "High", 2: "Medium", 1: "Low"};
        list.innerHTML += `
            <tr>
                <td style="font-weight:600">${task.name}</td>
                <td style="color:#64748b">${task.date}</td>
                <td><span class="badge prio-${task.priority}">${pLabels[task.priority]}</span></td>
                <td style="text-align:right"><button class="add-btn" style="background:#fee2e2; color:#ef4444; padding:5px 10px" onclick="deleteTask(${task.id})">Done</button></td>
            </tr>`;
    });
}

function deleteTask(id) {
    assignments = assignments.filter(t => t.id !== id);
    saveAndRender();
}

// --- TIMER LOGIC ---
let timer;
let timeLeft = 1500;
let isRunning = false;

function toggleTimer() {
    const btn = document.getElementById('start-btn');
    if (isRunning) {
        clearInterval(timer);
        btn.innerText = "Start Session";
    } else {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Session complete! Time for a break.");
                resetTimer();
            }
        }, 1000);
        btn.innerText = "Pause";
    }
    isRunning = !isRunning;
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500;
    updateTimerDisplay();
    document.getElementById('start-btn').innerText = "Start Session";
}

// Run on load
renderTable();
