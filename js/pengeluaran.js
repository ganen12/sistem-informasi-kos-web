function formatRupiah(angka) {
    const numberString = angka.replace(/[\D]/g, '').toString();
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
    const rows = document.querySelectorAll('#tabelPengeluaran tr');
    const today = new Date();
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    const filteredRows = [];

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
    if (tampil) filteredRows.push(row);
    });

    updateRingkasan(filteredRows);
}
  
function updateRingkasan() {
    const tabel = document.getElementById('tabelPengeluaran');
    if (tabel) {
    const rows = tabel.querySelectorAll('tr');
    let total = 0;
    let terbesar = 0;
    let terakhir = 0;

    rows.forEach(row => {
        const jumlahText = row.children[2].innerText.replace(/[^\d]/g, '');
        const jumlah = parseInt(jumlahText) || 0;
        total += jumlah;
        if (jumlah > terbesar) terbesar = jumlah;

        const tanggal = new Date(row.children[0].innerText);
        if (!terakhir || tanggal > new Date(terakhir.tanggal)) {
        terakhir = { jumlah, tanggal: row.children[0].innerText };
        }
    });

    document.getElementById('totalPengeluaran').innerText = 'Rp ' + total.toLocaleString('id-ID');
    document.getElementById('jumlahTerbanyak').innerText = 'Rp ' + terbesar.toLocaleString('id-ID');
    document.getElementById('jumlahTerakhir').innerText = terakhir ? 'Rp ' + terakhir.jumlah.toLocaleString('id-ID') : 'Rp 0';
    }
}
  
function resetCustomRange() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = today;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.rupiah').forEach((input) => {
    input.addEventListener('input', function () {
        const cursorPos = this.selectionStart;
        const formatted = formatRupiah(this.value);
        this.value = formatted;
        this.setSelectionRange(cursorPos, cursorPos);
    });
    });

    let barisSedangDiedit = null;
    const form = document.getElementById('formPengeluaran');
    const tabel = document.getElementById('tabelPengeluaran');

    if (form && tabel) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const tanggal = document.getElementById('tanggal').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const jumlahRaw = document.getElementById('jumlah').value.replace(/\./g, '');
        const jumlah = parseInt(jumlahRaw).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

        if (barisSedangDiedit) {
        const kolom = barisSedangDiedit.querySelectorAll('td');
        kolom[0].innerText = tanggal;
        kolom[1].innerText = deskripsi;
        kolom[2].innerText = jumlah;
        barisSedangDiedit = null;
        tampilkanToast('Data berhasil diperbarui!', 'success');
        } else {
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${tanggal}</td>
            <td>${deskripsi}</td>
            <td>${jumlah}</td>
            <td>
            <button class="btn btn-sm btn-primary btn-edit">Edit</button>
            <button class="btn btn-sm btn-danger btn-delete">Hapus</button>
            </td>
        `;
        tabel.appendChild(baris);

        baris.querySelector('.btn-delete').addEventListener('click', function () {
            baris.remove();
            filterDataByRange(document.getElementById('filterRange').value);
            tampilkanToast('Data berhasil dihapus!', 'success');
        });

        baris.querySelector('.btn-edit').addEventListener('click', function () {
            barisSedangDiedit = baris;
            const kolom = baris.querySelectorAll('td');
            document.getElementById('tanggal').value = kolom[0].innerText;
            document.getElementById('deskripsi').value = kolom[1].innerText;
            document.getElementById('jumlah').value = kolom[2].innerText.replace(/[\D]/g, '');
            const modal = new bootstrap.Modal(document.getElementById('modalPengeluaran'));
            modal.show();
        });

        tampilkanToast('Data berhasil ditambahkan!', 'success');
        }

        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalPengeluaran'));
        modal.hide();
        filterDataByRange(document.getElementById('filterRange').value);
    });
    }

    document.getElementById('searchInput').addEventListener('input', function () {
    const keyword = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tabelPengeluaran tr');
    rows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(keyword) ? '' : 'none';
    });
    });

    document.getElementById('filterRange').addEventListener('change', function () {
    const selected = this.value;
    const customDiv = document.getElementById('customRange');
    if (selected === 'custom') {
        customDiv.classList.remove('d-none');
        resetCustomRange();
    } else {
        customDiv.classList.add('d-none');
    }
    filterDataByRange(selected);
    });

    document.getElementById('endDate').addEventListener('change', function () {
    if (document.getElementById('filterRange').value === 'custom') {
        filterDataByRange('custom');
    }
    });

    document.getElementById('filterRange').value = 'bulan_ini';
    filterDataByRange('bulan_ini');
});
