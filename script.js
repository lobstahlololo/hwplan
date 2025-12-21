// Load data from LocalStorage when the page opens
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Set current date in header
document.getElementById('date-display').innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function addAssignment() {
    const name = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const priority = document.getElementById('priorityInput').value;

    if (!name || !date) return alert("Please enter the assignment name and due date.");

    const task = { 
        name, 
        date, 
        priority: parseInt(priority), 
        id: Date.now() 
    };

    assignments.push(task);
    saveAndRender();
    
    // Clear inputs
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}

function saveAndRender() {
    // Sort by date
    assignments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Save to local storage
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    assignments.forEach(task => {
        const priorityLabel = task.priority === 3 ? "High" : task.priority === 2 ? "Medium" : "Low";
        list.innerHTML += `
            <tr>
                <td style="font-weight: 600;">${task.name}</td>
                <td style="color: #64748b;">${task.date}</td>
                <td><span class="badge prio-${task.priority}">${priorityLabel}</span></td>
                <td style="text-align: right;">
                    <button class="done-btn" onclick="deleteTask(${task.id})">Remove</button>
                </td>
            </tr>
        `;
    });
}

function deleteTask(id) {
    assignments = assignments.filter(t => t.id !== id);
    saveAndRender();
}

// Run render on load
renderTasks();
