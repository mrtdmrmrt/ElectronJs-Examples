const electron = require("electron");
const { ipcRenderer } = electron;

checkTodoCount();

const todoValue = document.querySelector("#todoValue");

todoValue.addEventListener("keypress", (e) => {
  if (e.keyCode == 13) {
    ipcRenderer.send("newTodo:save", {
      ref: "main",
      todoValue: e.target.value,
    });
    e.target.value = "";
  }
});

document.querySelector("#addBtn").addEventListener("click", () => {
  ipcRenderer.send("newTodo:save", { ref: "main", todoValue: todoValue.value });
  todoValue.value = "";
});

//Cikis Islemi
document.querySelector("#closeBtn").addEventListener("click", () => {
  if (confirm("Çıkamk İstiyor Musunuz?")) {
    ipcRenderer.send("todo:quit");
  }
});

ipcRenderer.on("todo:addItem", (err, todo) => {
  //container
  const container = document.querySelector(".todo-container");

  //row
  const row = document.createElement("div");
  row.className = "row";

  //col
  const col = document.createElement("div");
  col.className =
    "p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center";
  col.style = "background-color: #582e48 !important;";

  //p
  const p = document.createElement("p");
  p.className = "m-0 w-100";
  p.innerText = todo.text;

  //sil btn
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1 mr-1";
  deleteBtn.innerText = "X";

  deleteBtn.addEventListener("click", (e) => {
    if (confirm("Bu Kaydi Silmek Istediginizden Eminmisiniz?")) {
      e.target.parentNode.parentNode.remove();
      checkTodoCount();
    }
  });

  col.appendChild(p);
  col.appendChild(deleteBtn);

  row.appendChild(col);

  container.appendChild(row);

  checkTodoCount();
});

function checkTodoCount() {
  const container = document.querySelector(".todo-container");
  const alertContainer = document.querySelector(".alert-container");
  document.querySelector(".total-count-container").innerText =
    container.children.length;

  if (container.children.length !== 0) {
    alertContainer.style.display = "none";
  } else {
    alertContainer.style.display = "block";
  }
}
