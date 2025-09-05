"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("list-body");
    NOTICES.forEach(n => {
        const tr = document.createElement("tr");
        const qtyTypeAge = `${n.amount} ${n.type} ${n.age} ${n.ageUnit}`;
        const totalPhotos = n.photos.count;
        tr.innerHTML = `
      <td>${fmtHuman(n.publishedAt)}</td>
      <td>${fmtHuman(n.deliveryAt)}</td>
      <td>${n.commune}</td>
      <td>${n.sector}</td>
      <td>${qtyTypeAge}</td>
      <td>${n.contactName}</td>
      <td>${totalPhotos}</td>
    `;
        tr.addEventListener("click", () => {
            window.location.href = "notice.html?id=" + encodeURIComponent(n.id);
        });
        tbody.appendChild(tr);
    });
});
