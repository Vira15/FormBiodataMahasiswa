/* =========================================
   DATA NILAI DOSEN
========================================= */
let dataNilai = [];

/* =========================================
   FORM MAHASISWA
========================================= */
const formMahasiswa = document.getElementById("formMahasiswa");

if (formMahasiswa) {
    formMahasiswa.addEventListener("submit", function (event) {
        event.preventDefault();

        // Mengambil data dari form
        let nama = document.getElementById("nama").value.trim();
        let nim = document.getElementById("nim").value.trim();
        let prodi = document.getElementById("prodi").value;
        let semester = document.getElementById("semester").value;

        let genderElement = document.querySelector('input[name="gender"]:checked');
        let gender = genderElement ? genderElement.value : "";

        // Validasi kelengkapan data
        let dataLengkap = nama !== "" && nim !== "" && prodi !== "" && semester !== "" && gender !== "";

        if (!dataLengkap) {
            alert("Data mahasiswa belum lengkap. Silakan lengkapi semua data.");
            return;
        }

        // Menampilkan data jika seluruh input valid
        const output = document.getElementById("biodataOutput");
        output.innerHTML = `
            <div class="data-list">
                <div class="data-item">
                    <small>Nama Lengkap</small>
                    <strong>${nama}</strong>
                </div>
                <div class="data-item">
                    <small>NIM</small>
                    <strong>${nim}</strong>
                </div>
                <div class="data-item">
                    <small>Program Studi</small>
                    <strong>${prodi}</strong>
                </div>
                <div class="data-item">
                    <small>Semester</small>
                    <strong>Semester ${semester}</strong>
                </div>
                <div class="data-item">
                    <small>Jenis Kelamin</small>
                    <strong>${gender}</strong>
                </div>
                <div class="data-item">
                    <small>Status</small>
                    <strong>Mahasiswa Aktif</strong>
                </div>
            </div>
        `;

        alert("Data mahasiswa berhasil ditampilkan!");
    });
}

/* =========================================
   PERHITUNGAN IPK
========================================= */
const tombolIPK = document.getElementById("hitungIPK");

if (tombolIPK) {
    tombolIPK.addEventListener("click", function () {
        let nilai1 = parseFloat(document.getElementById("nilai1").value);
        let nilai2 = parseFloat(document.getElementById("nilai2").value);
        let nilai3 = parseFloat(document.getElementById("nilai3").value);
        let nilai4 = parseFloat(document.getElementById("nilai4").value);

        if (isNaN(nilai1) || isNaN(nilai2) || isNaN(nilai3) || isNaN(nilai4)) {
            alert("Masukkan semua nilai mata kuliah terlebih dahulu.");
            return;
        }

        if ([nilai1, nilai2, nilai3, nilai4].some(nilai => nilai < 0 || nilai > 4)) {
            alert("Nilai setiap mata kuliah harus berada pada rentang 0 sampai 4.");
            return;
        }

        let totalNilai = nilai1 + nilai2 + nilai3 + nilai4;
        let ipk = (totalNilai / 4).toFixed(2);
        let status;

        if (ipk >= 3.50) {
            status = "Sangat Baik";
        } else if (ipk >= 3.00) {
            status = "Baik";
        } else if (ipk >= 2.50) {
            status = "Cukup";
        } else {
            status = "Perlu Meningkatkan Prestasi";
        }

        document.getElementById("hasilIPK").innerHTML = `
            IPK Anda adalah <strong>${ipk}</strong><br>
            Keterangan: <strong>${status}</strong>
        `;
    });
}

/* =========================================
   FORM DOSEN
========================================= */
const formDosen = document.getElementById("formDosen");

if (formDosen) {
    formDosen.addEventListener("submit", function (event) {
        event.preventDefault();

        let namaDosen = document.getElementById("namaDosen").value.trim();
        let nidn = document.getElementById("nidn").value.trim();
        let prodiDosen = document.getElementById("prodiDosen").value;
        let mataKuliah = document.getElementById("mataKuliah").value.trim();

        if (namaDosen === "" || nidn === "" || prodiDosen === "" || mataKuliah === "") {
            alert("Semua data dosen harus diisi.");
            return;
        }

        document.getElementById("outputDosen").innerHTML = `
            <div class="data-list">
                <div class="data-item">
                    <small>Nama Dosen</small>
                    <strong>${namaDosen}</strong>
                </div>
                <div class="data-item">
                    <small>NIDN / NIP</small>
                    <strong>${nidn}</strong>
                </div>
                <div class="data-item">
                    <small>Program Studi</small>
                    <strong>${prodiDosen}</strong>
                </div>
                <div class="data-item">
                    <small>Mata Kuliah</small>
                    <strong>${mataKuliah}</strong>
                </div>
            </div>
        `;

        alert("Data dosen berhasil disimpan!");
    });
}

/* =========================================
   KETENTUAN & KONVERSI NILAI HURUF
========================================= */
function tentukanNilaiHuruf(nilai) {
    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        return null;
    }

    if (nilai >= 85) {
        return {
            huruf: "A",
            bobot: "4.00",
            keterangan: "Sangat Baik",
            status: "Lulus",
            badgeClass: "grade-a"
        };
    } else if (nilai >= 80) {
        return {
            huruf: "B+",
            bobot: "3.50",
            keterangan: "Baik Sekali",
            status: "Lulus",
            badgeClass: "grade-b-plus"
        };
    } else if (nilai >= 75) {
        return {
            huruf: "B",
            bobot: "3.00",
            keterangan: "Baik",
            status: "Lulus",
            badgeClass: "grade-b"
        };
    } else if (nilai >= 65) {
        return {
            huruf: "C+",
            bobot: "2.50",
            keterangan: "Cukup Baik",
            status: "Lulus",
            badgeClass: "grade-c-plus"
        };
    } else if (nilai >= 55) {
        return {
            huruf: "C",
            bobot: "2.00",
            keterangan: "Cukup",
            status: "Lulus",
            badgeClass: "grade-c"
        };
    } else if (nilai >= 40) {
        return {
            huruf: "D",
            bobot: "1.00",
            keterangan: "Kurang",
            status: "Tidak Lulus",
            badgeClass: "grade-d"
        };
    } else {
        return {
            huruf: "E",
            bobot: "0.00",
            keterangan: "Gagal",
            status: "Tidak Lulus",
            badgeClass: "grade-e"
        };
    }
}

/* =========================================
   SINKRONISASI LIVE PREVIEW & NILAI HURUF
========================================= */
const inputNilaiAngka = document.getElementById("nilaiAngka");
const inputNilaiHuruf = document.getElementById("nilaiHuruf");
const previewKonversi = document.getElementById("previewKonversi");

function updateKonversiNilai() {
    if (!inputNilaiAngka || !inputNilaiHuruf) return;

    let rawVal = inputNilaiAngka.value.trim();

    // Hapus highlight dari semua baris di pedoman tabel
    const rows = document.querySelectorAll("#pedomanTbody tr");
    rows.forEach(function (r) {
        r.classList.remove("row-active");
    });

    if (rawVal === "") {
        inputNilaiHuruf.value = "";
        if (previewKonversi) {
            previewKonversi.className = "conversion-preview";
            previewKonversi.innerHTML = `
                <span class="preview-icon">ℹ️</span>
                <span class="preview-text">
                    Ketik <strong>Nilai Angka</strong> untuk melihat penentuan nilai huruf, predikat, dan status kelulusan secara otomatis.
                </span>
            `;
        }
        return;
    }

    let nilai = parseFloat(rawVal);

    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        inputNilaiHuruf.value = "";
        if (previewKonversi) {
            previewKonversi.className = "conversion-preview active-fail";
            previewKonversi.innerHTML = `
                <span class="preview-icon">⚠️</span>
                <span class="preview-text">
                    Nilai harus berupa angka di rentang <strong>0 sampai 100</strong>.
                </span>
            `;
        }
        return;
    }

    const konversi = tentukanNilaiHuruf(nilai);
    if (konversi) {
        inputNilaiHuruf.value = konversi.huruf;

        // Berikan highlight pada baris pedoman yang cocok
        const activeRow = document.querySelector(`#pedomanTbody tr[data-grade="${konversi.huruf}"]`);
        if (activeRow) {
            activeRow.classList.add("row-active");
        }

        if (previewKonversi) {
            let isLulus = konversi.status === "Lulus";
            let statusBadge = isLulus
                ? `<span class="status-lulus">${konversi.status}</span>`
                : `<span class="status-tidak">${konversi.status}</span>`;

            previewKonversi.className = `conversion-preview ${isLulus ? "active-pass" : "active-fail"}`;
            previewKonversi.innerHTML = `
                <span class="preview-icon">${isLulus ? "✅" : "⚠️"}</span>
                <span class="preview-text">
                    Hasil: <span class="grade-badge ${konversi.badgeClass}">${konversi.huruf}</span>
                    &bull; Bobot: <strong>${konversi.bobot}</strong>
                    &bull; Predikat: <strong>${konversi.keterangan}</strong>
                    &bull; Status: ${statusBadge}
                </span>
            `;
        }
    }
}

if (inputNilaiAngka) {
    inputNilaiAngka.addEventListener("input", updateKonversiNilai);
    inputNilaiAngka.addEventListener("change", updateKonversiNilai);
}

/* =========================================
   VALIDASI NIM UNIK MAHASISWA
========================================= */
const inputNimNilai = document.getElementById("nimNilai");
const hintNimNilai = document.getElementById("hintNimNilai");

function cekDuplikasiNim() {
    if (!inputNimNilai) return false;
    let nim = inputNimNilai.value.trim();

    let duplikat = dataNilai.some(function (item) {
        return item.nim === nim;
    });

    if (duplikat && nim !== "") {
        inputNimNilai.classList.add("user-invalid");
        if (hintNimNilai) {
            hintNimNilai.textContent = "⚠️ NIM ini sudah terdaftar sebelumnya. Data NIM antar mahasiswa tidak boleh sama!";
            hintNimNilai.style.color = "#c2413a";
            hintNimNilai.style.fontWeight = "600";
        }
        return true;
    } else {
        inputNimNilai.classList.remove("user-invalid");
        if (hintNimNilai) {
            hintNimNilai.textContent = "NIM wajib diisi 9–15 angka dan tidak boleh sama dengan data mahasiswa lain.";
            hintNimNilai.style.color = "";
            hintNimNilai.style.fontWeight = "";
        }
        return false;
    }
}

if (inputNimNilai) {
    inputNimNilai.addEventListener("input", cekDuplikasiNim);
    inputNimNilai.addEventListener("change", cekDuplikasiNim);
}

/* =========================================
   INPUT NILAI MAHASISWA
========================================= */
const formNilai = document.getElementById("formNilai");

if (formNilai) {
    formNilai.addEventListener("reset", function () {
        setTimeout(function () {
            updateKonversiNilai();
            if (inputNimNilai) {
                inputNimNilai.classList.remove("user-invalid");
            }
            if (hintNimNilai) {
                hintNimNilai.textContent = "NIM wajib diisi 9–15 angka dan tidak boleh sama dengan data mahasiswa lain.";
                hintNimNilai.style.color = "";
                hintNimNilai.style.fontWeight = "";
            }
        }, 0);
    });

    formNilai.addEventListener("submit", function (event) {
        event.preventDefault();

        let nama = document.getElementById("namaMahasiswaNilai").value.trim();
        let nim = document.getElementById("nimNilai").value.trim();
        let nilaiVal = document.getElementById("nilaiAngka").value;
        let nilai = parseFloat(nilaiVal);

        if (nama === "" || nim === "" || nilaiVal === "" || isNaN(nilai)) {
            alert("Semua data nilai harus diisi.");
            return;
        }

        if (nilai < 0 || nilai > 100) {
            alert("Nilai angka harus berada pada rentang 0 sampai 100.");
            return;
        }

        // VALIDASI NIM UNIK: Tidak boleh ada NIM yang sama
        let nimSudahAda = dataNilai.some(function (item) {
            return item.nim === nim;
        });

        if (nimSudahAda) {
            alert(`NIM "${nim}" sudah pernah diinput sebelumnya!\nData NIM antar mahasiswa tidak boleh sama.`);
            if (inputNimNilai) {
                inputNimNilai.focus();
                inputNimNilai.classList.add("user-invalid");
            }
            if (hintNimNilai) {
                hintNimNilai.textContent = "⚠️ NIM ini sudah terdaftar sebelumnya. Data NIM antar mahasiswa tidak boleh sama!";
                hintNimNilai.style.color = "#c2413a";
                hintNimNilai.style.fontWeight = "600";
            }
            return;
        }

        let konversi = tentukanNilaiHuruf(nilai);
        if (!konversi) {
            alert("Nilai angka tidak valid untuk menentukan nilai huruf.");
            return;
        }

        dataNilai.push({
            nama: nama,
            nim: nim,
            nilai: nilai,
            huruf: konversi.huruf,
            bobot: konversi.bobot,
            predikat: konversi.keterangan,
            status: konversi.status,
            badgeClass: konversi.badgeClass
        });

        tampilkanTabelNilai();
        formNilai.reset();
        updateKonversiNilai();

        if (inputNimNilai) {
            inputNimNilai.classList.remove("user-invalid");
        }
        if (hintNimNilai) {
            hintNimNilai.textContent = "NIM wajib diisi 9–15 angka dan tidak boleh sama dengan data mahasiswa lain.";
            hintNimNilai.style.color = "";
            hintNimNilai.style.fontWeight = "";
        }

        alert(`Nilai mahasiswa berhasil disimpan!\nNama: ${nama}\nNIM: ${nim}\nNilai: ${nilai} → Huruf: ${konversi.huruf} (${konversi.status})`);
    });
}

/* =========================================
   MENAMPILKAN TABEL NILAI
========================================= */
function tampilkanTabelNilai() {
    const tabel = document.getElementById("tabelNilai");
    if (!tabel) return;

    if (dataNilai.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">Belum ada data nilai.</td>
            </tr>
        `;
        return;
    }

    let hasil = "";
    dataNilai.forEach(function (data, index) {
        let classStatus = data.status === "Lulus" ? "status-lulus" : "status-tidak";
        let badgeClass = data.badgeClass || "grade-a";
        let predikat = data.predikat || "-";

        hasil += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${data.nama}</strong></td>
                <td>${data.nim}</td>
                <td>${data.nilai}</td>
                <td><span class="grade-badge ${badgeClass}">${data.huruf}</span></td>
                <td>${predikat}</td>
                <td><span class="${classStatus}">${data.status}</span></td>
            </tr>
        `;
    });

    tabel.innerHTML = hasil;
}