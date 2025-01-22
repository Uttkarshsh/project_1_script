// Array to hold all tasks
let taskArray = [];

// Handle form submission
document.getElementById('task-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    // Prevent form from submitting

    const title = document.getElementById('task-title').value;
    const priority = document.getElementById('task-priority').value;
    const date = document.getElementById('task-date').value;

    // Create a new task object
    const task = {
        title: title,
        priority: priority,
        date: date
    };

    // Add the task to the task list without sorting immediately
    addTaskToList(task);

    // Clear the input fields
    document.getElementById('task-title').value = '';
    document.getElementById('task-priority').value = 'high'; // Reset to default
    document.getElementById('task-date').value = '';
});

// Function to add a task to the list and display it
function addTaskToList(task) {
    taskArray.push(task);
    renderTasks(taskArray); // Render tasks without sorting
    updateChart(); // Update the chart whenever a new task is added
}

// Function to render tasks in the "Recent Tasks" section
function renderTasks(tasks) {
    const recentTasks = document.getElementById('recent-tasks');
    recentTasks.innerHTML = ''; 
    // Clear the existing tasks

    if (tasks.length === 0) {
        recentTasks.innerHTML = '<p>No tasks assigned at this moment.</p>';
        return;
    }

    tasks.forEach(function (task, index) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            ${task.title} - ${task.priority} - ${task.date}
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        recentTasks.appendChild(li);
    });
}

// Delete a task from the list
function deleteTask(index) {
    taskArray.splice(index, 1);
    renderTasks(taskArray); // Render the tasks without sorting
    updateChart();
}

// Heapify function
function heapify(arr, n, i) {
    let largest = i;  // Initialize largest as root
    let left = 2 * i + 1;  // left = 2*i + 1
    let right = 2 * i + 2;  // right = 2*i + 2

    // Custom comparison for priority first and then date if priorities are equal
    function isHigherPriority(task1, task2) {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (priorityOrder[task1.priority] === priorityOrder[task2.priority]) {
            return new Date(task1.date) < new Date(task2.date); // Sort by date if priority is the same
        }
        return priorityOrder[task1.priority] > priorityOrder[task2.priority]; // Otherwise sort by priority
    }

    if (left < n && isHigherPriority(arr[left], arr[largest])) {
        largest = left;
    }

    if (right < n && isHigherPriority(arr[right], arr[largest])) {
        largest = right;
    }

    // Swap and continue heapifying if root is not largest
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// Function to perform heap sort
function heapSort(arr) {
    let n = arr.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // Move current root to end
        heapify(arr, i, 0); // Heapify the reduced heap
    }
}

// Sort tasks button to trigger heap sort
document.getElementById('sort-tasks-btn').addEventListener('click', function () {
    heapSort(taskArray);  // Sort tasks using heap sort only when this button is clicked
    renderTasks(taskArray); // Render sorted tasks
});

// Initialize and update the Chart.js pie chart
const ctx = document.getElementById('taskChart').getContext('2d');
const taskChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [{
            label: 'Task Priority Distribution',
            data: [0, 0, 0], // Initial data
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
            hoverOffset: 4
        }]
    }
});

// Update the pie chart based on the tasks
function updateChart() {
    const high = taskArray.filter(task => task.priority === 'high').length;
    const medium = taskArray.filter(task => task.priority === 'medium').length;
    const low = taskArray.filter(task => task.priority === 'low').length;

    taskChart.data.datasets[0].data = [high, medium, low];
    taskChart.update();
}
