function formatRupiah(angka) {
    const numberString = angka.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    return rupiah;
}

function tampilkanToast(pesan, tipe = 'success') {
    const toastElement = document.getElementById('toastNotifikasi');
    const pesanToast = document.getElementById('pesanToast');

    if (toastElement && pesanToast) {
        toastElement.classList.remove('text-bg-success', 'text-bg-danger');
        toastElement.classList.add(`text-bg-${tipe}`);
        pesanToast.textContent = pesan;

        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
}

function updateRingkasan() {
    const tabelPembayaran = document.getElementById('tabelPembayaran');
    if (tabelPembayaran) {
        const rows = tabelPembayaran.querySelectorAll('tr');
        let total = 0;
        let totalDibayar = 0;
        let totalBelumDibayar = 0;

        rows.forEach(row => {
            const totalTagihanText = row.children[3].innerText.replace(/[\D]/g, '');
            const jumlahDibayarText = row.children[4].innerText.replace(/[\D]/g, '');
            const totalTagihan = parseInt(totalTagihanText) || 0;
            const jumlahDibayar = parseInt(jumlahDibayarText) || 0;

            total++;
            totalDibayar += jumlahDibayar;
            totalBelumDibayar += Math.max(totalTagihan - jumlahDibayar, 0);
        });

        document.getElementById('totalSewaCount').innerText = total;
        document.getElementById('totalDibayar').innerText = 'Rp ' + totalDibayar.toLocaleString('id-ID');
        document.getElementById('totalBelumDibayar').innerText = 'Rp ' + totalBelumDibayar.toLocaleString('id-ID');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Format real-time saat user mengetik
    document.querySelectorAll('.rupiah').forEach((input) => {
        input.addEventListener('input', function (e) {
            const cursorPos = this.selectionStart;
            const formatted = formatRupiah(this.value);
            this.value = formatted;
            this.setSelectionRange(cursorPos, cursorPos);
        });
    });

    let barisSedangDiedit = null;

    // Submit ke tabel daftar data
    const formPembayaran = document.getElementById('formPembayaran');
    const tabelPembayaran = document.getElementById('tabelPembayaran');
    if (formPembayaran && tabelPembayaran) {
        formPembayaran.addEventListener('submit', function (e) {
            e.preventDefault();

            const totalSewaRaw = document.getElementById('totalSewa').value.replace(/\./g, '');
            const jumlahDibayarRaw = document.getElementById('jumlahDibayar').value.replace(/\./g, '');

            const nama = document.getElementById('nama').value;
            const properti = document.getElementById('properti').value;
            const kamar = document.getElementById('kamar').value;
            const totalSewa = parseInt(totalSewaRaw).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            const jumlahDibayar = parseInt(jumlahDibayarRaw).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            const jatuhTempo = document.getElementById('jatuhTempo').value;
            const status = document.getElementById('statusPembayaran').value;


            if (barisSedangDiedit) {
                // Update baris yang sedang diedit
                const kolom = barisSedangDiedit.querySelectorAll('td');
                kolom[0].innerText = nama;
                kolom[1].innerText = properti;
                kolom[2].innerText = kamar;
                kolom[3].innerText = totalSewa;
                kolom[4].innerText = jumlahDibayar;
                kolom[5].innerText = jatuhTempo;
                kolom[6].innerText = status;


                barisSedangDiedit = null; // Reset
                tampilkanToast('Data berhasil diperbarui!', 'success');
            } else {
                // Tambah baris baru
                const barisBaru = document.createElement('tr');
                barisBaru.innerHTML = `
                    <td>${nama}</td>
                    <td>${properti}</td>
                    <td>${kamar}</td>
                    <td>${totalSewa}</td>
                    <td>${jumlahDibayar}</td>
                    <td>${jatuhTempo}</td>
                    <td class='fw-bold'>${status}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-edit">Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete">Hapus</button>
                    </td>
                `;
                tabelPembayaran.appendChild(barisBaru);

                // Tambahkan event listener lagi ke tombol baru
                barisBaru.querySelector('.btn-delete').addEventListener('click', function () {
                    if (confirm('Apakah yakin ingin menghapus data ini?')) {
                        barisBaru.remove();
                        tampilkanToast('Data berhasil dihapus!', 'success');
                    }
                });

                barisBaru.querySelector('.btn-edit').addEventListener('click', function () {
                    barisSedangDiedit = barisBaru;
                    const kolom = barisBaru.querySelectorAll('td');
                    document.getElementById('nama').value = kolom[0].innerText;
                    document.getElementById('properti').value = kolom[1].innerText;
                    document.getElementById('kamar').value = kolom[2].innerText;
                    document.getElementById('totalSewa').value = kolom[3].innerText.replace(/[^\d]/g, '');
                    document.getElementById('jumlahDibayar').value = kolom[4].innerText.replace(/[^\d]/g, '');
                    document.getElementById('jatuhTempo').value = kolom[5].innerText;
                    document.getElementById('statusPembayaran').value = kolom[6].innerText;


                    const modal = new bootstrap.Modal(document.getElementById('tambahPembayaranModal'));
                    modal.show();
                });
            }

            // Reset dan tutup form
            formPembayaran.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('tambahPembayaranModal'));
            modal.hide();
            updateRingkasan();
        });
    }

    const searchInputPembayaran = document.getElementById('searchInput');
    const tabelKeluhanPembayaran = document.getElementById('tabelPembayaran');  // Pastikan ID tabel benar
    if (searchInputPembayaran && tabelKeluhanPembayaran) {
        searchInputPembayaran.addEventListener('input', function () {
            const keyword = this.value.toLowerCase();
            const rows = tabelKeluhanPembayaran.querySelectorAll('tr');  // Use tabelKeluhan
            rows.forEach(row => {
                const rowText = row.innerText.toLowerCase();
                row.style.display = rowText.includes(keyword) ? '' : 'none';
            });
        });
    }

    // Inisialisasi ringkasan saat halaman dimuat
    updateRingkasan();
});
