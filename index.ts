document.addEventListener("DOMContentLoaded", () => {
  const rows = lastNNotices(5);
  const tbody = document.getElementById("last5-body") as HTMLTableSectionElement;

  rows.forEach(n => {
    const tr = document.createElement("tr");
    const qtyTypeAge = `${n.amount} ${n.type} ${n.age} ${n.ageUnit}`;
    const inventedFile = (n.type === "cat" ? "cat" : "dog") + "_photo.jpg";

    tr.innerHTML = `
      <td>${fmtHuman(n.publishedAt)}</td>
      <td>${n.commune}</td>
      <td>${n.sector}</td>
      <td>${qtyTypeAge}</td>
      <td>${inventedFile}</td>
    `;
    tr.addEventListener("click", () => {
      window.location.href = "notice.html?id=" + encodeURIComponent(n.id);
    });
    tbody.appendChild(tr);
  });
});

