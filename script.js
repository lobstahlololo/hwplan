let assignments = [];

function addAssignment() {
    const name = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const priority = document.getElementById('priorityInput').value;

    if (!name || !date) return alert("Please fill in all fields");

    const task = { name, date, priority: parseInt(priority), id: Date.now() };
    assignments.push(task);
    
    // Automated Sorting by Due Date
    assignments.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    assignments.forEach(task => {
        const priorityText = task.priority === 3 ? "High" : task.priority === 2 ? "Medium" : "Low";
        list.innerHTML += `
            <tr>
                <td>${task.name}</td>
                <td>${task.date}</td>
                <td class="prio-${task.priority}">${priorityText}</td>
                <td><button onclick="deleteTask(${task.id})" style="background:#ff4d4d">Done</button></td>
            </tr>
        `;
    });
}

function deleteTask(id) {
    assignments = assignments.filter(t => t.id !== id);
    renderTasks();
}