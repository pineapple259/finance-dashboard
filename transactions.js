const API_URL = "https://script.google.com/macros/s/AKfycbzjJK-b0w5VMAWX2711ZnNPqQoDIh8DdJ76REuWAxCHl2KW0vmlc9BVRbzSQRTLgcQZ/exec"; // <-- ganti dengan Web App URL jika pakai GAS

// ================== API ==================
async function fetchData(month = "all") {
  const url = API_URL + (month !== "all" ? `?month=${month}` : "");
  const res = await fetch(url);
  const json = await res.json();
  return json.status === "ok" ? json.data : [];
}

async function addData(trx) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", ...trx })
  });
  return res.json();
}

async function deleteData(id) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", id })
  });
  return res.json();
}

// ================== UI: Render Tabel ==================
async function renderTransactions(month = "all") {
  const data = await fetchData(month);
  const tbody = document.querySelector("#transactions-table tbody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center">Belum ada transaksi</td></tr>`;
    return;
  }

  data.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.tanggal || ""}</td>
      <td>${t.kategori || ""}</td>
      <td>${t.deskripsi || ""}</td>
      <td>${t.jumlah ? "Rp " + Number(t.jumlah).toLocaleString("id-ID") : ""}</td>
      <td>${t.tipe || ""}</td>
      <td><button class="btn-hapus" data-id="${t.id}">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Event hapus
  document.querySelectorAll(".btn-hapus").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (confirm("Yakin hapus transaksi ini?")) {
        const res = await deleteData(btn.dataset.id);
        if (res.status === "ok") renderTransactions(month);
        else alert("Gagal hapus data!");
      }
    });
  });
}

// ================== Form Submit ==================
function getSelectedValue(wrapperId, placeholder) {
  const sel = document.querySelector(`#${wrapperId} .selected`);
  if (!sel) return "";
  const val = sel.dataset.value;
  return val && val !== "" ? val : "";
}

document.addEventListener("DOMContentLoaded", () => {
  // Init Flatpickr
  if (typeof flatpickr !== "undefined") {
    flatpickr("#tanggal", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "l, d F Y",
      defaultDate: "today",
      locale: "id"
    });
  }

  // Init custom dropdown
  initCustomSelect("category", "Kategori");
  initCustomSelect("type", "Tipe");

  // Render tabel awal
  renderTransactions();

  // Form submit
  const form = document.getElementById("formTransaksi");
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const trx = {
      tanggal: document.getElementById("tanggal").value,
      kategori: getSelectedValue("category", "Kategori"),
      deskripsi: document.getElementById("deskripsi").value.trim(),
      jumlah: parseFloat(document.getElementById("jumlah").value),
      tipe: getSelectedValue("type", "Tipe")
    };

    if (!trx.tanggal || !trx.kategori || !trx.deskripsi || isNaN(trx.jumlah) || !trx.tipe) {
      alert("Mohon isi semua field!");
      return;
    }

    const res = await addData(trx);
    if (res.status === "ok") {
      form.reset();
      document.querySelector("#category .selected").textContent = "Kategori ▾";
      document.querySelector("#type .selected").textContent = "Tipe ▾";
      await renderTransactions();
    } else {
      alert("Gagal menambah transaksi!");
    }
  });
});

// ================== Custom Select ==================
function initCustomSelect(wrapperId, placeholderText) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const selected = wrapper.querySelector(".selected");
  const options = wrapper.querySelector(".options");

  selected.dataset.value = "";
  selected.textContent = placeholderText + " ▾";

  selected.addEventListener("click", e => {
    e.stopPropagation();
    options.classList.toggle("open");
  });

  options.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", e => {
      e.stopPropagation();
      selected.dataset.value = li.dataset.value || li.textContent.trim();
      selected.textContent = li.textContent.trim() + " ▾";
      options.classList.remove("open");
    });
  });

  document.addEventListener("click", e => {
    if (!wrapper.contains(e.target)) options.classList.remove("open");
  });
}


