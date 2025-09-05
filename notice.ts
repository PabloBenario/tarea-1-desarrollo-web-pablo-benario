type NoticeOrUndef = ReturnType<typeof getNoticeById>;
type NoticeNonNull = Exclude<NoticeOrUndef, undefined>;

function q(name: string): string | null {
  const p = new URLSearchParams(location.search);
  return p.get(name);
}

const content = document.getElementById("content") as HTMLDivElement;
const imgModal = document.getElementById("img-modal") as HTMLDivElement;
const imgLarge = document.getElementById("img-large") as HTMLImageElement;
const imgClose = document.getElementById("img-close") as HTMLButtonElement;

function buildKV(key: string, val: string): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "kv";
  row.innerHTML = `<div class="key">${key}</div><div class="val">${val}</div>`;
  return row;
}

function render(notice: NoticeNonNull): void {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<h1>Notice #${notice.id}</h1>`;
  wrapper.appendChild(buildKV("Date of publication", fmtHuman(notice.publishedAt)));
  wrapper.appendChild(buildKV("Date of delivery", fmtHuman(notice.deliveryAt)));
  wrapper.appendChild(buildKV("Region", notice.region));
  wrapper.appendChild(buildKV("Commune", notice.commune));
  wrapper.appendChild(buildKV("Sector", notice.sector));
  wrapper.appendChild(buildKV("Quantity Type Age", `${notice.amount} ${notice.type} ${notice.age} ${notice.ageUnit}`));
  wrapper.appendChild(buildKV("Name Contact", notice.contactName));
  wrapper.appendChild(buildKV("Email", notice.contactEmail));
  wrapper.appendChild(buildKV("Cellphone", notice.phone));
  const cm = notice.contactMethod;
  wrapper.appendChild(buildKV("Preferred method", cm && cm.method ? `${cm.method} ${cm.value || ""}` : "—"));
  wrapper.appendChild(buildKV("Description", notice.description || "—"));

  const g = document.createElement("div");
  g.className = "gallery";
  for (let i = 0; i < notice.photos.count; i++) {
    const small = photoSmall(notice.photos.kind);
    const large = photoLarge(notice.photos.kind);
    const img = document.createElement("img");
    img.src = small;
    img.alt = "Photo thumbnail";
    img.className = "thumb";
    (img as HTMLImageElement).dataset.large = large;
    img.addEventListener("click", () => {
      imgLarge.src = (img as HTMLImageElement).dataset.large || "";
      imgModal.classList.add("open");
    });
    g.appendChild(img);
  }

  const nav = document.createElement("div");
  nav.className = "inline";
  (nav.style as CSSStyleDeclaration).marginTop = "16px";
  nav.innerHTML = `
    <a class="btn-link" href="list.html">← Back to listing</a>
    <a class="btn-link" href="index.html">Home</a>
  `;

  const photosTitle = document.createElement("h2");
  photosTitle.textContent = "Photos (320×240; click to view 800×600)";
  wrapper.appendChild(photosTitle);
  wrapper.appendChild(g);
  wrapper.appendChild(nav);
  content.innerHTML = "";
  content.appendChild(wrapper);
}

document.addEventListener("DOMContentLoaded", () => {
  const id = q("id") || "";
  const n = getNoticeById(id);
  if (!n) {
    content.innerHTML = `<h1>Notice not found</h1><p class="muted">The requested notice does not exist. Go back to the <a href="list.html">listing</a>.</p>`;
    return;
  }
  render(n);
});

imgClose.addEventListener("click", () => imgModal.classList.remove("open"));
document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") imgModal.classList.remove("open");
});
