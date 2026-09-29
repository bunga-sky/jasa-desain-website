// ===== Kontak (ganti di sini kalau ada perubahan) =====
// Isi WA_NUMBER dengan nomor WhatsApp: kode negara tanpa +, tanpa 0 di depan.
// Contoh: 0812-3456-7890 -> "6281234567890"
// Kalau diisi, pesanan langsung terisi otomatis di chat WhatsApp.
var WA_NUMBER = "6282279703234";
var WA_LINK   = "https://wa.me/qr/6LZNCNUOXRJXO1";   // dipakai kalau WA_NUMBER kosong
var EMAIL     = "bungarahmadani267@gmail.com";

document.getElementById("yr").textContent = new Date().getFullYear();

var form = document.getElementById("orderForm");
var hint = document.getElementById("hint");

// Kalau nomor WA diisi, semua tombol WA memakai nomor itu
if (WA_NUMBER) {
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.href = "https://wa.me/" + WA_NUMBER;
  });
}

// Susun teks pesanan dari isi form
function buatPesan() {
  var f = new FormData(form);
  return "Halo, saya mau pesan website.\n\n" +
    "Nama: " + f.get("nama") + "\n" +
    "Bisnis/organisasi: " + (f.get("bisnis") || "-") + "\n" +
    "Layanan: " + f.get("layanan") + "\n" +
    "Jenis website: " + (f.get("jenis") || "-") + "\n" +
    "Paket: " + (f.get("paket") || "-") + "\n" +
    "Kebutuhan: " + (f.get("pesan") || "-");
}

// Salin teks ke clipboard (dengan cadangan untuk browser yang menolak)
function salin(teks) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(teks);
  }
  return new Promise(function (ok) {
    var t = document.createElement("textarea");
    t.value = teks;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(t);
    ok();
  });
}

// Kirim lewat WhatsApp
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var pesan = buatPesan();

  if (WA_NUMBER) {
    // pesan langsung terisi di chat
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(pesan), "_blank");
    hint.textContent = "WhatsApp dibuka dengan pesan yang sudah terisi. Tinggal tekan kirim.";
    return;
  }

  // tanpa nomor: salin pesan, lalu buka chat lewat link QR
  salin(pesan).then(function () {
    hint.textContent = "Pesanan sudah disalin. Di tab WhatsApp yang terbuka, lanjutkan ke chat, lalu tempel (Ctrl+V) dan kirim.";
    window.open(WA_LINK, "_blank");
  });
});

// Kirim lewat email: membuka Gmail di browser dengan isi terisi otomatis
document.getElementById("btnEmail").addEventListener("click", function () {
  if (!form.reportValidity()) return;
  var url = "https://mail.google.com/mail/?view=cm&fs=1" +
    "&to=" + encodeURIComponent(EMAIL) +
    "&su=" + encodeURIComponent("Pesan website") +
    "&body=" + encodeURIComponent(buatPesan());
  window.open(url, "_blank");
  hint.textContent = "Gmail dibuka dengan pesan yang sudah terisi. Tinggal tekan kirim.";
});

// Tombol "Pesan paket ini": isi form otomatis sesuai paket yang dipilih
var picked = document.getElementById("picked");
document.querySelectorAll(".pick").forEach(function (btn) {
  btn.addEventListener("click", function () {
    form.elements.jenis.value = btn.dataset.jenis;
    form.elements.layanan.value = "Pembuatan website baru";
    document.getElementById("paket").value = btn.dataset.paket;
    picked.textContent = "Paket dipilih: " + btn.dataset.paket;
    picked.hidden = false;
  });
});
