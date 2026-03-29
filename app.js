const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let currentFilter = "all";

// 🧠 LOAD TASKS FROM STORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 💾 SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🔁 RENDER TASKS (MAIN ENGINE)
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <label>
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </label>
            <button class="delete">✖</button>
        `;

        const checkbox = li.querySelector("input");
        const deleteBtn = li.querySelector(".delete");

        // ✅ TOGGLE COMPLETE
        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // ❌ DELETE TASK
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });

    displayTasks(); // keep your filter logic
    updateStats();
}

// ➕ ADD TASK
function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// 🔍 FILTER TASKS
function filterTasks(event, filter) {
    currentFilter = filter;

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    displayTasks();
}

// 👁 DISPLAY TASKS (FILTER LOGIC)
function displayTasks() {
    const allTasks = document.querySelectorAll("#taskList li");

    allTasks.forEach(task => {
        const isCompleted = task.classList.contains("completed");

        if (currentFilter === "active") {
            task.style.display = isCompleted ? "none" : "flex";
        } 
        else if (currentFilter === "completed") {
            task.style.display = isCompleted ? "flex" : "none";
        } 
        else {
            task.style.display = "flex";
        }
    });
}

// 📊 UPDATE STATS
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    document.getElementById("total-count").textContent = total;
    document.getElementById("active-count").textContent = active;
    document.getElementById("completed-count").textContent = completed;

    const clearBtn = document.querySelector(".clear");

    if (completed === 0) {
        clearBtn.disabled = true;
        clearBtn.style.opacity = "0.5";
        clearBtn.style.cursor = "not-allowed";
    } else {
        clearBtn.disabled = false;
        clearBtn.style.opacity = "1";
        clearBtn.style.cursor = "pointer";
    }
}

// 🧹 CLEAR COMPLETED
document.querySelector(".clear").addEventListener("click", function () {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// ⌨️ ENTER KEY SUPPORT
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// 🚀 INITIAL LOAD
renderTasks();