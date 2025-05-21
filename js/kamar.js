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
    const toastElement = document.getElementById('toastKamar');
    const toastMessage = document.getElementById('toastMessage');

    if (toastElement && toastMessage) {
        toastElement.classList.remove('text-bg-success', 'text-bg-danger');
        toastElement.classList.add(`text-bg-${tipe}`);
        toastMessage.textContent = pesan;

        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
}

function updateKamarOverview() {
    const tabelKamar = document.getElementById('tabelKamar');
    if (tabelKamar) {
        const rows = tabelKamar.querySelectorAll('tr');
        let total = rows.length;
        let terisi = 0;

        rows.forEach(row => {
            const status = row.children[1]?.innerText.trim();
            if (status === "Terisi") {
                terisi++;
            }
        });

        const tersedia = total - terisi;
        const persen = total === 0 ? 0 : Math.round((terisi / total) * 100);

        document.getElementById('totalKamar').innerText = total;
        document.getElementById('kamarTerisi').innerText = terisi;
        document.getElementById('kamarTersedia').innerText = tersedia;
        document.getElementById('okupansiPersen').innerText = persen + "%";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Format saat user mengetik pada input harga
    document.querySelectorAll('.rupiah').forEach((input) => {
        input.addEventListener('input', function () {
            const cursorPos = this.selectionStart;
            const formatted = formatRupiah(this.value);
            this.value = formatted;
            this.setSelectionRange(cursorPos, cursorPos);
        });
    });

    let barisSedangDiedit = null;

    // Submit form kamar
    const formKamar = document.getElementById('formKamar');
    const tabelKamar = document.getElementById('tabelKamar');
    if (formKamar && tabelKamar) {
        formKamar.addEventListener('submit', function (e) {
            e.preventDefault();

            const nomor = document.getElementById('nomor').value;
            // const nama = document.getElementById('namaPenyewa').value;
            // const email = document.getElementById('email').value;
            // const noHP = document.getElementById('noHP').value;
            const status = document.getElementById('statusKamar').value;
            const hargaRaw = document.getElementById('hargaPerBulan').value.replace(/\./g, '');
            const harga = parseInt(hargaRaw).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

            if (barisSedangDiedit) {
                // Update
                const kolom = barisSedangDiedit.querySelectorAll('td');
                kolom[0].innerText = nomor;
                // kolom[1].innerText = nama;
                // kolom[2].innerText = email;
                // kolom[3].innerText = noHP;
                kolom[1].innerText = status;
                kolom[2].innerText = harga;

                barisSedangDiedit = null;
                tampilkanToast('Data kamar berhasil diperbarui!', 'success');
            } else {
                // Create
                    // <td>${nama}</td>
                    // <td>${email}</td>
                    // <td>${noHP}</td>
                const barisBaru = document.createElement('tr');
                barisBaru.innerHTML = `
                    <td>${nomor}</td>
                    <td>${status}</td>
                    <td>${harga}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-edit">Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete">Hapus</button>
                    </td>
                `;
                tabelKamar.appendChild(barisBaru);

                // Tombol delete
                barisBaru.querySelector('.btn-delete').addEventListener('click', function () {
                    barisBaru.remove()
                });

                // Tombol edit
                barisBaru.querySelector('.btn-edit').addEventListener('click', function () {
                    barisSedangDiedit = barisBaru;
                    const kolom = barisBaru.querySelectorAll('td');
                    document.getElementById('nomor').value = kolom[0].innerText;
                    // document.getElementById('namaPenyewa').value = kolom[1].innerText;
                    // document.getElementById('email').value = kolom[2].innerText;
                    // document.getElementById('noHP').value = kolom[3].innerText;
                    document.getElementById('statusKamar').value = kolom[1].innerText;
                    document.getElementById('hargaPerBulan').value = kolom[2].innerText.replace(/[^\d]/g, '');

                    const modal = new bootstrap.Modal(document.getElementById('tambahKamarModal'));
                    modal.show();
                });

                tampilkanToast('Data kamar berhasil ditambahkan!', 'success');
            }

            // Reset form & tutup modal
            formKamar.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('tambahKamarModal'));
            modal.hide();
            updateKamarOverview();
        });
    }

    const searchInputKamar = document.getElementById('searchInput');
    const tabelKeluhanKamar = document.getElementById('tabelKamar'); // Perhatikan ID tabelnya
    if (searchInputKamar && tabelKeluhanKamar) {
        searchInputKamar.addEventListener('input', function () {
            const keyword = this.value.toLowerCase();
            const rows = tabelKeluhanKamar.querySelectorAll('tr');
            rows.forEach(row => {
                const rowText = row.innerText.toLowerCase();
                row.style.display = rowText.includes(keyword) ? '' : 'none';
            });
        });
    }

    updateKamarOverview();
});