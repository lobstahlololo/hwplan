// 1. Initialize data from LocalStorage
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// 2. Display the current date in the header
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
});

// 3. Main function to add a task
function addAssignment() {
    const name = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const priority = document.getElementById('priorityInput').value;

    if (!name || !date) {
        alert("Please fill in both the assignment name and the due date.");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: name,
        date: date,
        priority: parseInt(priority)
    };

    assignments.push(newTask);
    saveAndRender();
    
    // Clear inputs for next entry
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

// 4. Sort and Save function
function saveAndRender() {
    // MULTI-LEVEL SORT: Date first, then Priority
    assignments.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA - dateB !== 0) {
            return dateA - dateB; // Sort by earliest date
        }
        // If dates are the same, sort by priority (High 3 to Low 1)
        return b.priority - a.priority;
    });

    localStorage.setItem('assignments', JSON.stringify(assignments));
    renderTable();
}

// 5. Update the HTML table
function renderTable() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    assignments.forEach(task => {
        const priorityText = task.priority === 3 ? "High" : task.priority === 2 ? "Medium" : "Low";
        
        list.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${task.name}</td>
                <td>${task.date}</td>
                <td><span class="badge prio-${task.priority}">${priorityText}</span></td>
                <td style="text-align: right;">
                    <button class="done-btn" onclick="deleteTask(${task.id})">Complete</button>
                </td>
            </tr>
        `;
    });
}

// 6. Delete function
function deleteTask(id) {
    assignments = assignments.filter(task => task.id !== id);
    saveAndRender();
}
// --- Tab Switching Logic ---
function showTab(tabName) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected
    document.getElementById(tabName + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- Pomodoro Timer Logic ---
let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isRunning = false;

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').innerText = 
        `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        document.getElementById('start-btn').innerText = "Start";
    } else {
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up! Take a break.");
                resetTimer();
            }
        }, 1000);
        document.getElementById('start-btn').innerText = "Pause";
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 1500;
    updateTimerDisplay();
    document.getElementById('start-btn').innerText = "Start";
}

// Initial render when the page first loads
renderTable();

