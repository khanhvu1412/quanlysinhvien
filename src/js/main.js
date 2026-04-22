import StudentController from "./controllers/student.controller.js";
import Students from "./models/Students.js";
import {getGender, getSatus, showToast, showError, clearError, showConfirmModal, closeModal} from "./utils/helper.js";

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
function validateStudent() {
    let isValid = true;

    clearError("name", "validateName");
    clearError("birthYear", "validateBirthYear");
    clearError("grade", "validateGrade");
    clearError("course", "validateCourse");

    if (!nameInput.value.trim()) {
        showError("name", "validateName", "Bạn phải nhập tên!");
        isValid = false;
    }

    if (!birthYearInput.value.trim()) {
        showError("birthYear", "validateBirthYear", "Bạn phải nhập năm sinh!");
        isValid = false;
    }

    if (!gradeInput.value.trim()) {
        showError("grade", "validateGrade", "Bạn phải nhập lớp!");
        isValid = false;
    }

    if (!courseInput.value.trim()) {
        showError("course", "validateCourse", "Bạn phải nhập khoá!");
        isValid = false;
    }

    return isValid;

}

export function addStudent() {
    if (!validateStudent()) {
        showToast("Bạn phải nhập đầy đủ thông tin!", "warning");
        return;
    }

    let avatar = avatarInput.value.trim() || "https://surl.li/ijoewd"

    let student = new Students(
        null,
        nameInput.value,
        birthYearInput.value,
        Number(genderInput.value),
        gradeInput.value,
        avatar,
        courseInput.value,
        Number(statusInput.value)
    );

    controller.add(student);
    controller.filtered = [...controller.students];

    render();
    showToast("Bạn đã thêm sinh viên thành công!", "success");
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
    if (!validateStudent()) {
        showToast("Bạn phải nhập đầy đủ thông tin!", "warning");
        return;
    }

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
    showToast("Bạn đã cập nhật sinh viên thành công!", "success");

    studentForm.reset();

    btnAdd.disabled = false;
    btnUpdate.disabled = true;

    document.querySelectorAll(".btn-edit").forEach(btn => btn.disabled = false);
    document.querySelectorAll(".btn-del").forEach(btn => btn.disabled = false);
}

// ===================== Delete =========================
export function deleteStudent(id) {
    showConfirmModal();

    let student = controller.students.find(s => s.id == id);

    document.getElementById("modalMessage").innerHTML = `Bạn có chắc muốn xoá học sinh <br> <b>${student.name}</b>`;

    document.getElementById("btnConfirmYes").onclick = () => {
        if (id !== null) {
            controller.delete(id);
            controller.filtered = [...controller.students];
            showToast("Bạn đã xoá thành công!", "success");
            render();
        }

        closeModal();
    }

    document.getElementById("btnConfirmNo").onclick = closeModal;
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
