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