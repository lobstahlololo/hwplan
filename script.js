document.addEventListener('DOMContentLoaded', () => {
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    
    // Set Date
    const dateEl = document.getElementById('date-display');
    if(dateEl) dateEl.innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Tabs
    window.showTab = function(tabId, event) {
        document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId + '-tab').classList.add('active');
        event.currentTarget.classList.add('active');
    };

    // Tracker
    window.addAssignment = function() {
        const name = document.getElementById('taskInput').value;
        const date = document.getElementById('dateInput').value;
        const priority = parseInt(document.getElementById('priorityInput').value);

        if (!name || !date) return alert("Please fill in everything.");

        assignments.push({ id: Date.now(), name, date, priority });
        saveAndRender();
        document.getElementById('taskInput').value = '';
        document.getElementById('dateInput').value = '';
    };

    function saveAndRender() {
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
        if(!list) return;
        list.innerHTML = "";
        assignments.forEach(task => {
            const pLabels = {3: 'High', 2: 'Medium', 1: 'Low'};
            list.innerHTML += `
                <tr>
                    <td style="font-weight:600">${task.name}</td>
                    <td>${task.date}</td>
                    <td><span class="badge prio-${task.priority}">${pLabels[task.priority]}</span></td>
                    <td style="text-align:right">
                        <button onclick="deleteTask(${task.id})" class="btn-secondary" style="color:#ef4444">Done</button>
                    </td>
                </tr>`;
        });
    }

    window.deleteTask = function(id) {
        assignments = assignments.filter(t => t.id !== id);
        saveAndRender();
    };

    // Timer
    let timer;
    let timeLeft = 1500;
    let isRunning = false;

    window.toggleTimer = function() {
        const btn = document.getElementById('start-btn');
        if (isRunning) {
            clearInterval(timer);
            btn.innerText = "Start";
        } else {
            btn.innerText = "Pause";
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerUI();
                } else {
                    clearInterval(timer);
                    alert("Focus session complete!");
                    resetTimer();
                }
            }, 1000);
        }
        isRunning = !isRunning;
    };

    function updateTimerUI() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById('timer-display').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        const percent = ((1500 - timeLeft) / 1500) * 100;
        document.getElementById('progress-bar').style.width = percent + "%";
    }

    window.resetTimer = function() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 1500;
        updateTimerUI();
        document.getElementById('start-btn').innerText = "Start";
    };

    renderTable();
});
