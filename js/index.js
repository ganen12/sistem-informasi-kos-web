const chartDataByRange = {
    bulan_ini: {
    labels: ['1', '8', '15', '22', '30'],
    values: [120000, 180000, 100000, 170000, 200000],
    pemasukan: 'Rp. ' + [120000, 180000, 100000, 170000, 200000].reduce((a,b)=>a+b).toLocaleString('id-ID'),
    pengeluaran: 'Rp. 1.000.000',
    sewaStatus: [10, 4, 1],
    kamarTerisi: 2,
    kamarKosong: 13
    },
    bulan_lalu: {
    labels: ['1', '8', '15', '22', '30'],
    values: [100000, 90000, 110000, 120000, 150000],
    pemasukan: 'Rp. ' + [100000, 90000, 110000, 120000, 150000].reduce((a,b)=>a+b).toLocaleString('id-ID'),
    pengeluaran: 'Rp. 800.000',
    sewaStatus: [7, 5, 2],
    kamarTerisi: 1,
    kamarKosong: 14
    },
    "3_bulan": {
    labels: ['Apr', 'Mei', 'Jun'],
    values: [500000, 450000, 600000],
    pemasukan: 'Rp. ' + [500000, 450000, 600000].reduce((a,b)=>a+b).toLocaleString('id-ID'),
    pengeluaran: 'Rp. 2.500.000',
    sewaStatus: [25, 8, 2],
    kamarTerisi: 4,
    kamarKosong: 11
    }
};

const statusChart = new Chart(document.getElementById('statusChart').getContext('2d'), {
    type: 'doughnut',
    data: {
    labels: ['Lunas', 'Belum Lunas', 'Gagal'],
    datasets: [{
        data: chartDataByRange['bulan_ini'].sewaStatus,
        backgroundColor: ['#28a745', '#ffc107', '#dc3545']
    }]
    },
    options: { plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
});

const pembayaranChart = new Chart(document.getElementById('pembayaranChart').getContext('2d'), {
    type: 'bar',
    data: {
    labels: chartDataByRange['bulan_ini'].labels,
    datasets: [{
        label: 'Rp',
        data: chartDataByRange['bulan_ini'].values,
        backgroundColor: '#0d6efd'
    }]
    },
    options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
    }
});

function updateChartAndCards(filterKey) {
    if (!chartDataByRange[filterKey]) return;
    const data = chartDataByRange[filterKey];
    pembayaranChart.data.labels = data.labels;
    pembayaranChart.data.datasets[0].data = data.values;
    pembayaranChart.update();

    statusChart.data.datasets[0].data = data.sewaStatus;
    statusChart.update();

    document.getElementById('cardPemasukan').innerText = data.pemasukan;
    document.getElementById('cardPengeluaran').innerText = data.pengeluaran;
    document.getElementById('cardKamarTerisi').innerText = data.kamarTerisi;
    document.getElementById('cardKamarKosong').innerText = data.kamarKosong;
}

document.getElementById('filterRange').addEventListener('change', function () {
    const selected = this.value;
    const customDiv = document.getElementById('customRange');
    if (selected === 'custom') {
    customDiv.classList.remove('d-none');
    resetCustomRange();
    } else {
    customDiv.classList.add('d-none');
    updateChartAndCards(selected);
    resetCustomRange();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    updateChartAndCards('bulan_ini');
});

document.getElementById('endDate').addEventListener('change', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    if (start && end) {
    const simulatedData = {
        labels: ['02/01', '02/10', '02/20', '03/01', '03/10'],
        values: [100000, 130000, 90000, 110000, 150000],
        sewaStatus: [6, 3, 1],
        pemasukan: 'Rp. 580.000',
        pengeluaran: 'Rp. 900.000',
        kamarTerisi: 3,
        kamarKosong: 12
    };

    pembayaranChart.data.labels = simulatedData.labels;
    pembayaranChart.data.datasets[0].data = simulatedData.values;
    pembayaranChart.update();

    statusChart.data.datasets[0].data = simulatedData.sewaStatus;
    statusChart.update();

    document.getElementById('cardPemasukan').innerText = simulatedData.pemasukan;
    document.getElementById('cardPengeluaran').innerText = simulatedData.pengeluaran;
    document.getElementById('cardKamarTerisi').innerText = simulatedData.kamarTerisi;
    document.getElementById('cardKamarKosong').innerText = simulatedData.kamarKosong;
    }
});

// Data dummy tagihan
const pembayaranJatuhTempo = [
    { nama: 'Zulfa', tanggal: '2025-05-21' },
    { nama: 'Budi', tanggal: '2025-05-24' },
    { nama: 'Rara', tanggal: '2025-05-25' },
    { nama: 'Riski', tanggal: '2025-05-26' },
    { nama: 'Cici', tanggal: '2025-05-27' }
];

const masaSewaHabis = [
    { kamar: '1.2', tanggalBerakhir: '2025-05-21' },
    { kamar: '2.3', tanggalBerakhir: '2025-05-22' },
    { kamar: '3.1', tanggalBerakhir: '2025-05-23' },
    { kamar: '3.2', tanggalBerakhir: '2025-05-24' },
    { kamar: '4.1', tanggalBerakhir: '2025-05-25' }
];

function tampilkanPengingat() {
  const container = document.getElementById('pengingatList');
  container.innerHTML = '';
  const hariIni = new Date();

  pembayaranJatuhTempo.forEach(item => {
    const jatuhTempo = new Date(item.tanggal);
    const selisih = (jatuhTempo - hariIni) / (1000 * 60 * 60 * 24);

    if (selisih >= 0 && selisih <= 7) {
      const el = document.createElement('div');
      el.className = 'list-group-item';
      el.textContent = `🧾 ${item.nama} harus membayar sebelum ${jatuhTempo.toLocaleDateString('id-ID')}`;
      container.appendChild(el);
    }
  });

  masaSewaHabis.forEach(sewa => {
    const akhir = new Date(sewa.tanggalBerakhir);
    const sisaHari = (akhir - hariIni) / (1000 * 60 * 60 * 24);

    if (sisaHari >= 0 && sisaHari <= 7) {
      const el = document.createElement('div');
      el.className = 'list-group-item';
      el.textContent = `🏠 Sewa kamar ${sewa.kamar} habis pada ${akhir.toLocaleDateString('id-ID')}`;
      container.appendChild(el);
    }
  });
}

document.addEventListener('DOMContentLoaded', tampilkanPengingat);

const pengeluaranDataDummy = [
    { keterangan: 'Perbaikan kamar 2A', tanggal: '2025-05-10', jumlah: 350000 },
    { keterangan: 'Bayar listrik', tanggal: '2025-05-09', jumlah: 500000 },
    { keterangan: 'Kebersihan mingguan', tanggal: '2025-05-08', jumlah: 150000 },
    { keterangan: 'Beli alat kebersihan', tanggal: '2025-05-07', jumlah: 80000 },
    { keterangan: 'Service AC kamar 1.1', tanggal: '2025-05-06', jumlah: 400000 }
  ];
  
  function tampilkanPengeluaranTerbaru() {
  const list = document.getElementById('pengeluaranTerbaruList');
  list.innerHTML = '';

  pengeluaranDataDummy.forEach(item => {
    const el = document.createElement('div');
    el.className = 'list-group-item d-flex justify-content-between align-items-center';
    el.innerHTML = `
      <div>
        <strong>${item.tanggal}</strong> - ${item.keterangan}
      </div>
      <span class="badge bg-danger text-white">Rp ${item.jumlah.toLocaleString('id-ID')}</span>
    `;
    list.appendChild(el);
  });
}
  
document.addEventListener('DOMContentLoaded', () => {
    tampilkanPengingat();
    tampilkanPengeluaranTerbaru();  // ← aktifkan
});

function resetCustomRange() {
    const today = new Date().toISOString().split('T')[0];
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');

    startInput.value = today;
    endInput.value = today;
}