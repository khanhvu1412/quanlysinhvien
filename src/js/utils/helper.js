// Hàm xoá dấu
export function removeVietnameseTones(str) {
    return str.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
}

export function getGender(gen) {
    return gen === 0 ? "Nam" : "Nữ";
}

export function getSatus(status) {
    return ["Bảo lưu", "Đang học", "Đã học xong"][status];
}

export function debounce(fn, delay = 500) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

export function showToast(message, type = "success") {
    const toastContailer = document.getElementById("toast");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    switch (type) {
        case "success":
            break;
        case "warning":
            break;
    }

    toast.innerHTML = `${message}`;

    toastContailer.appendChild(toast);

    setTimeout(() => {
        toast.remove()
    }, 3000);
}

export function showError(inputId, errorId, message) {
    document.getElementById(inputId).style.borderColor = "red";
    document.getElementById(errorId).innerText = message;
}

export function clearError(inputId, errorId) {
    document.getElementById(inputId).style.borderColor = "#ccc";
    document.getElementById(errorId).innerText = "";
}


export function showConfirmModal() {
    document.getElementById("confirmModal").style.display = "flex";
}

export function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
}
