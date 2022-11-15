let missions = [];

const delete_all = document.querySelector("#btn-clear");
let isEditTask = false;
const input = document.getElementById("input");
const filters = document.querySelectorAll(".filters span");

if (localStorage.getItem("missions") !== null) {
  missions = JSON.parse(localStorage.getItem("missions"));
}

display("all");
function display(filters) {
  let ul = document.querySelector("#mission-list");
  ul.innerHTML = "";

  if (missions.length == 0) {
    ul.innerHTML = "<p class='p-3 m-0'>Görev Listesi Boş.</p>";
  } else {
    for (let gorev of missions) {
      let complated = gorev.durum == "complated" ? "checked" : "";
      if (filters == gorev.durum || filters == "all") {
        let li = `
               <li class="task list-group-item justify-content-between ">
                  <div clas="form-check">
                      <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${complated}>
                   <label for="${gorev.id}" class="form-check-label ms-1 ${complated}">${gorev.gorev}</label>
                  </div>

                  <div class="dropdown">

                  <button
                    class="btn btn-link dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                  <i class="fa-solid fa-ellipsis"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        href="#"
                        onclick="edittask(${gorev.id},'${gorev.gorev}')"
                        class="dropdown-item"
                      >
                        <i class="fa-solid fa-pen"></i> Düzenle
                      </a>
                    </li>
                    <li>
                      <a href="#" onclick="deletetask(${gorev.id},'${gorev.gorev}')"class="dropdown-item"
                        ><i class="fa-solid fa-trash-can"></i>   Sil
                        </a>
                    </li>
                  </ul>
                </div>
              </li>
          `;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

document.querySelector("#btn-add").addEventListener("click", add);
document.querySelector("#btn-add").addEventListener("keypress", function () {
  if (event.key == "Enter") {
    document.getElementById("btn-add").click();
  }
});

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    display(span.id);
  });
}

function add(event) {
  if (input.value == "") {
    alert("Görev Girmelisiniz !!!");
  } else {
    // ekleme
    if (!isEditTask) {
      missions.push({
        id: missions.length + 1,
        gorev: input.value,
        durum: "pending",
      });
    } else {
      // güncelleme
      for (let mission of missions) {
        if (mission.id == editId) {
          mission.gorev = input.value;
        }
        isEditTask = false;
      }
    }

    input.value = "";
    display(document.querySelector("span.active").id);
    localStorage.setItem("missions", JSON.stringify(missions));
  }

  event.preventDefault();
}

delete_all.addEventListener("click", function () {
  let isOk = confirm("Silmek istediğinize Emin misiniz?");
  if (isOk) {
    missions.splice(0, missions.length);
    display("all");
    localStorage.setItem("missions", JSON.stringify(missions));
  }
});
function deletetask(id, gorevAdi) {
  let deleteId;
  for (let index in missions) {
    if (missions[index].id == id) {
      deleteId = index;
    }
  }

  // deleteId = missions.findIndex(function (gorev) {
  //   return gorev.id;
  // });

  // deleteId = missions.findIndex((gorev) => gorev.id == id);

  missions.splice(deleteId, 1);
  display(document.querySelector("span.active").id);
  localStorage.setItem("missions", JSON.stringify(missions));
}

function edittask(taskId, taskName) {
  isEditTask = true;
  editId = taskId;
  input.value = taskName;
  input.focus();
  input.classList.add("active");
}
function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;
  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "complated";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }
  for (let gorev of missions) {
    if (gorev.id == selectedTask.id) {
      gorev.durum = durum;
    }
  }
  display(document.querySelector("span.active").id);
  localStorage.setItem("missions", JSON.stringify(missions));
}
