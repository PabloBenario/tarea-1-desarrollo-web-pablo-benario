// Utility to fetch elements with non-null assertion + typing
function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

const regionSel = el<HTMLSelectElement>("region");
const communeSel = el<HTMLSelectElement>("commune");
const sector = el<HTMLInputElement>("sector");

const nameInput = el<HTMLInputElement>("name");
const email = el<HTMLInputElement>("email");
const cell = el<HTMLInputElement>("cell");
const method = el<HTMLSelectElement>("contact-method");
const contactIdWrap = el<HTMLDivElement>("contact-id-wrap");
const contactId = el<HTMLInputElement>("contact-id");

const typeSel = el<HTMLSelectElement>("type");
const amount = el<HTMLInputElement>("amount");
const age = el<HTMLInputElement>("age");
const ageUnit = el<HTMLSelectElement>("age-unit");
const delivery = el<HTMLInputElement>("delivery");
const desc = el<HTMLTextAreaElement>("desc");

const photosWrap = el<HTMLDivElement>("photos-wrap");
const btnAddPhoto = el<HTMLButtonElement>("btn-add-photo");
const btnRemovePhoto = el<HTMLButtonElement>("btn-remove-photo");
const btnSubmit = el<HTMLButtonElement>("btn-submit");

const errorPanel = el<HTMLDivElement>("error-panel");
const errorList = el<HTMLUListElement>("error-list");

const confirmModal = el<HTMLDivElement>("confirm-modal");
const confirmYes = el<HTMLButtonElement>("confirm-yes");
const confirmNo = el<HTMLButtonElement>("confirm-no");
const successModal = el<HTMLDivElement>("success-modal");

// Populate regions
REGIONS.forEach(r => {
  const opt = document.createElement("option");
  opt.value = r.name; opt.textContent = r.name;
  regionSel.appendChild(opt);
});

regionSel.addEventListener("change", () => {
  communeSel.innerHTML = "";
  const region = REGIONS.find(r => r.name === regionSel.value);
  if (region) {
    region.communes.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c; opt.textContent = c;
      communeSel.appendChild(opt);
    });
    communeSel.disabled = false;
  } else {
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
function addPhotoInput(): void {
  const existing = photosWrap.querySelectorAll<HTMLInputElement>('input[type="file"]').length;
  if (existing >= 5) return;
  const input = document.createElement("input");
  input.type = "file";
  input.name = `photo_${existing + 1}`;
  input.accept = "*/*"; // prototype only
  photosWrap.appendChild(input);
}
function removeLastPhotoInput(): void {
  const inputs = photosWrap.querySelectorAll<HTMLInputElement>('input[type="file"]');
  if (inputs.length > 0) inputs[inputs.length - 1].remove();
}
addPhotoInput();
btnAddPhoto.addEventListener("click", () => {
  if (photosWrap.querySelectorAll<HTMLInputElement>('input[type="file"]').length >= 5) {
    alert("Max 5 photos reached.");
    return;
    }
  addPhotoInput();
});
btnRemovePhoto.addEventListener("click", removeLastPhotoInput);

// Error list UI
function showErrors(list: string[]): void {
  errorList.innerHTML = "";
  list.forEach(msg => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });
  errorPanel.style.display = list.length ? "" : "none";
  if (list.length) window.scrollTo({ top: 0, behavior: "smooth" });
}

// Validations (JS-only, per spec)
function isEmailOk(v: string): boolean {
  if (v.length > 100) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isCellOk(v: string): boolean {
  return /^\+\d{3}\.\d{8}$/.test(v);
}
function isIntMin1(v: string): boolean {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1;
}
function isDtLocalFormat(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);
}
function isAtLeastBaseline(v: string, baselineStr: string): boolean {
  return v >= baselineStr;
}

btnSubmit.addEventListener("click", () => {
  const errs: string[] = [];

  // Location
  if (!regionSel.value) errs.push("Region is required.");
  if (!communeSel.value) errs.push("Commune is required.");
  if (sector.value.length > 100) errs.push("Sector max length is 100.");

  // Contact
  const nm = nameInput.value.trim();
  if (nm.length < 3 || nm.length > 200) errs.push("Name must be between 3 and 200 characters.");
  if (!isEmailOk(email.value.trim())) errs.push("Email is invalid (simple regex) or exceeds 100 characters.");
  if (!isCellOk(cell.value.trim())) errs.push("Cellphone must match +NNN.NNNNNNNN (e.g., +569.12345678).");

  if (method.value && contactId.value.length > 200) errs.push("Contact ID/URL max length is 200.");

  // Pet
  if (!typeSel.value) errs.push("Pet type is required (dog or cat).");
  if (!isIntMin1(amount.value)) errs.push("Amount must be an integer ≥ 1.");
  if (!isIntMin1(age.value)) errs.push("Age must be an integer ≥ 1.");
  if (!ageUnit.value) errs.push("Age unit is required (months or years).");

  // Delivery
  const delv = delivery.value.trim();
  if (!isDtLocalFormat(delv)) errs.push("Delivery datetime must be in YYYY-MM-DDTHH:mm.");
  const baselineStr = delivery.dataset.baseline || "";
  if (isDtLocalFormat(delv) && !isAtLeastBaseline(delv, baselineStr)) {
    errs.push("Delivery datetime must be ≥ the prefilled value (now + 3h).");
  }

  // Photos 1–5, ensure at least 1 selected
  const inputs = Array.from(photosWrap.querySelectorAll<HTMLInputElement>('input[type="file"]'));
  if (inputs.length < 1) errs.push("At least one photo input is required (click 'Add another photo').");
  const selectedCount = inputs.filter(f => f.value && f.value.trim() !== "").length;
  if (selectedCount < 1) errs.push("Please select at least one photo file.");
  if (inputs.length > 5) errs.push("Maximum of 5 photos.");

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
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    confirmModal.classList.remove("open");
    successModal.classList.remove("open");
  }
});

