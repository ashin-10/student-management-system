const form = document.getElementById("student-form");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const statusMessage = document.getElementById("status-message");
const studentList = document.getElementById("student-list");
const studentCount = document.getElementById("student-count");
const tableSummary = document.getElementById("table-summary");
const studentIdInput = document.getElementById("student-id");

let students = [];
let editingId = null;

function resetForm() {
  form.reset();
  studentIdInput.value = "";
  editingId = null;
  formTitle.textContent = "Add Student";
  submitButton.textContent = "Save Student";
  cancelEditButton.style.display = "none";
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function renderStudents() {
  const count = students.length;
  studentCount.textContent = `${count} student${count === 1 ? "" : "s"}`;
  tableSummary.textContent = `${count} loaded from JSON`;

  if (!count) {
    studentList.innerHTML = '<tr><td colspan="4">No students found in the JSON file.</td></tr>';
    return;
  }

  studentList.innerHTML = students
    .map((student) => {
      const gradeLabel = student.grade >= 85 ? "Excellent" : student.grade >= 70 ? "Good" : "Needs Review";
      const gradeClass = student.grade >= 85 ? "good" : student.grade >= 70 ? "ok" : "warn";

      return `
        <tr>
          <td>${student.name}</td>
          <td>${student.course}</td>
          <td>${student.grade}</td>
          <td>
            <div class="table-actions">
              <span class="status ${gradeClass}">${gradeLabel}</span>
              <button type="button" class="secondary" data-action="edit" data-id="${student.id}">Edit</button>
              <button type="button" class="danger" data-action="delete" data-id="${student.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function loadStudents() {
  const response = await fetch("/api/students");
  if (!response.ok) {
    throw new Error("Unable to load students from the backend.");
  }

  students = await response.json();
  renderStudents();
}

async function saveStudent(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim(),
    grade: document.getElementById("grade").value,
  };

  if (!payload.name || !payload.email || !payload.course || payload.grade === "") {
    setStatus("Please complete every field before saving.");
    return;
  }

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `/api/students/${editingId}` : "/api/students";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "The request could not be completed.");
    }

    setStatus(editingId ? "Student updated successfully." : "Student created successfully.");
    resetForm();
    await loadStudents();
  } catch (error) {
    setStatus(error.message);
  }
}

async function handleTableAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const id = button.getAttribute("data-id");

  if (button.dataset.action === "delete") {
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to delete student.");
      }

      setStatus("Student deleted successfully.");
      await loadStudents();
    } catch (error) {
      setStatus(error.message);
    }
    return;
  }

  if (button.dataset.action === "edit") {
    const student = students.find((item) => item.id === id);
    if (!student) {
      return;
    }

    editingId = student.id;
    studentIdInput.value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;
    document.getElementById("grade").value = student.grade;
    formTitle.textContent = "Edit Student";
    submitButton.textContent = "Update Student";
    cancelEditButton.style.display = "inline-block";
    setStatus(`Editing ${student.name}.`);
  }
}

form.addEventListener("submit", saveStudent);
cancelEditButton.addEventListener("click", resetForm);
studentList.addEventListener("click", handleTableAction);

cancelEditButton.style.display = "none";
loadStudents().catch((error) => setStatus(error.message));
