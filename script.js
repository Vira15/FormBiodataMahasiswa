/* =========================================
   DATA NILAI DOSEN
========================================= */
let dataNilai = [];

/* =========================================
   FORM MAHASISWA
========================================= */
const formMahasiswa = document.getElementById("formMahasiswa");

if (formMahasiswa) {
    formMahasiswa.addEventListener("submit", function(event) {
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
    tombolIPK.addEventListener("click", function() {
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
    formDosen.addEventListener("submit", function(event) {
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
   INPUT NILAI MAHASISWA
========================================= */
const formNilai = document.getElementById("formNilai");

if (formNilai) {
    formNilai.addEventListener("submit", function(event) {
        event.preventDefault();

        let nama = document.getElementById("namaMahasiswaNilai").value.trim();
        let nim = document.getElementById("nimNilai").value.trim();
        let nilai = parseFloat(document.getElementById("nilaiAngka").value);
        let huruf = document.getElementById("nilaiHuruf").value;

        if (nama === "" || nim === "" || isNaN(nilai) || huruf === "") {
            alert("Semua data nilai harus diisi.");
            return;
        }

        if (nilai < 0 || nilai > 100) {
            alert("Nilai angka harus berada pada rentang 0 sampai 100.");
            return;
        }

        let status = nilai >= 60 ? "Lulus" : "Tidak Lulus";

        dataNilai.push({
            nama: nama,
            nim: nim,
            nilai: nilai,
            huruf: huruf,
            status: status
        });

        tampilkanTabelNilai();
        formNilai.reset();

        alert("Nilai mahasiswa berhasil disimpan!");
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
                <td colspan="6" class="empty-table">Belum ada data nilai.</td>
            </tr>
        `;
        return;
    }

    let hasil = "";
    dataNilai.forEach(function(data, index) {
        let classStatus = data.status === "Lulus" ? "status-lulus" : "status-tidak";
        hasil += `
            <tr>
                <td>${index + 1}</td>
                <td>${data.nama}</td>
                <td>${data.nim}</td>
                <td>${data.nilai}</td>
                <td>${data.huruf}</td>
                <td><span class="${classStatus}">${data.status}</span></td>
            </tr>
        `;
    });

    tabel.innerHTML = hasil;
}