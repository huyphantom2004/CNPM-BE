const apiUrl = 'http://localhost:3001/api';
let students = [];
let currentPage = 1;
const pageSize = 5;

// Fetch and display students in a table
async function fetchStudents() {
    try {
        const response = await fetch(`${apiUrl}/findall`);
        students = await response.json();
        displayStudents();
        setupPagination();
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

function displayStudents() {
    const studentTableBody = document.getElementById('studentList');
    studentTableBody.innerHTML = '';

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedStudents = students.slice(start, end);

    paginatedStudents.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="display: none">${student._id}</td>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.dob.slice(0, 10)}</td>
            <td>${student.address}</td>
            <td>
                <button class="edit" onclick="loadStudent('${student._id}')">Edit</button>
                <button class="delete" onclick="deleteStudent('${student.studentId}')">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

function setupPagination() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(students.length / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-btn');
        if (i === currentPage) button.classList.add('active');

        button.addEventListener('click', () => {
            currentPage = i;
            displayStudents();
        });

        paginationControls.appendChild(button);
    }
}

document.getElementById('studentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const isUpdate = event.submitter.id === "editSubmit";
    const url = `${apiUrl}/${isUpdate ? 'update' : 'save'}`;
    const studentData = {
        studentId: document.getElementById('studentId').value,
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value
    };

    if (isUpdate) {
        studentData.id = document.getElementById('dbEntryId').value;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            hidePopup();
            await fetchStudents();
        } else {
            alert("Error saving/updating student");
        }
    } catch (error) {
        console.error("Error adding/updating student:", error);
    }
});

async function loadStudent(id) {
    const student = students.find(s => s._id === id);
    if (student) {
        document.getElementById('dbEntryId').value = student._id;
        document.getElementById('studentId').value = student.studentId;
        document.getElementById('name').value = student.name;
        document.getElementById('dob').value = student.dob.slice(0, 10);
        document.getElementById('address').value = student.address;
        showPopup(true);
    }
}

async function deleteStudent(studentId) {
    try {
        await fetch(`${apiUrl}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId })
        });
        await fetchStudents();
    } catch (error) {
        console.error("Error deleting student:", error);
    }
}

function showPopup(isUpdate) {
    document.getElementById('studentModal').style.display = 'block';
    document.getElementById('addSubmit').style.display = isUpdate ? 'none' : 'block';
    document.getElementById('editSubmit').style.display = isUpdate ? 'block' : 'none';
}

function hidePopup() {
    document.getElementById('studentModal').style.display = 'none';
    document.getElementById('studentForm').reset();
}

document.getElementById('addStudentBtn').addEventListener('click', () => showPopup(false));
document.getElementById('closeModal').addEventListener('click', hidePopup);

fetchStudents();
