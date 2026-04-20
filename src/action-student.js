import student_data from "./resource/database/student.json" with {type: "json"};

let studentRepo = [...student_data];
let filteredData = [...studentRepo];

let currentPage = 1;
let pageSize = 5;


function renderStudentList(studentRepo) {
    let studentTable = document.getElementById("studentTable");
    let content = "";

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;

    let data = studentRepo.slice(start, end);

    for (let i = 0; i < data.length; i++) {
        let student = data[i];
        content += `
            <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.birthYear}</td>
            <td>${getGender(student.gender)}</td>
            <td>${student.grade}</td>
            <td><img src="${student.avatar}"></td>
            <td>${student.course}</td>
            <td>${getSatus(student.status)}</td>
            <td><button onclick="updateStudentById(${student.id})" class="btn-edit">Sửa</button></td>
            <td><button onclick="deleteStudentById(${student.id})" class="btn-del">Xoá</button></td>
            </tr>`;
    }
    studentTable.innerHTML = content;

    document.getElementById("currentPage").value = currentPage;
    updatePaginationInfo();
}

function getGender(gen) {
    return gen === 0 ? "Nam" : "Nữ";
}

function getSatus(status) {
    switch (status) {
        case 0:
            return "Bảo lưu";
        case 1:
            return "Đang học";
        case 2:
            return "Đã học xong";
    }
}

// ================ Pagination ==================
function updatePaginationInfo() {
    let totalPage = Math.ceil(filteredData.length / pageSize) || 1;

    document.getElementById("totalPage").innerText = totalPage;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderStudentList(filteredData);
        updatePaginationInfo();
    }
}

function goToPage() {
    let page = Number(document.getElementById("currentPage").value);
    let totalPage = Math.ceil(studentRepo.length / pageSize);

    if (page >= 1 && page <= totalPage) {
        currentPage = page;
        renderStudentList(filteredData);
        updatePaginationInfo();
    }
}

function nextPage() {
    let totalPage = Math.ceil(studentRepo.length / pageSize);

    if (currentPage < totalPage) {
        currentPage++;
        renderStudentList(filteredData);
        updatePaginationInfo();
    }

    document.querySelector("button[onclick='nextPage()']").disable = currentPage >= totalPage;
}

// ================ Search ==================
function debounce(fn, delay) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

// Hàm xoá dấu
function removeVietnameseTones(str) {
    return str.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
}

const debounceSearch = debounce(() => {
    searchStudent();
}, 500);

document.getElementById("searchInput").addEventListener("input", debounceSearch);
document.getElementById("searchStatus").addEventListener("change", searchStudent);
document.getElementById("searchGender").addEventListener("change", searchStudent);

function searchStudent() {
    let keyword = document.getElementById("searchInput").value;
    let status = document.getElementById("searchStatus").value;
    let gender = document.getElementById("searchGender").value;

    keyword = removeVietnameseTones(keyword.trim());

    filteredData = studentRepo.filter(student => {
        let matchKeyword =
            !keyword ||
            removeVietnameseTones(student.name).includes(keyword) ||
            removeVietnameseTones(student.birthYear).includes(keyword) ||
            removeVietnameseTones(student.grade).includes(keyword) ||
            removeVietnameseTones(student.course).includes(keyword);

        let matchStatus = status === "" || student.status == status;

        let matchGender = gender === "" || student.gender == gender;

        return matchKeyword && matchStatus && matchGender;
    });

    currentPage = 1;
    renderStudentList(filteredData);
    updatePaginationInfo();
}

// ================= Add ====================
function addStudent() {
    let name = document.getElementById("name").value.trim();
    let birthYear = document.getElementById("birthYear").value.trim();
    let gender = Number(document.getElementById("gender").value);
    let grade = document.getElementById("grade").value.trim();
    let avatar = document.getElementById("avatar").value.trim();
    let course = document.getElementById("course").value.trim();
    let status = Number(document.getElementById("status").value);

    let id = studentRepo.length > 0
        ? studentRepo[studentRepo.length - 1].id + 1
        : 1;

    studentRepo.push(
        {
            "id": id,
            "name": name,
            "birthYear": birthYear,
            "gender": gender,
            "grade": grade,
            "avatar": avatar,
            "course": course,
            "status": parseInt(status),
        }
    )

    renderStudentList(studentRepo);
    updatePaginationInfo();

    document.getElementById("studentForm").reset();
}

// ================= Delete =================
function deleteStudentById(id) {
    console.log("Xoá")
    for (let i = 0; i < studentRepo.length; i++) {
        if (studentRepo[i].id == id) {
            studentRepo.splice(i, 1);
            break;
        }
    }

    renderStudentList(studentRepo);
    updatePaginationInfo();
}

// ================= Update =================
let currentId = null;

function updateStudentById(id) {
    let student = studentRepo.find(stu => stu.id == id);
    if (!student) return;

    currentId = id;

    document.getElementById("name").value = student.name;
    document.getElementById("birthYear").value = student.birthYear;
    document.getElementById("gender").value = student.gender;
    document.getElementById("grade").value = student.grade;
    document.getElementById("avatar").value = student.avatar;
    document.getElementById("course").value = student.course;
    document.getElementById("status").value = student.status;
}

function updateStudent() {
    if (!currentId) return;

    let name = document.getElementById("name").value;
    let birthYear = document.getElementById("birthYear").value;
    let gender = Number(document.getElementById("gender").value);
    let grade = document.getElementById("grade").value;
    let avatar = document.getElementById("avatar").value;
    let course = document.getElementById("course").value;
    let status = Number(document.getElementById("status").value);

    for (let i = 0; i < studentRepo.length; i++) {
        if (studentRepo[i].id == currentId) {
            studentRepo[i].name = name;
            studentRepo[i].birthYear = birthYear;
            studentRepo[i].gender = gender;
            studentRepo[i].grade = grade;
            studentRepo[i].avatar = avatar;
            studentRepo[i].course = course;
            studentRepo[i].status = status;
            break;
        }
    }
    currentId = null;
    renderStudentList(studentRepo);
    updatePaginationInfo();
    document.getElementById("studentForm").reset();
}


// ================= Action =================
window.updatePaginationInfo = updatePaginationInfo;
window.previousPage = previousPage;
window.goToPage = goToPage;
window.nextPage = nextPage;

window.searchStudent = searchStudent;
window.addStudent = addStudent;
window.updateStudent = updateStudent;
window.updateStudentById = updateStudentById;
window.deleteStudentById = deleteStudentById;
renderStudentList(studentRepo);
