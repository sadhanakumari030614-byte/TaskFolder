
// ========================================
// TASKFLOW - JAVASCRIPT
// ========================================


// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const taskForm = document.getElementById("taskForm");

const taskTitle = document.getElementById("taskTitle");

const priority = document.getElementById("priority");

const dueDate = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");

const titleError = document.getElementById("titleError");

const saveButton = document.getElementById("saveButton");

const cancelButton = document.getElementById("cancelButton");

const formHeading = document.getElementById("formHeading");

const successMessage =
    document.getElementById("successMessage");

const filterPriority =
    document.getElementById("filterPriority");

const taskCount =
    document.getElementById("taskCount");


// ========================================
// 2. TASK ARRAY
// ========================================

let tasks = [];


// ID of task currently being edited
let editingTaskId = null;


// ========================================
// 3. LOAD TASKS
// ========================================

const savedTasks =
    localStorage.getItem("taskflowTasks");

if (savedTasks) {

    try {

        tasks = JSON.parse(savedTasks);

    } catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        tasks = [];
    }
}


// ========================================
// 4. INITIAL DISPLAY
// ========================================

displayTasks();


// ========================================
// 5. ADD / SAVE TASK
// ========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Get values

        const title =
            taskTitle.value.trim();

        const selectedPriority =
            priority.value;

        const selectedDueDate =
            dueDate.value;


        // Validation

        if (title === "") {

            titleError.textContent =
                "Task title is required.";

            taskTitle.focus();

            return;
        }


        titleError.textContent = "";


        // ====================================
        // UPDATE EXISTING TASK
        // ====================================

        if (editingTaskId !== null) {

            const taskIndex =
                tasks.findIndex(
                    function (task) {

                        return task.id === editingTaskId;

                    }
                );


            if (taskIndex !== -1) {

                tasks[taskIndex].title =
                    title;

                tasks[taskIndex].priority =
                    selectedPriority;

                tasks[taskIndex].due_date =
                    selectedDueDate;


                saveTasks();

                displayTasks();

                showSuccess(
                    "Task updated successfully!"
                );

            }


            exitEditMode();

            return;
        }


        // ====================================
        // CREATE NEW TASK
        // ====================================

        const newTask = {

            id: Date.now(),

            title: title,

            priority: selectedPriority,

            due_date: selectedDueDate

        };


        tasks.push(newTask);


        saveTasks();

        displayTasks();


        showSuccess(
            "Task added successfully!"
        );


        resetForm();

    }
);


// ========================================
// 6. DISPLAY TASKS
// ========================================

function displayTasks() {

    taskList.innerHTML = "";


    // Get filter value

    const selectedFilter =
        filterPriority.value;


    // Filter tasks

    let visibleTasks = tasks;


    if (selectedFilter !== "all") {

        visibleTasks =
            tasks.filter(
                function (task) {

                    return task.priority ===
                        selectedFilter;

                }
            );

    }


    // Task count

    taskCount.textContent =
        tasks.length +
        (tasks.length === 1
            ? " task"
            : " tasks");


    // No tasks

    if (visibleTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks available.
            </p>
        `;

        return;
    }


    // Display tasks

    visibleTasks.forEach(
        function (task) {

            // Task box

            const taskItem =
                document.createElement("div");

            taskItem.className =
                "task-item";


            // Title

            const titleElement =
                document.createElement("h3");

            titleElement.textContent =
                task.title;


            // Priority

            const priorityElement =
                document.createElement("p");

            priorityElement.textContent =
                "Priority: " +
                capitalize(task.priority);

            priorityElement.className =
                "priority priority-" +
                task.priority;


            // Due date

            const dueDateElement =
                document.createElement("p");

            dueDateElement.textContent =
                "Due Date: " +
                formatDate(task.due_date);


            // Edit button

            const editButton =
                document.createElement("button");

            editButton.type = "button";

            editButton.textContent =
                "Edit";

            editButton.className =
                "edit-btn";


            editButton.addEventListener(
                "click",
                function () {

                    editTask(task.id);

                }
            );


            // Delete button

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.textContent =
                "Delete";

            deleteButton.className =
                "delete-btn";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTask(task.id);

                }
            );


            // Add elements

            taskItem.appendChild(
                titleElement
            );

            taskItem.appendChild(
                priorityElement
            );

            taskItem.appendChild(
                dueDateElement
            );

            taskItem.appendChild(
                editButton
            );

            taskItem.appendChild(
                deleteButton
            );


            taskList.appendChild(
                taskItem
            );

        }
    );

}


// ========================================
// 7. EDIT TASK
// ========================================

function editTask(taskId) {

    const task =
        tasks.find(
            function (item) {

                return item.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    // Put task into form

    taskTitle.value =
        task.title;

    priority.value =
        task.priority;

    dueDate.value =
        task.due_date || "";


    // Store ID

    editingTaskId =
        taskId;


    // Change form heading

    formHeading.textContent =
        "Edit Task";


    // Change button

    saveButton.textContent =
        "Save Changes";


    // Show cancel

    cancelButton.classList.remove(
        "hidden"
    );


    // Focus

    taskTitle.focus();


    // Scroll to form

    taskForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ========================================
// 8. CANCEL EDIT
// ========================================

cancelButton.addEventListener(
    "click",
    function () {

        exitEditMode();

        resetForm();

        showSuccess("");

    }
);


// ========================================
// 9. EXIT EDIT MODE
// ========================================

function exitEditMode() {

    editingTaskId = null;


    formHeading.textContent =
        "Add New Task";


    saveButton.textContent =
        "Add Task";


    cancelButton.classList.add(
        "hidden"
    );

}


// ========================================
// 10. DELETE TASK
// ========================================

function deleteTask(taskId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
            function (task) {

                return task.id !== taskId;

            }
        );


    // If deleted task was being edited

    if (editingTaskId === taskId) {

        exitEditMode();

        resetForm();

    }


    saveTasks();

    displayTasks();


    showSuccess(
        "Task deleted successfully!"
    );

}


// ========================================
// 11. FILTER TASKS
// ========================================

filterPriority.addEventListener(
    "change",
    function () {

        displayTasks();

    }
);


// ========================================
// 12. SAVE TO LOCAL STORAGE
// ========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// 13. RESET FORM
// ========================================

function resetForm() {

    taskForm.reset();

    priority.value =
        "medium";

    titleError.textContent = "";

}


// ========================================
// 14. SUCCESS MESSAGE
// ========================================

function showSuccess(message) {

    successMessage.textContent =
        message;


    if (message !== "") {

        setTimeout(
            function () {

                successMessage.textContent =
                    "";

            },
            2500
        );

    }

}


// ========================================
// 15. CAPITALIZE TEXT
// ========================================

function capitalize(text) {

    if (!text) {

        return "";

    }

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


// ========================================
// 16. FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Not specified";

    }


    const date =
        new Date(dateValue);


    if (isNaN(date.getTime())) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}