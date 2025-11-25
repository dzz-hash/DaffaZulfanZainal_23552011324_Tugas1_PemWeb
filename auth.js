// =========================
// AUTH.JS - CENTRALISED (untuk alur C)
// =========================

// Simpan data user baru (dipanggil dari register page)
function registerUser(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name = (document.getElementById("regName") || {}).value?.trim();
  const email = (document.getElementById("regEmail") || {}).value?.trim();
  const pass = (document.getElementById("regPass") || {}).value?.trim();

  if (!name || !email || !pass) {
    return Swal.fire("Gagal!", "Semua field harus diisi!", "error");
  }

  let users = JSON.parse(localStorage.getItem("vt-users") || "[]");

  if (users.find(u => u.email === email)) {
    return Swal.fire("Email Terdaftar", "Gunakan email lain", "warning");
  }

  users.push({ name, email, pass });
  localStorage.setItem("vt-users", JSON.stringify(users));

  // auto-login setelah registrasi
  localStorage.setItem("vt-current", JSON.stringify({ name, email }));
  localStorage.setItem("isLoggedIn", "true");

  Swal.fire({
    icon: "success",
    title: "Registrasi Berhasil!",
    text: "Selamat datang.",
    timer: 1200,
    showConfirmButton: false
  }).then(() => {
    // setelah daftar, arahkan ke about_brand_page (aturan alur C)
    window.location.href = "about_brand.html";
  });
}

// LOGIN (dipanggil dari login page)
// gunakan event listener di login page untuk memanggil fungsi ini
function loginUser(e) {
  if (e && e.preventDefault) e.preventDefault();

  const email = (document.getElementById("loginEmail") || {}).value?.trim();
  const pass = (document.getElementById("loginPass") || {}).value?.trim();

  const users = JSON.parse(localStorage.getItem("vt-users") || "[]");
  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    return Swal.fire("Gagal!", "Email atau password salah", "error");
  }

  // simpan session user lengkap
  localStorage.setItem("vt-current", JSON.stringify({ name: user.name, email: user.email }));
  localStorage.setItem("isLoggedIn", "true");

  Swal.fire({
    icon: "success",
    title: "Login Berhasil!",
    text: "Mengalihkan ke About Brand...",
    timer: 900,
    showConfirmButton: false
  }).then(() => {
    // **ALUR C**: setelah login, arahkan ke about_brand_page
    window.location.href = "about_brand.html";
  });
}

// LOGOUT (dipanggil dari navbar / sidebar)
function logoutUser() {
  Swal.fire({
    title: "Yakin ingin logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ff0033",
    cancelButtonColor: "#555",
    confirmButtonText: "Logout"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("vt-current");
      localStorage.removeItem("isLoggedIn");
      // redirect ke halaman home (default)
      window.location.href = "home_page.html";
    }
  });
}


// =========================
// PROTECTED PAGES & HELPERS (global)
// =========================

// List halaman yang HARUS login (nama file)
const ProtectedPages = [
  "product_detail.html",
  "cart_page.html",
  "checkout_page.html",
  "dashboard_page.html",
  "profile.html",
  "order_history.html",
  "wishlist.html"
];

// cek akses: jika halaman saat ini termasuk ProtectedPages dan belum login -> redirect ke login
function protectCurrentPageOnLoad() {
  try {
    const curr = window.location.pathname.split("/").pop();
    const isLogged = !!localStorage.getItem("vt-current");
    if (ProtectedPages.includes(curr) && !isLogged) {
      // jangan gunakan Swal modal panjang di load, cukup alert lalu redirect agar tidak menggantung
      Swal.fire({
        icon: "info",
        title: "Login Diperlukan",
        text: "Anda harus login untuk membuka halaman ini.",
        confirmButtonColor: "#ff0033"
      }).then(() => window.location.href = "login.html");
    }
  } catch (e) { /* ignore */ }
}

// fungsi yang dipakai oleh link-button untuk navigasi yang butuh login
function requireLoginBeforeNavigate(target) {
  const isLogged = !!localStorage.getItem("vt-current");
  if (!isLogged) {
    return Swal.fire({
      icon: "warning",
      title: "Login Diperlukan",
      text: "Silakan login terlebih dahulu.",
      showCancelButton: true,
      confirmButtonText: "Login Sekarang",
      confirmButtonColor: "#ff0033"
    }).then(res => {
      if (res.isConfirmed) window.location.href = "login.html";
    });
  } else {
    // langsung navigasi
    window.location.href = target;
  }
}

// helper untuk update navbar/user-icon di semua halaman (panggil pada DOMContentLoaded setiap halaman)
function syncNavAuthUI() {
  try {
    const cur = localStorage.getItem("vt-current");
    const isLogged = !!cur;
    // elemen standar yang sebaiknya ada di navbar:
    // #navLoginBtn (tombol Masuk), #navUserIcon (link icon), #navAuthBtn (opsional)
    const navLoginBtn = document.getElementById("navLoginBtn");
    const navUserIcon = document.getElementById("navUserIcon");
    const navAuthBtn = document.getElementById("navAuthBtn"); // beberapa halaman pake id ini

    if (isLogged) {
      if (navLoginBtn) navLoginBtn.classList.add("d-none");
      if (navUserIcon) navUserIcon.classList.remove("d-none");
      if (navAuthBtn) {
        try {
          const u = JSON.parse(cur);
          navAuthBtn.innerText = u.name || "Dashboard";
          navAuthBtn.classList.remove("btn-outline-light");
          navAuthBtn.classList.add("btn-danger");
          navAuthBtn.onclick = () => window.location.href = "dashboard_page.html";
        } catch (e) { }
      }
    } else {
      if (navLoginBtn) navLoginBtn.classList.remove("d-none");
      if (navUserIcon) navUserIcon.classList.add("d-none");
      if (navAuthBtn) {
        navAuthBtn.innerText = "Masuk";
        navAuthBtn.classList.remove("btn-danger");
        navAuthBtn.classList.add("btn-outline-light");
        navAuthBtn.onclick = () => window.location.href = "login.html";
      }
    }
  } catch (e) { /* ignore */ }
}

// expose some functions globally (agar bisa dipanggil dari inline HTML)
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.requireLoginBeforeNavigate = requireLoginBeforeNavigate;
window.protectCurrentPageOnLoad = protectCurrentPageOnLoad;
window.syncNavAuthUI = syncNavAuthUI;

// jalankan proteksi pada load
document.addEventListener("DOMContentLoaded", () => {
  protectCurrentPageOnLoad();
  syncNavAuthUI();
});
