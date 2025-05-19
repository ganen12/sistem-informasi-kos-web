document.addEventListener('DOMContentLoaded', function() {
    let nomorKeluhan = 1;
    let barisEdit = null;

    const formKeluhan = document.getElementById('formKeluhan');
    const tabelKeluhan = document.getElementById('tabelKeluhan');

    if (formKeluhan && tabelKeluhan) {
        formKeluhan.addEventListener('submit', function (e) {
            e.preventDefault();
            const nama = document.getElementById('namaPenyewa').value;
            const kamar = document.getElementById('nomorKamar').value;
            const tanggal = document.getElementById('tanggalKeluhan').value;
            const isi = document.getElementById('isiKeluhan').value;
            const status = document.getElementById('statusKeluhan').value;

            if (barisEdit) {
                const kolom = barisEdit.querySelectorAll('td');
                kolom[1].innerText = nama;
                kolom[2].innerText = kamar;
                kolom[3].innerText = tanggal;
                kolom[4].innerText = isi;
                kolom[5].innerText = status;
                barisEdit = null;
            } else {
                const baris = document.createElement('tr');
                baris.innerHTML = `
                    <td>${nomorKeluhan++}</td>
                    <td>${nama}</td>
                    <td>${kamar}</td>
                    <td>${tanggal}</td>
                    <td>${isi}</td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-sm btn-primary me-1 btn-edit">Edit</button>
                        <button class="btn btn-sm btn-danger btn-hapus">Hapus</button>
                    </td>
                `;
                tabelKeluhan.appendChild(baris);

                baris.querySelector('.btn-hapus').addEventListener('click', function () {
                    baris.remove();
                });

                baris.querySelector('.btn-edit').addEventListener('click', function () {
                    barisEdit = baris;
                    const kolom = baris.querySelectorAll('td');
                    document.getElementById('namaPenyewa').value = kolom[1].innerText;
                    document.getElementById('nomorKamar').value = kolom[2].innerText;
                    document.getElementById('tanggalKeluhan').value = kolom[3].innerText;
                    document.getElementById('isiKeluhan').value = kolom[4].innerText;
                    document.getElementById('statusKeluhan').value = kolom[5].innerText;
                    new bootstrap.Modal(document.getElementById('modalKeluhan')).show();
                });
            }

            this.reset();
            bootstrap.Modal.getInstance(document.getElementById('modalKeluhan')).hide();
        });
    }

    const searchInputKeluhan = document.getElementById('searchInput');
    if (searchInputKeluhan && tabelKeluhan) {
        searchInputKeluhan.addEventListener('input', function () {
            const keyword = this.value.toLowerCase();
            const rows = tabelKeluhan.querySelectorAll('tr');
            rows.forEach(row => {
                const rowText = row.innerText.toLowerCase();
                row.style.display = rowText.includes(keyword) ? '' : 'none';
            });
        });
    }
});