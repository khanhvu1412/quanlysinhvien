import {debounce} from "./utils/helper.js";
import { render, searchStudent, addStudent, updateId, updateStudent, deleteStudent , previousPage, goToPage, nextPage } from "./main.js";

const debounceSearch = debounce(searchStudent, 500);
document.getElementById("searchInput").addEventListener("input", debounceSearch);
document.getElementById("searchStatus").addEventListener("change", searchStudent);
document.getElementById("searchGender").addEventListener("change", searchStudent);

window.searchStudent = searchStudent;

window.addStudent = addStudent;
window.updateId = updateId;
window.updateStudent = updateStudent;
window.deleteStudent = deleteStudent;

window.previousPage = previousPage
window.goToPage = goToPage
window.nextPage = nextPage

render();