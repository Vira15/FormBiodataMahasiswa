/**
 * ====================================================================
 * APLIKASI AKADEMIK - PORTAL MAHASISWA & DOSEN
 * Pemrograman Visual - Pertemuan 5: Redesign UI/UX
 * ====================================================================
 */

// DATA AWAL (DEFAULT MOCK DATA SESUAI CONTOH MATERI PDF)
const DEFAULT_MAHASISWA = [
    {
        nim: "23010101",
        nama: "Naila Putri",
        prodi: "Teknik Informatika",
        semester: "3",
        gender: "Perempuan",
        status: "Aktif",
        createdAt: "2026-09-01"
    },
    {
        nim: "23010102",
        nama: "Bima Arya",
        prodi: "Sistem Informasi",
        semester: "5",
        gender: "Laki-laki",
        status: "Aktif",
        createdAt: "2026-09-02"
    },
    {
        nim: "23010103",
        nama: "Sari Dewi",
        prodi: "Teknik Informatika",
        semester: "3",
        gender: "Perempuan",
        status: "Cuti",
        createdAt: "2026-09-03"
    },
    {
        nim: "23010104",
        nama: "Ahmad Fauzi",
        prodi: "Manajemen Informatika",
        semester: "1",
        gender: "Laki-laki",
        status: "Aktif",
        createdAt: "2026-09-05"
    },
    {
        nim: "23010105",
        nama: "Rian Pratama",
        prodi: "Teknik Industri",
        semester: "7",
        gender: "Laki-laki",
        status: "Tidak Aktif",
        createdAt: "2026-09-06"
    }
];

const DEFAULT_DOSEN = [
    {
        nidn: "0412038501",
        nama: "Dr. Hendra Gunawan, M.Kom.",
        prodi: "Teknik Informatika",
        mataKuliah: "Pemrograman Visual",
        status: "Tetap",
        email: "hendra.gunawan@kampus.ac.id"
    },
    {
        nidn: "0425088802",
        nama: "Siti Rahmawati, S.Kom., M.T.",
        prodi: "Sistem Informasi",
        mataKuliah: "Basis Data Lanjut",
        status: "Tetap",
        email: "siti.rahma@kampus.ac.id"
    },
    {
        nidn: "0409019003",
        nama: "Budi Santoso, M.T.",
        prodi: "Teknik Industri",
        mataKuliah: "Manajemen Rekayasa",
        status: "Luar Biasa",
        email: "budi.santoso@kampus.ac.id"
    }
];

const DEFAULT_NILAI = [
    {
        nim: "23010101",
        nama: "Naila Putri",
        nilai: 88,
        huruf: "A",
        bobot: "4.00",
        predikat: "Sangat Baik",
        status: "Lulus",
        badgeClass: "grade-a"
    },
    {
        nim: "23010102",
        nama: "Bima Arya",
        nilai: 78,
        huruf: "B",
        bobot: "3.00",
        predikat: "Baik",
        status: "Lulus",
        badgeClass: "grade-b"
    }
];

/* ====================================================================
 * STORAGE MANAGER (LOCAL STORAGE PERSISTENCE)
 * ==================================================================== */
function getMahasiswaData() {
    const data = localStorage.getItem("app_data_mahasiswa");
    if (!data) {
        localStorage.setItem("app_data_mahasiswa", JSON.stringify(DEFAULT_MAHASISWA));
        return DEFAULT_MAHASISWA;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_MAHASISWA;
    }
}

function saveMahasiswaData(data) {
    localStorage.setItem("app_data_mahasiswa", JSON.stringify(data));
    updateDashboardStats();
}

function getDosenData() {
    const data = localStorage.getItem("app_data_dosen");
    if (!data) {
        localStorage.setItem("app_data_dosen", JSON.stringify(DEFAULT_DOSEN));
        return DEFAULT_DOSEN;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_DOSEN;
    }
}

function saveDosenData(data) {
    localStorage.setItem("app_data_dosen", JSON.stringify(data));
    updateDashboardStats();
}

function getNilaiData() {
    const data = localStorage.getItem("app_data_nilai");
    if (!data) {
        localStorage.setItem("app_data_nilai", JSON.stringify(DEFAULT_NILAI));
        return DEFAULT_NILAI;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_NILAI;
    }
}

function saveNilaiData(data) {
    localStorage.setItem("app_data_nilai", JSON.stringify(data));
    updateDashboardStats();
}

/* ====================================================================
 * FEEDBACK & ALERT SYSTEM (MEMENUHI PRINSIP UX PDF HAL. 8)
 * "Feedback harus menjawab: apa yang terjadi dan apa langkah berikutnya?"
 * ==================================================================== */
function showAlert(containerId, message, type = "success", nextStep = "") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iconMap = {
        success: "bi-check-circle-fill",
        danger: "bi-exclamation-triangle-fill",
        warning: "bi-exclamation-circle-fill",
        info: "bi-info-circle-fill"
    };

    const icon = iconMap[type] || "bi-info-circle-fill";
    const subText = nextStep ? `<div class="alert-subtext mt-1 text-muted small"><i class="bi bi-arrow-right-short"></i> Langkah berikutnya: ${nextStep}</div>` : "";

    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show d-flex align-items-start gap-2 shadow-sm rounded-3 py-2 px-3 mb-3 border-0" role="alert">
            <i class="bi ${icon} fs-5 flex-shrink-0 mt-1"></i>
            <div class="flex-grow-1">
                <div class="fw-semibold">${message}</div>
                ${subText}
            </div>
            <button type="button" class="btn-close ms-auto p-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Auto dismiss setelah 5 detik untuk notifikasi sukses
    if (type === "success") {
        setTimeout(() => {
            const alertElement = container.querySelector(".alert");
            if (alertElement && typeof bootstrap !== "undefined" && bootstrap.Alert) {
                const bsAlert = new bootstrap.Alert(alertElement);
                bsAlert.close();
            }
        }, 5000);
    }
}

/* ====================================================================
 * MODUL MAHASISWA (FORM, TABEL, FILTER, CRUD, MODAL)
 * ==================================================================== */
let currentEditNim = null;

function renderTabelMahasiswa(filterQuery = "", statusFilter = "", prodiFilter = "") {
    const tbody = document.getElementById("tabelMahasiswaBody");
    const countBadge = document.getElementById("totalMahasiswaBadge");
    const emptyState = document.getElementById("tabelEmptyState");
    const tableElement = document.getElementById("tabelMahasiswa");

    if (!tbody) return;

    let list = getMahasiswaData();

    // Filter logic
    let filtered = list.filter(item => {
        const matchesQuery = !filterQuery || 
            item.nama.toLowerCase().includes(filterQuery.toLowerCase()) || 
            item.nim.includes(filterQuery);
        
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesProdi = !prodiFilter || item.prodi === prodiFilter;

        return matchesQuery && matchesStatus && matchesProdi;
    });

    if (countBadge) {
        countBadge.textContent = `${filtered.length} dari ${list.length} Mahasiswa`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = "";
        if (emptyState) emptyState.classList.remove("d-none");
        if (tableElement) tableElement.classList.add("d-none");
        return;
    }

    if (emptyState) emptyState.classList.add("d-none");
    if (tableElement) tableElement.classList.remove("d-none");

    tbody.innerHTML = filtered.map((mhs, idx) => {
        let badgeColor = "bg-success";
        if (mhs.status === "Cuti") badgeColor = "bg-warning text-dark";
        if (mhs.status === "Tidak Aktif") badgeColor = "bg-danger";

        return `
            <tr class="align-middle">
                <td class="text-center text-muted fw-semibold">${idx + 1}</td>
                <td>
                    <span class="badge bg-light text-primary font-monospace px-2 py-1 border border-primary-subtle">${mhs.nim}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle flex-shrink-0">
                            ${mhs.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span class="fw-bold text-dark d-block">${mhs.nama}</span>
                            <small class="text-muted"><i class="bi bi-gender-${mhs.gender === 'Laki-laki' ? 'male' : 'female'}"></i> ${mhs.gender || '-'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary-subtle text-secondary-emphasis px-2 py-1 rounded-pill">${mhs.prodi}</span>
                </td>
                <td class="text-center">
                    <span class="badge bg-info-subtle text-info-emphasis rounded-pill px-2">Sem. ${mhs.semester}</span>
                </td>
                <td>
                    <span class="badge ${badgeColor} px-2.5 py-1.5 rounded-pill shadow-xs">
                        <i class="bi bi-circle-fill me-1" style="font-size: 0.5rem;"></i>${mhs.status}
                    </span>
                </td>
                <td class="text-center text-nowrap">
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-info" title="Detail Data" onclick="lihatDetailMahasiswa('${mhs.nim}')">
                            <i class="bi bi-eye"></i><span class="d-none d-md-inline ms-1">Detail</span>
                        </button>
                        <button type="button" class="btn btn-outline-warning" title="Ubah Data" onclick="mulaiEditMahasiswa('${mhs.nim}')">
                            <i class="bi bi-pencil-square"></i><span class="d-none d-md-inline ms-1">Ubah</span>
                        </button>
                        <button type="button" class="btn btn-outline-danger" title="Hapus Data" onclick="hapusMahasiswa('${mhs.nim}')">
                            <i class="bi bi-trash3"></i><span class="d-none d-md-inline ms-1">Hapus</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// LIHAT DETAIL MAHASISWA (MODAL)
function lihatDetailMahasiswa(nim) {
    const list = getMahasiswaData();
    const mhs = list.find(item => item.nim === nim);
    if (!mhs) return;

    document.getElementById("detailNim").textContent = mhs.nim;
    document.getElementById("detailNama").textContent = mhs.nama;
    document.getElementById("detailProdi").textContent = mhs.prodi;
    document.getElementById("detailSemester").textContent = `Semester ${mhs.semester}`;
    document.getElementById("detailGender").textContent = mhs.gender || "-";
    
    const statusElem = document.getElementById("detailStatus");
    if (statusElem) {
        let badgeColor = "bg-success";
        if (mhs.status === "Cuti") badgeColor = "bg-warning text-dark";
        if (mhs.status === "Tidak Aktif") badgeColor = "bg-danger";
        statusElem.className = `badge ${badgeColor} px-3 py-2 rounded-pill fs-6`;
        statusElem.textContent = mhs.status;
    }

    const avatarElem = document.getElementById("detailAvatar");
    if (avatarElem) {
        avatarElem.textContent = mhs.nama.charAt(0).toUpperCase();
    }

    const modalElem = document.getElementById("modalDetailMahasiswa");
    if (modalElem && typeof bootstrap !== "undefined") {
        const modal = new bootstrap.Modal(modalElem);
        modal.show();
    }
}

// EDIT MAHASISWA
function mulaiEditMahasiswa(nim) {
    const list = getMahasiswaData();
    const mhs = list.find(item => item.nim === nim);
    if (!mhs) return;

    currentEditNim = nim;

    // Isi form
    document.getElementById("nama").value = mhs.nama;
    const nimInput = document.getElementById("nim");
    nimInput.value = mhs.nim;
    nimInput.readOnly = false; // NIM DAPAT DIEDIT SECARA BEBAS
    nimInput.classList.remove("is-invalid");
    nimInput.classList.add("is-valid");

    document.getElementById("prodi").value = mhs.prodi;
    document.getElementById("semester").value = mhs.semester;

    // Radio gender
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach(radio => {
        radio.checked = (radio.value === mhs.gender);
    });

    // Status select / radio
    const statusSelect = document.getElementById("statusMahasiswa");
    if (statusSelect) {
        statusSelect.value = mhs.status;
    }

    // Ubah UI Form ke mode Edit
    const formTitle = document.getElementById("formMahasiswaTitle");
    const submitBtn = document.getElementById("btnSubmitMahasiswa");
    const cancelBtn = document.getElementById("btnCancelEdit");
    const hintNim = document.getElementById("hintNimMahasiswa");

    if (formTitle) formTitle.innerHTML = `<i class="bi bi-pencil-square text-warning me-2"></i>Ubah Data Mahasiswa`;
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="bi bi-check2-circle me-1"></i>Perbarui Data`;
        submitBtn.className = "btn btn-warning px-4 fw-semibold text-dark";
    }
    if (cancelBtn) cancelBtn.classList.remove("d-none");
    if (hintNim) hintNim.textContent = "NIM dapat diedit bebas (8–15 digit angka).";

    // Scroll halus ke form
    document.getElementById("cardFormMahasiswa")?.scrollIntoView({ behavior: "smooth", block: "start" });

    showAlert("alertMahasiswaContainer", `Mode ubah aktif untuk mahasiswa: <strong>${mhs.nama}</strong> (${mhs.nim})`, "info", "Perbarui isian yang diinginkan (termasuk NIM jika ada kesalahan), lalu klik tombol 'Perbarui Data'.");
}

function batalEditMahasiswa() {
    currentEditNim = null;
    const form = document.getElementById("formMahasiswa");
    if (form) form.reset();

    const nimInput = document.getElementById("nim");
    if (nimInput) {
        nimInput.readOnly = false;
        nimInput.classList.remove("is-valid", "is-invalid");
    }

    const formTitle = document.getElementById("formMahasiswaTitle");
    const submitBtn = document.getElementById("btnSubmitMahasiswa");
    const cancelBtn = document.getElementById("btnCancelEdit");
    const hintNim = document.getElementById("hintNimMahasiswa");

    if (formTitle) formTitle.innerHTML = `<i class="bi bi-person-plus text-primary me-2"></i>Tambah Mahasiswa`;
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="bi bi-save me-1"></i>Simpan Data`;
        submitBtn.className = "btn btn-primary px-4 fw-semibold";
    }
    if (cancelBtn) cancelBtn.classList.add("d-none");
    if (hintNim) hintNim.textContent = "Wajib diisi 8–15 angka tanpa spasi atau huruf.";

    // Reset validasi class
    form?.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));

    showAlert("alertMahasiswaContainer", "Mode ubah dibatalkan. Form kembali siap untuk menambah data baru.", "secondary");
}

// HAPUS MAHASISWA
function hapusMahasiswa(nim) {
    const list = getMahasiswaData();
    const mhs = list.find(item => item.nim === nim);
    if (!mhs) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data mahasiswa "${mhs.nama}" (${mhs.nim})? Data yang dihapus tidak dapat dikembalikan.`)) {
        const updatedList = list.filter(item => item.nim !== nim);
        saveMahasiswaData(updatedList);
        renderTabelMahasiswa();

        if (currentEditNim === nim) {
            batalEditMahasiswa();
        }

        showAlert("alertMahasiswaContainer", `Data mahasiswa <strong>${mhs.nama}</strong> (${nim}) berhasil dihapus.`, "danger", "Data di tabel telah diperbarui secara otomatis.");
    }
}

// INIT FORM MAHASISWA SUBMIT & LIVE VALIDATION
function initFormMahasiswa() {
    const form = document.getElementById("formMahasiswa");
    if (!form) return;

    const inputNama = document.getElementById("nama");
    const inputNim = document.getElementById("nim");
    const selectProdi = document.getElementById("prodi");
    const selectSemester = document.getElementById("semester");
    const selectStatus = document.getElementById("statusMahasiswa");
    const btnCancel = document.getElementById("btnCancelEdit");

    if (btnCancel) {
        btnCancel.addEventListener("click", batalEditMahasiswa);
    }

    // Validasi Realtime Input Nama (Hanya huruf dan spasi, min 3 karakter)
    if (inputNama) {
        inputNama.addEventListener("input", function () {
            const val = this.value.trim();
            const valid = val.length >= 3 && /^[A-Za-z\s'.-]+$/.test(val);
            if (val === "") {
                this.classList.remove("is-valid", "is-invalid");
            } else if (valid) {
                this.classList.remove("is-invalid");
                this.classList.add("is-valid");
            } else {
                this.classList.remove("is-valid");
                this.classList.add("is-invalid");
            }
        });
    }

    // Validasi Realtime NIM (8-15 digit, unik jika bukan sedang edit data yang sama)
    if (inputNim) {
        inputNim.addEventListener("input", function () {
            const val = this.value.trim();
            const list = getMahasiswaData();
            const isDuplicate = list.some(item => item.nim === val && item.nim !== currentEditNim);
            const isValidFormat = /^[0-9]{8,15}$/.test(val);

            const feedbackElem = document.getElementById("feedbackNim");

            if (val === "") {
                this.classList.remove("is-valid", "is-invalid");
            } else if (isDuplicate) {
                this.classList.remove("is-valid");
                this.classList.add("is-invalid");
                if (feedbackElem) feedbackElem.textContent = "NIM sudah terdaftar! Gunakan NIM mahasiswa yang lain.";
            } else if (!isValidFormat) {
                this.classList.remove("is-valid");
                this.classList.add("is-invalid");
                if (feedbackElem) feedbackElem.textContent = "NIM harus berupa 8 sampai 15 digit angka.";
            } else {
                this.classList.remove("is-invalid");
                this.classList.add("is-valid");
            }
        });
    }

    // Submit handler
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = inputNama.value.trim();
        const nim = inputNim.value.trim();
        const prodi = selectProdi.value;
        const semester = selectSemester.value;
        const status = selectStatus ? selectStatus.value : "Aktif";

        const genderElem = document.querySelector('input[name="gender"]:checked');
        const gender = genderElem ? genderElem.value : "";

        // Validasi kelengkapan
        if (!nama || !nim || !prodi || !semester || !gender || !status) {
            showAlert("alertMahasiswaContainer", "Harap lengkapi semua field bertanda bintang (*) sebelum menyimpan.", "warning", "Periksa kembali isian Nama, NIM, Prodi, Semester, Jenis Kelamin, dan Status.");
            return;
        }

        // Format validasi (8–15 digit angka)
        if (!/^[0-9]{8,15}$/.test(nim)) {
            showAlert("alertMahasiswaContainer", "NIM tidak valid. Harus berisi 8–15 digit angka tanpa huruf.", "danger", "Koreksi input NIM Anda pada form.");
            inputNim.focus();
            return;
        }

        let list = getMahasiswaData();

        if (currentEditNim) {
            // Mode Update
            // Cek apakah NIM diubah ke NIM yang sudah dipakai mahasiswa lain
            const duplikat = list.some(item => item.nim === nim && item.nim !== currentEditNim);
            if (duplikat) {
                showAlert("alertMahasiswaContainer", `NIM <strong>${nim}</strong> sudah digunakan oleh mahasiswa lain!`, "danger", "Gunakan NIM yang berbeda agar data tidak bertabrakan.");
                inputNim.focus();
                return;
            }

            const index = list.findIndex(item => item.nim === currentEditNim);
            if (index !== -1) {
                list[index] = {
                    ...list[index],
                    nim, // NIM diperbarui jika diedit!
                    nama,
                    prodi,
                    semester,
                    gender,
                    status,
                    updatedAt: new Date().toISOString()
                };
                saveMahasiswaData(list);
                renderTabelMahasiswa();
                batalEditMahasiswa();
                showAlert("alertMahasiswaContainer", `✓ Data mahasiswa <strong>${nama}</strong> (${nim}) berhasil diperbarui!`, "success", "Anda dapat melihat perubahan pada tabel daftar mahasiswa di samping.");
            }
        } else {
            // Mode Tambah Baru - Cek Duplikasi NIM
            const duplikat = list.some(item => item.nim === nim);
            if (duplikat) {
                showAlert("alertMahasiswaContainer", `NIM <strong>${nim}</strong> sudah pernah terdaftar pada sistem!`, "danger", "Gunakan NIM yang berbeda agar data tidak bertabrakan.");
                inputNim.focus();
                return;
            }

            const newMhs = {
                nim,
                nama,
                prodi,
                semester,
                gender,
                status,
                createdAt: new Date().toISOString().split("T")[0]
            };

            list.unshift(newMhs); // Tambahkan ke paling atas
            saveMahasiswaData(list);
            renderTabelMahasiswa();
            form.reset();
            form.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));

            showAlert("alertMahasiswaContainer", `✓ Data mahasiswa <strong>${nama}</strong> (${nim}) berhasil disimpan!`, "success", "Data langsung ditambahkan ke tabel. Anda dapat mengklik tombol 'Detail' untuk melihat ringkasan.");
        }
    });

    // Reset handler
    form.addEventListener("reset", function () {
        setTimeout(() => {
            if (currentEditNim) {
                batalEditMahasiswa();
            }
            form.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));
        }, 10);
    });
}

// SEARCH & FILTER LISTENERS
function initSearchAndFilterMahasiswa() {
    const searchInput = document.getElementById("searchMahasiswa");
    const filterStatus = document.getElementById("filterStatusMahasiswa");
    const filterProdi = document.getElementById("filterProdiMahasiswa");
    const btnResetFilter = document.getElementById("btnResetFilter");

    function triggerFilter() {
        const query = searchInput ? searchInput.value.trim() : "";
        const status = filterStatus ? filterStatus.value : "";
        const prodi = filterProdi ? filterProdi.value : "";
        renderTabelMahasiswa(query, status, prodi);
    }

    if (searchInput) searchInput.addEventListener("input", triggerFilter);
    if (filterStatus) filterStatus.addEventListener("change", triggerFilter);
    if (filterProdi) filterProdi.addEventListener("change", triggerFilter);

    if (btnResetFilter) {
        btnResetFilter.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (filterStatus) filterStatus.value = "";
            if (filterProdi) filterProdi.value = "";
            renderTabelMahasiswa();
        });
    }
}

/* ====================================================================
 * MODUL PERHITUNGAN IPK (REALTIME & VALIDASI 0-4)
 * ==================================================================== */
function initHitungIPK() {
    const btnHitung = document.getElementById("hitungIPK");
    const btnReset = document.getElementById("resetIPK");
    const input1 = document.getElementById("nilai1");
    const input2 = document.getElementById("nilai2");
    const input3 = document.getElementById("nilai3");
    const input4 = document.getElementById("nilai4");
    const hasilContainer = document.getElementById("hasilIPK");
    const progressIpk = document.getElementById("progressIpk");

    if (!btnHitung || !input1) return;

    function hitung() {
        const v1 = parseFloat(input1.value);
        const v2 = parseFloat(input2.value);
        const v3 = parseFloat(input3.value);
        const v4 = parseFloat(input4.value);

        if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4)) {
            showAlert("alertIpkContainer", "Harap masukkan nilai untuk keempat mata kuliah.", "warning", "Nilai harus berada pada skala 0.00 sampai 4.00.");
            return;
        }

        const nilaiArray = [v1, v2, v3, v4];
        const outOfRange = nilaiArray.some(n => n < 0 || n > 4);

        if (outOfRange) {
            showAlert("alertIpkContainer", "Nilai setiap mata kuliah harus berada pada rentang 0.00 sampai 4.00.", "danger", "Koreksi nilai angka yang melebihi 4.00 atau kurang dari 0.");
            return;
        }

        const total = v1 + v2 + v3 + v4;
        const ipk = (total / 4).toFixed(2);
        const ipkNum = parseFloat(ipk);

        let predikat = "";
        let badgeClass = "";
        let barColor = "";

        if (ipkNum >= 3.50) {
            predikat = "Sangat Baik (Dengan Pujian / Cumlaude)";
            badgeClass = "bg-success";
            barColor = "bg-success";
        } else if (ipkNum >= 3.00) {
            predikat = "Baik (Sangat Memuaskan)";
            badgeClass = "bg-primary";
            barColor = "bg-primary";
        } else if (ipkNum >= 2.50) {
            predikat = "Cukup (Memuaskan)";
            badgeClass = "bg-warning text-dark";
            barColor = "bg-warning";
        } else {
            predikat = "Perlu Peningkatan Prestasi";
            badgeClass = "bg-danger";
            barColor = "bg-danger";
        }

        const percentage = Math.min(100, (ipkNum / 4) * 100);

        if (hasilContainer) {
            hasilContainer.innerHTML = `
                <div class="card border-0 bg-primary-subtle rounded-3 p-3 text-center">
                    <p class="text-muted small mb-1">HASIL PERHITUNGAN INDEKS PRESTASI</p>
                    <h2 class="display-5 fw-bold text-primary mb-1">${ipk} <span class="fs-6 text-muted">/ 4.00</span></h2>
                    <div class="mb-2">
                        <span class="badge ${badgeClass} fs-6 px-3 py-1.5 rounded-pill">${predikat}</span>
                    </div>
                    <div class="progress mt-2" style="height: 10px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated ${barColor}" role="progressbar" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }

        showAlert("alertIpkContainer", `Kalkulasi IPK berhasil: <strong>${ipk}</strong> (${predikat})`, "success", "Gunakan hasil capaian ini sebagai acuan evaluasi akademik semester Anda.");
    }

    btnHitung.addEventListener("click", hitung);

    if (btnReset) {
        btnReset.addEventListener("click", function () {
            input1.value = "";
            input2.value = "";
            input3.value = "";
            input4.value = "";
            if (hasilContainer) {
                hasilContainer.innerHTML = `
                    <div class="text-center text-muted py-3">
                        <i class="bi bi-calculator display-6 d-block mb-1 text-secondary opacity-50"></i>
                        Masukkan nilai 4 mata kuliah (skala 0.00 – 4.00) lalu klik <strong>Hitung IPK</strong>.
                    </div>
                `;
            }
        });
    }
}

/* ====================================================================
 * MODUL DATA DOSEN & PENILAIAN MAHASISWA (dosen.html)
 * ==================================================================== */
function tentukanNilaiHuruf(nilai) {
    if (isNaN(nilai) || nilai < 0 || nilai > 100) return null;

    if (nilai >= 85) {
        return { huruf: "A", bobot: "4.00", keterangan: "Sangat Baik", status: "Lulus", badgeClass: "grade-a" };
    } else if (nilai >= 80) {
        return { huruf: "B+", bobot: "3.50", keterangan: "Baik Sekali", status: "Lulus", badgeClass: "grade-b-plus" };
    } else if (nilai >= 75) {
        return { huruf: "B", bobot: "3.00", keterangan: "Baik", status: "Lulus", badgeClass: "grade-b" };
    } else if (nilai >= 65) {
        return { huruf: "C+", bobot: "2.50", keterangan: "Cukup Baik", status: "Lulus", badgeClass: "grade-c-plus" };
    } else if (nilai >= 55) {
        return { huruf: "C", bobot: "2.00", keterangan: "Cukup", status: "Lulus", badgeClass: "grade-c" };
    } else if (nilai >= 40) {
        return { huruf: "D", bobot: "1.00", keterangan: "Kurang", status: "Tidak Lulus", badgeClass: "grade-d" };
    } else {
        return { huruf: "E", bobot: "0.00", keterangan: "Gagal", status: "Tidak Lulus", badgeClass: "grade-e" };
    }
}

function renderTabelDosen() {
    const tbody = document.getElementById("tabelDosenBody");
    const countBadge = document.getElementById("totalDosenBadge");
    if (!tbody) return;

    const list = getDosenData();
    if (countBadge) countBadge.textContent = `${list.length} Dosen Terdaftar`;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada data dosen terdaftar.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((dsn, idx) => `
        <tr class="align-middle">
            <td class="text-center text-muted fw-semibold">${idx + 1}</td>
            <td><span class="badge bg-light text-primary font-monospace px-2 py-1 border">${dsn.nidn}</span></td>
            <td>
                <span class="fw-bold text-dark d-block">${dsn.nama}</span>
                <small class="text-muted"><i class="bi bi-envelope"></i> ${dsn.email || '-'}</small>
            </td>
            <td><span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">${dsn.prodi}</span></td>
            <td><span class="fw-semibold text-primary-emphasis">${dsn.mataKuliah}</span></td>
            <td><span class="badge ${dsn.status === 'Tetap' ? 'bg-success' : 'bg-info'} rounded-pill">${dsn.status || 'Tetap'}</span></td>
            <td class="text-center">
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="hapusDosen('${dsn.nidn}')" title="Hapus Dosen">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function hapusDosen(nidn) {
    const list = getDosenData();
    const dsn = list.find(d => d.nidn === nidn);
    if (!dsn) return;

    if (confirm(`Hapus data dosen "${dsn.nama}" (${dsn.nidn})?`)) {
        const updated = list.filter(d => d.nidn !== nidn);
        saveDosenData(updated);
        renderTabelDosen();
        showAlert("alertDosenContainer", `Data dosen <strong>${dsn.nama}</strong> berhasil dihapus.`, "danger");
    }
}

function initFormDosen() {
    const form = document.getElementById("formDosen");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = document.getElementById("namaDosen").value.trim();
        const nidn = document.getElementById("nidn").value.trim();
        const prodi = document.getElementById("prodiDosen").value;
        const mataKuliah = document.getElementById("mataKuliah").value.trim();
        const email = document.getElementById("emailDosen") ? document.getElementById("emailDosen").value.trim() : "";
        const status = document.getElementById("statusDosen") ? document.getElementById("statusDosen").value : "Tetap";

        if (!nama || !nidn || !prodi || !mataKuliah) {
            showAlert("alertDosenContainer", "Harap isi semua field wajib data dosen.", "warning");
            return;
        }

        let list = getDosenData();
        if (list.some(d => d.nidn === nidn)) {
            showAlert("alertDosenContainer", `NIDN/NIP <strong>${nidn}</strong> sudah terdaftar!`, "danger");
            return;
        }

        list.push({ nidn, nama, prodi, mataKuliah, email, status });
        saveDosenData(list);
        renderTabelDosen();
        form.reset();
        showAlert("alertDosenContainer", `✓ Data dosen <strong>${nama}</strong> berhasil disimpan!`, "success", "Data langsung masuk ke tabel rekap dosen.");
    });
}

function renderTabelNilai() {
    const tbody = document.getElementById("tabelNilai");
    if (!tbody) return;

    const list = getNilaiData();
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada data nilai mahasiswa tersimpan.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((item, idx) => {
        const isLulus = item.status === "Lulus";
        const statusBadge = isLulus ? '<span class="badge bg-success rounded-pill px-2.5">Lulus</span>' : '<span class="badge bg-danger rounded-pill px-2.5">Tidak Lulus</span>';
        const gradeBadge = `<span class="badge bg-primary px-2.5 py-1 rounded-pill fw-bold">${item.huruf}</span>`;

        return `
            <tr class="align-middle">
                <td class="text-center text-muted fw-semibold">${idx + 1}</td>
                <td><strong>${item.nama}</strong></td>
                <td><span class="badge bg-light text-primary border font-monospace">${item.nim}</span></td>
                <td class="text-center fw-bold">${item.nilai}</td>
                <td class="text-center">${gradeBadge}</td>
                <td>${item.predikat || '-'}</td>
                <td class="text-center">${statusBadge}</td>
            </tr>
        `;
    }).join("");
}

function initInputNilai() {
    const formNilai = document.getElementById("formNilai");
    const inputAngka = document.getElementById("nilaiAngka");
    const inputHuruf = document.getElementById("nilaiHuruf");
    const previewBox = document.getElementById("previewKonversi");
    const inputNim = document.getElementById("nimNilai");
    const hintNim = document.getElementById("hintNimNilai");

    if (!formNilai || !inputAngka) return;

    function updateLivePreview() {
        const raw = inputAngka.value.trim();
        const rows = document.querySelectorAll("#pedomanTbody tr");
        rows.forEach(r => r.classList.remove("table-primary", "fw-bold"));

        if (!raw) {
            inputHuruf.value = "";
            if (previewBox) {
                previewBox.className = "alert alert-secondary py-2 px-3 small d-flex align-items-center gap-2 mb-3";
                previewBox.innerHTML = `<i class="bi bi-info-circle"></i> Ketik Nilai Angka untuk konversi otomatis ke nilai huruf.`;
            }
            return;
        }

        const num = parseFloat(raw);
        if (isNaN(num) || num < 0 || num > 100) {
            inputHuruf.value = "";
            if (previewBox) {
                previewBox.className = "alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3";
                previewBox.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Nilai harus berada dalam rentang 0.00 sampai 100.00.`;
            }
            return;
        }

        const konversi = tentukanNilaiHuruf(num);
        if (konversi) {
            inputHuruf.value = konversi.huruf;
            const targetRow = document.querySelector(`#pedomanTbody tr[data-grade="${konversi.huruf}"]`);
            if (targetRow) targetRow.classList.add("table-primary", "fw-bold");

            const isLulus = konversi.status === "Lulus";
            if (previewBox) {
                previewBox.className = `alert ${isLulus ? 'alert-success' : 'alert-danger'} py-2 px-3 small d-flex align-items-center gap-2 mb-3`;
                previewBox.innerHTML = `
                    <i class="bi ${isLulus ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} fs-6"></i>
                    <div>
                        Nilai Huruf: <strong>${konversi.huruf}</strong> &bull; Bobot: <strong>${konversi.bobot}</strong> &bull; Predikat: <strong>${konversi.keterangan}</strong> &bull; Status: <strong>${konversi.status}</strong>
                    </div>
                `;
            }
        }
    }

    inputAngka.addEventListener("input", updateLivePreview);

    if (inputNim && hintNim) {
        inputNim.addEventListener("input", function () {
            const nim = this.value.trim();
            const listNilai = getNilaiData();
            const exists = listNilai.some(n => n.nim === nim);

            if (exists) {
                this.classList.add("is-invalid");
                hintNim.textContent = "⚠️ NIM ini sudah memiliki catatan nilai pada tabel.";
                hintNim.className = "form-text text-danger fw-semibold";
            } else {
                this.classList.remove("is-invalid");
                hintNim.textContent = "NIM wajib diisi 8–15 angka dan belum pernah diinput.";
                hintNim.className = "form-text text-muted";
            }
        });
    }

    formNilai.addEventListener("submit", function (e) {
        e.preventDefault();

        const nama = document.getElementById("namaMahasiswaNilai").value.trim();
        const nim = document.getElementById("nimNilai").value.trim();
        const nilaiVal = inputAngka.value.trim();
        const nilai = parseFloat(nilaiVal);

        if (!nama || !nim || isNaN(nilai)) {
            showAlert("alertNilaiContainer", "Harap isi Nama, NIM, dan Nilai Angka.", "warning");
            return;
        }

        if (nilai < 0 || nilai > 100) {
            showAlert("alertNilaiContainer", "Nilai harus di rentang 0 – 100.", "danger");
            return;
        }

        let listNilai = getNilaiData();
        if (listNilai.some(n => n.nim === nim)) {
            showAlert("alertNilaiContainer", `NIM <strong>${nim}</strong> sudah tercatat pada tabel nilai!`, "danger", "Hapus atau edit data sebelumnya jika ingin mengganti.");
            return;
        }

        const konv = tentukanNilaiHuruf(nilai);
        listNilai.push({
            nama,
            nim,
            nilai,
            huruf: konv.huruf,
            bobot: konv.bobot,
            predikat: konv.keterangan,
            status: konv.status
        });

        saveNilaiData(listNilai);
        renderTabelNilai();
        formNilai.reset();
        updateLivePreview();
        showAlert("alertNilaiContainer", `✓ Nilai mahasiswa <strong>${nama}</strong> (${nim}) berhasil disimpan! Nilai: ${nilai} → ${konv.huruf} (${konv.status})`, "success");
    });
}

/* ====================================================================
 * DASHBOARD STATS SYNCHRONIZER (index.html)
 * ==================================================================== */
function updateDashboardStats() {
    const countMhsElem = document.getElementById("dashTotalMahasiswa");
    const countDosenElem = document.getElementById("dashTotalDosen");
    const countProdiElem = document.getElementById("dashTotalProdi");
    const avgIpkElem = document.getElementById("dashRataIpk");
    const recentMhsBody = document.getElementById("dashRecentMahasiswa");

    const mhsList = getMahasiswaData();
    const dosenList = getDosenData();

    if (countMhsElem) countMhsElem.textContent = mhsList.length;
    if (countDosenElem) countDosenElem.textContent = dosenList.length;
    if (countProdiElem) countProdiElem.textContent = "4"; // 4 Program Studi
    if (avgIpkElem) avgIpkElem.textContent = "3.52";

    if (recentMhsBody) {
        if (mhsList.length === 0) {
            recentMhsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">Belum ada data mahasiswa.</td></tr>`;
            return;
        }

        const top3 = mhsList.slice(0, 4);
        recentMhsBody.innerHTML = top3.map((mhs, i) => {
            let badgeColor = "bg-success";
            if (mhs.status === "Cuti") badgeColor = "bg-warning text-dark";
            if (mhs.status === "Tidak Aktif") badgeColor = "bg-danger";

            return `
                <tr class="align-middle">
                    <td><span class="badge bg-light text-primary border font-monospace">${mhs.nim}</span></td>
                    <td class="fw-semibold">${mhs.nama}</td>
                    <td><span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">${mhs.prodi}</span></td>
                    <td class="text-center"><span class="badge ${badgeColor} rounded-pill">${mhs.status}</span></td>
                    <td class="text-end">
                        <a href="mahasiswa.html" class="btn btn-outline-primary btn-sm py-0 px-2" title="Kelola di Menu Mahasiswa">
                            <i class="bi bi-arrow-right"></i>
                        </a>
                    </td>
                </tr>
            `;
        }).join("");
    }
}

/* ====================================================================
 * INITIALIZATION ON DOM READY
 * ==================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    // 1. Inisialisasi Modul Mahasiswa jika berada di mahasiswa.html
    if (document.getElementById("formMahasiswa")) {
        initFormMahasiswa();
        initSearchAndFilterMahasiswa();
        renderTabelMahasiswa();
        initHitungIPK();
    }

    // 2. Inisialisasi Modul Dosen jika berada di dosen.html
    if (document.getElementById("formDosen") || document.getElementById("formNilai")) {
        initFormDosen();
        renderTabelDosen();
        initInputNilai();
        renderTabelNilai();
    }

    // 3. Inisialisasi Dashboard jika berada di index.html
    if (document.getElementById("dashTotalMahasiswa")) {
        updateDashboardStats();
    }
});