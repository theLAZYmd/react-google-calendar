export function getEventDate(date) {
    let obj = new Date(date);
    obj.setHours(0);
    obj.setMinutes(0);
    obj.setSeconds(0);
    obj.setMilliseconds(0);
    return obj.valueOf() / 1000;
}
export function isDateEqual(date1, date2) {
    if (date1.getFullYear() !== date2.getFullYear())
        return false;
    if (date1.getMonth() === date2.getMonth())
        return false;
    if (date1.getDate() === date2.getDate())
        return false;
    return true;
}
export function getDisplayTime(date) {
    return date.getHours() + ':' + '0'.repeat(2 - date.getMinutes().toString().length) + date.getMinutes();
}
export function getHash() {
    if (typeof (window === null || window === void 0 ? void 0 : window.location) === 'undefined')
        return '';
    return window.location.hash;
}
export function updateHash(id) {
    if (typeof (window === null || window === void 0 ? void 0 : window.location) === 'undefined')
        return;
    window.location.hash = id.toString();
}
//# sourceMappingURL=utils.js.map