import StudentService from "../services/student.service.js";
import {removeVietnameseTones} from "../utils/helper.js";

export default class StudentController {
    constructor() {
        this.students = StudentService.load();
        this.filtered = [...this.students];
        this.currentPage = 1;
        this.pageSize = 6;
    }

    add(student) {
        student.id = this.students.length
            ? this.students[this.students.length - 1].id + 1
            : 1;

        this.students.push(student);
        this.save();
    }

    update(id, newData) {
        let stu = this.students.find(s => s.id == id);
        if (!stu) return;

        Object.assign(stu, newData);
        this.save();
    }

    delete(id) {
        this.students = this.students.filter(s => s.id != id);
        this.save();
    }

    search(keyword, status, gender) {
        keyword = removeVietnameseTones(keyword.trim());

        this.filtered = this.students.filter(s => {
            let matchKeyword =
                !keyword || removeVietnameseTones(s.name).includes(keyword) ||
                removeVietnameseTones(s.birthYear).includes(keyword) ||
                removeVietnameseTones(s.grade).includes(keyword) ||
                removeVietnameseTones(s.course).includes(keyword);

            let matchStatus = status === "" || s.status == status;
            let matchGender = gender === "" || s.gender == gender;

            return matchKeyword && matchStatus && matchGender;
        });

        this.currentPage = 1;
        return this.filtered;
    }

    paginate(data) {
        let start = (this.currentPage - 1) * this.pageSize;
        return data.slice(start, start + this.pageSize);
    }

    save() {
        StudentService.save(this.students);
    }
}