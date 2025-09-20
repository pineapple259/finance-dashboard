const API_URL = "https://script.google.com/macros/s/AKfycbzjJK-b0w5VMAWX2711ZnNPqQoDIh8DdJ76REuWAxCHl2KW0vmlc9BVRbzSQRTLgcQZ/exec"; // ganti dengan URL Web App GAS

async function loadTransactions(month = "all") {
  const res = await fetch(API_URL + `?month=${month}`);
  const json = await res.json();
  return json.status === "ok" ? json.data : [];
}

async function updateDashboard(month = "all") {
  const data = await loadTransactions(month);

  // Hitung summary
  let income = 0, expense = 0;
  const byCategory = {};

  data.forEach(t => {
    const jml = Number(t.jumlah);
    if (t.tipe === "Pemasukan") income += jml;
    else if (t.tipe === "Pengeluaran") {
      expense += jml;
      byCategory[t.kategori] = (byCategory[t.kategori] || 0) + jml;
    }
  });

  document.getElementById("total-income").textContent = "Rp " + income.toLocaleString("id-ID");
  document.getElementById("total-expense").textContent = "Rp " + expense.toLocaleString("id-ID");
  document.getElementById("total-balance").textContent = "Rp " + (income - expense).toLocaleString("id-ID");

  // Chart income vs expense
  new Chart(document.getElementById("incomeExpenseChart"), {
    type: "line",
    data: {
      labels: ["Pemasukan", "Pengeluaran"],
      datasets: [{
        label: "Total",
        data: [income, expense],
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,0.2)",
        fill: true
      }]
    }
  });

  // Doughnut chart per kategori
  new Chart(document.getElementById("expenseCategoryChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(byCategory),
      datasets: [{
        data: Object.values(byCategory),
        backgroundColor: ["#ff5722", "#03a9f4", "#8bc34a", "#ffc107", "#9c27b0"]
      }]
    }
  });
}

document.addEventListener("DOMContentLoaded", () => updateDashboard());
