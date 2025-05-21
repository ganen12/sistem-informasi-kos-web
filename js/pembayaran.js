// js/pembayaran.js

function formatRupiah(angka) {
    const numberString = angka.replace(/[^\d]/g, '').toString();
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

function filterDataByRange(range) {
    const rows = document.querySelectorAll('#tabelPembayaran tr');
    const today = new Date();
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    rows.forEach(row => {
        const tanggal = new Date(row.children[0].innerText);
        let tampil = false;

        if (range === 'bulan_ini') {
            tampil = tanggal.getMonth() === today.getMonth() && tanggal.getFullYear() === today.getFullYear();
        } else if (range === 'bulan_lalu') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            tampil = tanggal.getMonth() === lastMonth.getMonth() && tanggal.getFullYear() === lastMonth.getFullYear();
        } else if (range === '3_bulan') {
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 2);
            tampil = tanggal >= threeMonthsAgo;
        } else if (range === 'custom') {
            const start = new Date(startDateInput.value);
            const end = new Date(endDateInput.value);
            tampil = tanggal >= start && tanggal <= end;
        } else {
            tampil = true;
        }

        row.style.display = tampil ? '' : 'none';
    });

    updateRingkasan();
}

function updateRingkasan() {
    const tabel = document.getElementById('tabelPembayaran');
    if (tabel) {
        const rows = tabel.querySelectorAll('tr');
        let totalTagihan = 0;
        let totalDibayar = 0;
        let terakhirDibayar = { jumlah: 0, tanggal: null };

        rows.forEach(row => {
            if (row.style.display === 'none') return;

            const tanggalText = row.children[0].innerText;
            const tagihanText = row.children[4].innerText.replace(/[^\d]/g, '');
            const dibayarText = row.children[5].innerText.replace(/[^\d]/g, '');

            const tanggal = new Date(tanggalText);
            const tagihan = parseInt(tagihanText) || 0;
            const dibayar = parseInt(dibayarText) || 0;

            totalTagihan += tagihan;
            totalDibayar += dibayar;

            if (!terakhirDibayar.tanggal || tanggal > new Date(terakhirDibayar.tanggal)) {
                terakhirDibayar = { jumlah: dibayar, tanggal: tanggalText };
            }
        });

        const belumDibayar = totalTagihan - totalDibayar;

        document.getElementById('totalSewaCount').innerText = 'Rp ' + totalTagihan.toLocaleString('id-ID');
        document.getElementById('totalDibayar').innerText = 'Rp ' + totalDibayar.toLocaleString('id-ID');
        document.getElementById('totalBelumDibayar').innerText = 'Rp ' + belumDibayar.toLocaleString('id-ID');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.rupiah').forEach((input) => {
        input.addEventListener('input', function () {
            const cursorPos = this.selectionStart;
            const formatted = formatRupiah(this.value);
            this.value = formatted;
            this.setSelectionRange(cursorPos, cursorPos);
        });
    });

    let barisSedangDiedit = null;
    const form = document.getElementById('formPembayaran');
    const tabel = document.getElementById('tabelPembayaran');

    if (form && tabel) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const tanggal = document.getElementById('tanggalPembayaran').value;
            const nama = document.getElementById('nama').value;
            const properti = document.getElementById('properti').value;
            const kamar = document.getElementById('kamar').value;
            const totalSewa = formatRupiah(document.getElementById('totalSewa').value);
            const jumlahDibayar = formatRupiah(document.getElementById('jumlahDibayar').value);
            const jatuhTempo = document.getElementById('jatuhTempo').value;
            const status = document.getElementById('statusPembayaran').value;

            if (barisSedangDiedit) {
                const kolom = barisSedangDiedit.querySelectorAll('td');
                kolom[0].innerText = tanggal;
                kolom[1].innerText = nama;
                kolom[2].innerText = properti;
                kolom[3].innerText = kamar;
                kolom[4].innerText = totalSewa;
                kolom[5].innerText = jumlahDibayar;
                kolom[6].innerText = jatuhTempo;
                kolom[7].innerText = status;
                barisSedangDiedit = null;
                tampilkanToast('Data diperbarui!');
            } else {
                const baris = document.createElement('tr');
                baris.innerHTML = `
                    <td>${tanggal}</td>
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
                tabel.appendChild(baris);

                baris.querySelector('.btn-delete').addEventListener('click', () => {
                    baris.remove();
                    updateRingkasan();
                });

                baris.querySelector('.btn-edit').addEventListener('click', () => {
                    barisSedangDiedit = baris;
                    const kolom = baris.querySelectorAll('td');
                    document.getElementById('tanggalPembayaran').value = kolom[0].innerText;
                    document.getElementById('nama').value = kolom[1].innerText;
                    document.getElementById('properti').value = kolom[2].innerText;
                    document.getElementById('kamar').value = kolom[3].innerText;
                    document.getElementById('totalSewa').value = kolom[4].innerText.replace(/\D/g, '');
                    document.getElementById('jumlahDibayar').value = kolom[5].innerText.replace(/\D/g, '');
                    document.getElementById('jatuhTempo').value = kolom[6].innerText;
                    document.getElementById('statusPembayaran').value = kolom[7].innerText;
                    new bootstrap.Modal(document.getElementById('tambahPembayaranModal')).show();
                });

                tampilkanToast('Data ditambahkan!');
            }

            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('tambahPembayaranModal')).hide();
            updateRingkasan();
        });
    }

    document.getElementById('searchInput').addEventListener('input', function () {
        const keyword = this.value.toLowerCase();
        document.querySelectorAll('#tabelPembayaran tr').forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(keyword) ? '' : 'none';
        });
        updateRingkasan();
    });

    document.getElementById('filterRange').addEventListener('change', function () {
        const val = this.value;
        document.getElementById('customRange').classList.toggle('d-none', val !== 'custom');
        filterDataByRange(val);
    });

    document.getElementById('endDate').addEventListener('change', () => {
        if (document.getElementById('filterRange').value === 'custom') {
            filterDataByRange('custom');
        }
    });

    document.getElementById('filterRange').value = 'bulan_ini';
    filterDataByRange('bulan_ini');
});
