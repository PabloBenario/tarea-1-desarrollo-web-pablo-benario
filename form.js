"use strict";
// Utility to fetch elements with non-null assertion + typing
function el(id) {
    const node = document.getElementById(id);
    if (!node)
        throw new Error(`Missing element #${id}`);
    return node;
}
const regionSel = el("region");
const communeSel = el("commune");
const sector = el("sector");
const nameInput = el("name");
const email = el("email");
const cell = el("cell");
const method = el("contact-method");
const contactIdWrap = el("contact-id-wrap");
const contactId = el("contact-id");
const typeSel = el("type");
const amount = el("amount");
const age = el("age");
const ageUnit = el("age-unit");
const delivery = el("delivery");
const desc = el("desc");
const photosWrap = el("photos-wrap");
const btnAddPhoto = el("btn-add-photo");
const btnRemovePhoto = el("btn-remove-photo");
const btnSubmit = el("btn-submit");
const errorPanel = el("error-panel");
const errorList = el("error-list");
const confirmModal = el("confirm-modal");
const confirmYes = el("confirm-yes");
const confirmNo = el("confirm-no");
const successModal = el("success-modal");
// Populate regions
REGIONS.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.name;
    opt.textContent = r.name;
    regionSel.appendChild(opt);
});
regionSel.addEventListener("change", () => {
    communeSel.innerHTML = "";
    const region = REGIONS.find(r => r.name === regionSel.value);
    if (region) {
        region.communes.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            communeSel.appendChild(opt);
        });
        communeSel.disabled = false;
    }
    else {
        communeSel.disabled = true;
    }
});
method.addEventListener("change", () => {
    contactIdWrap.style.display = method.value ? "" : "none";
});
// Prefill delivery (now + 3h)
(function prefillDelivery() {
    const now = new Date();
    const baseline = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    delivery.value = toLocalDatetimeValue(baseline);
    delivery.dataset.baseline = delivery.value;
})();
// Photos: at least one input, up to 5
function addPhotoInput() {
    const existing = photosWrap.querySelectorAll('input[type="file"]').length;
    if (existing >= 5)
        return;
    const input = document.createElement("input");
    input.type = "file";
    input.name = `photo_${existing + 1}`;
    input.accept = "*/*"; // prototype only
    photosWrap.appendChild(input);
}
function removeLastPhotoInput() {
    const inputs = photosWrap.querySelectorAll('input[type="file"]');
    if (inputs.length > 0)
        inputs[inputs.length - 1].remove();
}
addPhotoInput();
btnAddPhoto.addEventListener("click", () => {
    if (photosWrap.querySelectorAll('input[type="file"]').length >= 5) {
        alert("Max 5 photos reached.");
        return;
    }
    addPhotoInput();
});
btnRemovePhoto.addEventListener("click", removeLastPhotoInput);
// Error list UI
function showErrors(list) {
    errorList.innerHTML = "";
    list.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        errorList.appendChild(li);
    });
    errorPanel.style.display = list.length ? "" : "none";
    if (list.length)
        window.scrollTo({ top: 0, behavior: "smooth" });
}
// Validations (JS-only, per spec)
function isEmailOk(v) {
    if (v.length > 100)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isCellOk(v) {
    return /^\+\d{3}\.\d{8}$/.test(v);
}
function isIntMin1(v) {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1;
}
function isDtLocalFormat(v) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);
}
function isAtLeastBaseline(v, baselineStr) {
    return v >= baselineStr;
}
btnSubmit.addEventListener("click", () => {
    const errs = [];
    // Location
    if (!regionSel.value)
        errs.push("Region is required.");
    if (!communeSel.value)
        errs.push("Commune is required.");
    if (sector.value.length > 100)
        errs.push("Sector max length is 100.");
    // Contact
    const nm = nameInput.value.trim();
    if (nm.length < 3 || nm.length > 200)
        errs.push("Name must be between 3 and 200 characters.");
    if (!isEmailOk(email.value.trim()))
        errs.push("Email is invalid (simple regex) or exceeds 100 characters.");
    if (!isCellOk(cell.value.trim()))
        errs.push("Cellphone must match +NNN.NNNNNNNN (e.g., +569.12345678).");
    if (method.value && contactId.value.length > 200)
        errs.push("Contact ID/URL max length is 200.");
    // Pet
    if (!typeSel.value)
        errs.push("Pet type is required (dog or cat).");
    if (!isIntMin1(amount.value))
        errs.push("Amount must be an integer ≥ 1.");
    if (!isIntMin1(age.value))
        errs.push("Age must be an integer ≥ 1.");
    if (!ageUnit.value)
        errs.push("Age unit is required (months or years).");
    // Delivery
    const delv = delivery.value.trim();
    if (!isDtLocalFormat(delv))
        errs.push("Delivery datetime must be in YYYY-MM-DDTHH:mm.");
    const baselineStr = delivery.dataset.baseline || "";
    if (isDtLocalFormat(delv) && !isAtLeastBaseline(delv, baselineStr)) {
        errs.push("Delivery datetime must be ≥ the prefilled value (now + 3h).");
    }
    // Photos 1–5, ensure at least 1 selected
    const inputs = Array.from(photosWrap.querySelectorAll('input[type="file"]'));
    if (inputs.length < 1)
        errs.push("At least one photo input is required (click 'Add another photo').");
    const selectedCount = inputs.filter(f => f.value && f.value.trim() !== "").length;
    if (selectedCount < 1)
        errs.push("Please select at least one photo file.");
    if (inputs.length > 5)
        errs.push("Maximum of 5 photos.");
    showErrors(errs);
    if (errs.length === 0) {
        confirmModal.classList.add("open");
    }
});
confirmYes.addEventListener("click", () => {
    confirmModal.classList.remove("open");
    successModal.classList.add("open");
});
confirmNo.addEventListener("click", () => {
    confirmModal.classList.remove("open");
});
// Escape closes modals
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        confirmModal.classList.remove("open");
        successModal.classList.remove("open");
    }
});
