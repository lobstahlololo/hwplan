let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// --- SIDEBAR TAB SWITCHER ---
function showTab(tabId, event) {
    // Hide all sections
    document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
    // Deactivate all nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    // Show selected section
    document.getElementById(tabId + '-tab').classList.add('active');
    // Highlight clicked button
    event.currentTarget.classList.add('active');
}

// --- ASSIGNMENT LOGIC ---
function addAssignment() {
    const name = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const priority = parseInt(document.getElementById('priorityInput').value);

    if (!name || !date) return alert("Please fill in all fields.");

    assignments.push({ id: Date.now(), name, date, priority });
    saveAndRender();
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

function saveAndRender() {
    // Sort by Date, then by Priority
    assignments.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        if (d1 - d2 !== 0) return d1 - d2;
        return b.priority - a.priority;
    });

    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderTable();
}

function renderTable() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";
    assignments.forEach(task => {
        const prioNames = {3: 'High', 2: 'Medium', 1: 'Low'};
        const prioClass = {3: 'prio-3', 2: 'prio-2', 1: 'prio-1'}; // Use your existing badge classes
        list.innerHTML += `
            <tr>
                <td style="font-weight:600">${task.name}</td>
                <td>${task.date}</td>
                <td><span class="badge ${prioClass[task.priority]}">${prioNames[task.priority]}</span></td>
                <td style="text-align:right">
                    <button onclick="deleteTask(${task.id})" class="btn-secondary" style="color:#ef4444">Done</button>
                </td>
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
        btn.innerText = "Start";
    } else {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Study session over!");
                resetTimer();
            }
        }, 1000);
        btn.innerText = "Pause";
    }
    isRunning = !isRunning;
}

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500;
    updateTimerDisplay();
    document.getElementById('start-btn').innerText = "Start";
}

renderTable();
