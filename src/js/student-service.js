import student_data from "../resource/database/student.json" with {type: "json"};

export function loadData() {
    let data = localStorage.getItem("students");

    if(data) {
        return JSON.parse(data);
    } else {
        localStorage.setItem("students", JSON.stringify(student_data));
        return [...student_data];
    }
}

export function saveData(studentRepo) {
    localStorage.setItem("students", JSON.stringify(studentRepo));
}

