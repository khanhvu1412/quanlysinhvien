import StudentController from "./controllers/student.controller.js";
import Students from "./models/Students.js";
import {getGender, getSatus} from "./utils/helper.js";

const studentForm = document.getElementById("studentForm");
const controller = new StudentController();

const nameInput = document.getElementById("name");
const birthYearInput = document.getElementById("birthYear");
const genderInput = document.getElementById("gender");
const gradeInput = document.getElementById("grade");
const avatarInput = document.getElementById("avatar");
const courseInput = document.getElementById("course");
const statusInput = document.getElementById("status");

const btnAdd = document.getElementById("btnAdd");
const btnUpdate = document.getElementById("btnUpdate");

// ===================== Render ==========================
export function render() {
    let data = controller.paginate(controller.filtered);

    let html = data.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.birthYear}</td>
            <td>${getGender(s.gender)}</td>
            <td>${s.grade}</td>
            <td><img src="${s.avatar}" alt="Avatar"></td>
            <td>${s.course}</td>
            <td>${getSatus(s.status)}</td>
            <td><button onclick="updateId(${s.id})" class="btn-edit">Sửa</button></td>
            <td><button onclick="deleteStudent(${s.id})" class="btn-del">Xoá</button></td>
        </tr>
    `).join("");

    document.getElementById("studentTable").innerHTML = html;
    updatePaginationInfo();

    btnAdd.disabled = false;
    btnUpdate.disabled = true;
}

// ===================== Add ==========================
export function addStudent() {
    let student = new Students(
        null,
        nameInput.value,
        birthYearInput.value,
        Number(genderInput.value),
        gradeInput.value,
        avatarInput.value,
        courseInput.value,
        Number(statusInput.value)
    );

    controller.add(student);
    controller.filtered = [...controller.students];

    render();
    studentForm.reset();
}

// ===================== Update Id ==========================
let currentId = null;

export function updateId(id) {
    let student = controller.students.find(stu => stu.id == id);
    if (!student) return;

    currentId = id;

    nameInput.value = student.name;
    birthYearInput.value = student.birthYear;
    genderInput.value = student.gender;
    gradeInput.value = student.grade;
    avatarInput.value = student.avatar;
    courseInput.value = student.course;
    statusInput.value = student.status;

    btnAdd.disabled = true;
    btnUpdate.disabled = false;

    document.querySelectorAll(".btn-edit").forEach(btn => btn.disabled = true);
    document.querySelectorAll(".btn-del").forEach(btn => btn.disabled = true);
}

// ===================== Update =========================
export function updateStudent() {
    if (!currentId) return;

    controller.update(currentId, {
        name: nameInput.value,
        birthYear: birthYearInput.value,
        gender: Number(genderInput.value),
        grade: gradeInput.value,
        avatar: avatarInput.value,
        course: courseInput.value,
        status: Number(statusInput.value)
    });

    controller.filtered = [...controller.students];
    currentId = null;

    render();
    studentForm.reset();

    btnAdd.disabled = false;
    btnUpdate.disabled = true;

    document.querySelectorAll(".btn-edit").forEach(btn => btn.disabled = false);
    document.querySelectorAll(".btn-del").forEach(btn => btn.disabled = false);
}

// ===================== Delete =========================
export function deleteStudent(id) {
    if (!confirm(`Bạn có chắc muốn xoá dữ liệu này không?`)) return;

    controller.delete(id);
    controller.filtered = [...controller.students];
    render();
}

// ===================== Search =========================
export function searchStudent() {
    let keyword = document.getElementById("searchInput").value;
    let status = document.getElementById("searchStatus").value;
    let gender = document.getElementById("searchGender").value;

    controller.search(keyword, status, gender);

    if (controller.filtered.length === 0) {
        let message = `❌ Không tìm thấy kết quả cho "<b>${keyword}</b>"`;

        document.getElementById("studentTable").innerHTML = `
            <tr>
                <td colspan="10" class="no-data">
                    ${message}
                </td>
            </tr>
        `;
        return;
    }
    controller.currentPage = 1;
    render();
}

// ===================== Pagination =========================
export function getTotalPage() {
    return Math.ceil(controller.filtered.length / controller.pageSize);
}

export function previousPage() {
    if (controller.currentPage > 1) {
        controller.currentPage--;
        render();
    }
}

export function goToPage() {
    let page = Number(document.getElementById("currentPage").value);

    if (page >= 1 && page <= getTotalPage()) {
        controller.currentPage = page;
        render();
    }
}

export function nextPage() {
    if (controller.currentPage < getTotalPage()) {
        controller.currentPage++;
        render();
    }
}

export function updatePaginationInfo() {
    document.getElementById("currentPage").value = controller.currentPage;
    document.getElementById("totalPage").innerText = getTotalPage() || 1;

    document.getElementById("btnPrev").disabled = controller.currentPage <= 1;
    document.getElementById("btnNext").disabled = controller.currentPage >= getTotalPage();

}
