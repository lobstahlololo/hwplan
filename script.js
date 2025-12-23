// --- DATA INITIALIZATION ---
// Load assignments from browser memory or start with an empty list
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Set the date in the header immediately
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

// --- SIDEBAR TAB SWITCHER ---
function showTab(tabId, event) {
    // 1. Hide all tab sections
    document.querySelectorAll('.tab-section').forEach(section => {
        section.classList.remove('active');
    });

    // 2. Deactivate all sidebar buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Show the requested section
    const activeSection = document.getElementById(tabId + '-tab');
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // 4. Highlight the clicked button
    event.currentTarget.classList.add('active');
}

// --- ASSIGNMENT TRACKER LOGIC ---
function addAssignment() {
    const nameInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const priorityInput = document.getElementById('priorityInput');

    if (!nameInput.value || !dateInput.value) {
        alert("Please enter both a name and a due date!");
        return;
    }

    const newTask = {
        id: Date.now(), // Unique ID for deleting
        name: nameInput.value,
        date: dateInput.value,
        priority: parseInt(priorityInput.value)
    };

    assignments.push(newTask);
    saveAndRender();

    // Clear the inputs
    nameInput.value = '';
    dateInput.value = '';
}

function saveAndRender() {
    // MULTI-LEVEL SORT: 1st by Date, 2nd by Priority (3 is higher than 1)
    assignments.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        if (d1 - d2 !== 0) return d1 - d2; 
        return b.priority - a.priority; 
    });

    // Save to LocalStorage
    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderTable();
}

function renderTable() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    assignments.forEach(task => {
        const prioNames = { 3: 'High', 2: 'Medium', 1: 'Low' };
        list.innerHTML += `
            <tr>
                <td style="font-weight:600">${task.name}</td>
                <td>${task.date}</td>
                <td><span class="badge prio-${task.priority}">${prioNames[task.priority]}</span></td>
                <td style="text-align:right">
                    <button onclick="deleteTask(${task.id})" class="btn-secondary" style="color:#ef4444; padding: 5px 10px; font-size: 12px;">Done</button>
                </td>
            </tr>`;
    });
}

function deleteTask(id) {
    assignments = assignments.filter(t => t.id !== id);
    saveAndRender();
}

// --- FOCUS TIMER & PROGRESS BAR LOGIC ---
let timer;
let totalTime = 1500; // 25 minutes in seconds
let timeLeft = 1500;
let isRunning = false;

function toggleTimer() {
    const btn = document.getElementById('start-btn');
    
    if (isRunning) {
        clearInterval(timer);
        btn.innerText = "Start";
        btn.style.background = "var(--primary)";
    } else {
        btn.innerText = "Pause";
        btn.style.background = "#94a3b8"; // Gray when paused
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerUI();
            } else {
                clearInterval(timer);
                alert("Time's up! Great session.");
                resetTimer();
            }
        }, 1000);
    }
    isRunning = !isRunning;
}

function updateTimerUI() {
    // 1. Update the numbers (00:00 format)
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
