import {debounce} from "./utils/helper.js";
import { render, addStudent, updateId, updateStudent, deleteStudent, searchStudent, previousPage, goToPage, nextPage } from "./main.js";

const debounceSearch = debounce(searchStudent, 500);
document.getElementById("searchInput").addEventListener("input", debounceSearch);
document.getElementById("searchStatus").addEventListener("change", searchStudent);
document.getElementById("searchGender").addEventListener("change", searchStudent);

window.searchStudent = searchStudent;

window.addStudent = addStudent;
window.updateId = updateId;
window.updateStudent = updateStudent;

window.previousPage = previousPage
window.goToPage = goToPage
window.nextPage = nextPage

window.deleteStudent = deleteStudent;
render();