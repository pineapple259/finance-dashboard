const toggleBtn = document.querySelector(".dark-mode-toggle img");
const toggleContainer = document.querySelector(".dark-mode-toggle");
const toggleBtn2 = document.querySelector(".toggle-btn");
const toggleIcon = document.getElementById("toggle-icon");
const sidebar = document.querySelector(".sidebar");

if (toggleContainer) {
  toggleContainer.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // animasi fade+rotate
    toggleBtn.classList.add("change");
    setTimeout(() => toggleBtn.classList.remove("change"), 500);

    // ganti ikon
    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.src = "images/sun.png";
      toggleBtn.alt = "Light Mode";
    } else {
      toggleBtn.src = "images/moon.png";
      toggleBtn.alt = "Dark Mode";
    }
  });
}

// Sidebar responsif
function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.add('open');
  }
}

if (toggleBtn2) {
  toggleBtn2.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

handleResize();
window.addEventListener('resize', handleResize);
