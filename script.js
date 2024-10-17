function appendCharacter(character) {
  const display = document.getElementById("display");
  display.value += character;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  const display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
}

function calculateResult() {
  const display = document.getElementById("display");
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "Error";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const todoList = document.getElementById("todo-list");
  const filters = document.querySelectorAll(".filter");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const filterSection = document.getElementById("filter-section"); // New

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Function to render todos based on filter
  function renderTodos(filter = "all") {
    todoList.innerHTML = "";

    // Show or hide filter buttons based on todos existence
    if (todos.length === 0) {
      filterSection.style.display = "none"; // Hide filter buttons
    } else {
      filterSection.style.display = "flex"; // Show filter buttons
    }

    const filteredTodos = todos.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
    });

    filteredTodos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.classList.toggle("completed", todo.completed);
      todoItem.innerHTML = `
          <span>${todo.text}</span>
          <div class="actions">
              <button onclick="toggleComplete(${index})">${
        todo.completed ? "&check;" : "&check;"
      }</button>
              <button onclick="deleteTodo(${index})" style="background-color:#dc3545;">&#10060; </button>
          </div>
      `;
      todoList.appendChild(todoItem);
    });
  }

  // Add task function
  addBtn.addEventListener("click", () => {
    const newTask = todoInput.value.trim();
    if (newTask) {
      todos.push({ text: newTask, completed: false });
      todoInput.value = "";
      saveAndRender();
    }
  });

  // Toggle task complete
  window.toggleComplete = function (index) {
    todos[index].completed = !todos[index].completed;
    saveAndRender();
  };

  // Delete task
  window.deleteTodo = function (index) {
    todos.splice(index, 1);
    saveAndRender();
  };

  // Delete all tasks
  deleteAllBtn.addEventListener("click", () => {
    todos = [];
    saveAndRender();
  });

  // Save to localStorage and render
  function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  // Filter buttons
  filters.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filters.forEach((b) => b.classList.remove("active-filter"));
      e.target.classList.add("active-filter");
      const filter = e.target.getAttribute("data-filter");
      renderTodos(filter);
    });
  });

  // Initial rendering
  renderTodos();
});
