document.addEventListener('DOMContentLoaded', function() {
    let nomorUrut = 1;
    let barisEdit = null;

    const formPenyewa = document.getElementById('formPenyewa');
    const tabelPenyewa = document.getElementById('tabelPenyewa');

    if (formPenyewa && tabelPenyewa) {
        formPenyewa.addEventListener('submit', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaPenyewa').value;
            const email = document.getElementById('email').value;
            const noHP = document.getElementById('noHP').value;
            const alamat = document.getElementById('alamat').value;
            const tanggalMasuk = document.getElementById('tanggalMasuk').value;
            const durasi = document.getElementById('durasiSewa').value;
            const nomorKamar = document.getElementById('nomorKamar').value;
            const status = document.getElementById('status').value;

            if (barisEdit) {
                const kolom = barisEdit.querySelectorAll('td');
                kolom[1].innerText = nama;
                kolom[2].innerText = email;
                kolom[3].innerText = noHP;
                kolom[4].innerText = alamat;
                kolom[5].innerText = tanggalMasuk;
                kolom[6].innerText = durasi;
                kolom[7].innerText = nomorKamar;
                kolom[8].innerText = status;
                tampilkanToast("Data penyewa berhasil diperbarui!");
                barisEdit = null;
            } else {
                const baris = document.createElement('tr');
                baris.innerHTML = `
                    <td>${nomorUrut++}</td>
                    <td>${nama}</td>
                    <td>${email}</td>
                    <td>${noHP}</td>
                    <td>${alamat}</td>
                    <td>${tanggalMasuk}</td>
                    <td>${durasi}</td>
                    <td>${nomorKamar}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-edit">Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete">Hapus</button>
                    </td>`;
                tabelPenyewa.appendChild(baris);

                baris.querySelector('.btn-delete').addEventListener('click', function () {
                    if (confirm('Yakin ingin menghapus data ini?')) {
                        baris.remove();
                        tampilkanToast("Data penyewa berhasil dihapus!");
                    }
                });

                baris.querySelector('.btn-edit').addEventListener('click', function () {
                    barisEdit = baris;
                    const kolom = baris.querySelectorAll('td');
                    document.getElementById('namaPenyewa').value = kolom[1].innerText;
                    document.getElementById('email').value = kolom[2].innerText;
                    document.getElementById('noHP').value = kolom[3].innerText;
                    document.getElementById('alamat').value = kolom[4].innerText;
                    document.getElementById('tanggalMasuk').value = kolom[5].innerText;
                    document.getElementById('durasiSewa').value = kolom[6].innerText;
                    document.getElementById('nomorKamar').value = kolom[7].innerText;
                    document.getElementById('status').value = kolom[8].innerText;
                    new bootstrap.Modal(document.getElementById('tambahPenyewaModal')).show();
                });

                tampilkanToast("Data penyewa berhasil ditambahkan!");
            }

            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('tambahPenyewaModal')).hide();
        });
    }

    function tampilkanToast(pesan) {
        const toastMessage = document.getElementById('toastMessage');
        if (toastMessage) { // Pastikan elemen ada
            toastMessage.innerText = pesan;
            const toast = new bootstrap.Toast(document.getElementById('toastPenyewa'));
            toast.show();
        }
    }

    const searchInputPenyewa = document.getElementById('searchInput');
    const tabelKeluhanPenyewa = document.getElementById('tabelPenyewa'); // Pastikan ID tabel benar
    if (searchInputPenyewa && tabelKeluhanPenyewa) {
        searchInputPenyewa.addEventListener('input', function () {
            const keyword = this.value.toLowerCase();
            const rows = tabelKeluhanPenyewa.querySelectorAll('tr'); // Use tabelKeluhan
            rows.forEach(row => {
                const rowText = row.innerText.toLowerCase();
                row.style.display = rowText.includes(keyword) ? '' : 'none';
            });
        });
    }
});