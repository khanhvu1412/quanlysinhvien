import student_data from "../../resource/database/student.json" with {type: "json"};

const STORAGE_KEY = "students";

export default class StudentService {
    static load() {
        let data = localStorage.getItem(STORAGE_KEY);

        if (data) return JSON.parse(data);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(student_data));
        return [...student_data];
    }

    static save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

