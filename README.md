# Storm Emeralda 🐉

Snake game bertema Pokémon — kendalikan **Rayquaza** di gua dan kumpulkan item Pokémon!

## Cara main

Buka `index.html` di browser, atau deploy ke Netlify.

- **Gerak:** ← ↑ ↓ → atau WASD
- **Hyper Beam:** Spasi atau tombol ⚡ pada kontrol HP
- **Pause/Lanjutkan:** Escape
- **Fullscreen:** tombol ⛶ FULLSCREEN pada komputer

## Fitur

### Legends: boss adaptif, jalur Mega, dan partner

Di lobby, buka **Gaya bermain / Play style** untuk memilih jalur Mega dan partner. Pilihan serta pengaturan sinematik disimpan di browser. Jalur dan partner berlaku untuk Adventure, Daily, dan Boss Rush; latihan tetap menggunakan mekanik dasarnya.

- **Boss adaptif:** membaca maksimal 32 gerakan dan 8 arah Beam terakhir. Pola di tepi, gerakan lurus, gerakan berkelok, serta arah Beam berulang memengaruhi prediksi serangan; Deoxys dapat memilih posisi teleport di luar jalur tembakan yang sering dipakai. HUD menunjukkan pola yang sedang dibaca. Serangan tetap memberi peringatan minimal 1,25 detik. Pencarian rute memeriksa kemungkinan keluar berdasarkan posisi dan bahaya saat ini; bila tidak menemukan rute, boss menunda serangan. Musuh bergerak dan keputusan pemain masih dapat mengubah kondisi sesudah pemeriksaan.
- **Sinematik boss:** kedatangan dan fase kedua mendapat adegan singkat bertema magma, laut, atau kosmik, ilustrasi Rayquaza, serta rangkaian nada khusus. Permainan dan seluruh timer dijeda. Adegan berakhir setelah 3,4 detik atau lewat tombol Lanjut/Escape; bisa dimatikan di lobby. Setelah tab tersembunyi, permainan tetap dijeda sampai pemain melanjutkan. Pengaturan tanpa suara, efek ringan, dan reduced motion didukung.
- **Tempest:** saat Mega, gerak lebih cepat 8 ms per langkah dan Beam menyambarkan petir ke 1–3 monster liar dalam jarak 4 petak dari target sebelumnya. Upgrade Combo menaikkan jumlah sambaran. Petir tambahan tidak menggandakan damage boss.
- **Prism:** saat Mega, Beam bercabang dan membelok sekali di tepi arena. Upgrade Hyper Core memperpanjang pantulan 6–10 petak. Seluruh cabang hanya menghitung satu hit pada boss per tembakan.
- **Ancient:** saat masuk Mega dari bentuk normal, mendapat 1 Shield (maksimum 3). Shield yang pecah memberi perlindungan 0,85–1,15 detik sesuai tier Guard; serangan skill boss bisa dipantulkan untuk 2 damage. Tabrakan dinding tetap fatal dan menabrak tubuh sendiri/boss tidak memantulkan serangan. Memperpanjang Mega yang masih aktif tidak memberi Shield lagi.
- **Grafik jalur:** tiga palet Mega baru, motif petir/kristal/perisai, dan efek petir berantai. Palet kosmetik Pastel serta Shiny tetap diprioritaskan; motif jalur masih terlihat.
- **Luma, pemandu:** mencari saran rute 3–5 langkah dengan mempertimbangkan tubuh, batu, musuh, meteor, dan waktu serangan. Titik mint diperbarui setiap langkah; rute adalah saran berdasarkan kondisi saat ini. Portal tidak dipakai dalam perencanaan.
- **Pip, kolektor:** mengambil berry dalam jangkauan rute 3–5 langkah setiap 12/10/8 detik. Berry memberi poin dan efek combo tanpa memanjangkan tubuh. Pip tidak mengambil item evolusi atau power-up lain. Kedua partner naik tingkat ikatan pada 8 dan 16 item dalam satu run; reset saat memulai run baru.

Semua keputusan dijalankan lokal tanpa API AI. Perubahan ini tidak mengirim atau memigrasikan skor lama.

### Emerald Expeditions

- **Adventure** mempertahankan petualangan, skor, dan leaderboard online yang sudah ada.
- **Tantangan Harian / Daily Challenge** berlangsung maksimal 2 menit. Berkah awal dan urutan acak gameplay ditentukan oleh tanggal UTC; efek grafis tidak mengubah urutan itu. Hari baru dimulai pukul **07.00 WIB**. Medali skor: Bronze 500, Silver 1.500, Emerald 3.000. Tabrakan dapat mengakhiri percobaan lebih awal.
- **Boss Rush** terdiri dari 6 duel: Groudon, Kyogre, Deoxys, lalu putaran kedua dengan HP lebih tinggi. Pilih build Prism, Guard, atau Astral. Setiap kemenangan memberi pilihan upgrade, tubuh kembali pendek, +1 Shield (maksimum 3), Beam siap, dan Ascent minimal 40%. Game berhenti selama pilihan upgrade.
- **Latihan interaktif** mengajarkan gerak/berry, Hyper Beam, Air Lock, evolusi Mega, dan Dragon Ascent dalam 5 tahap. Tabrakan mengulang tahap latihan. Latihan dapat diulang dari menu.
- **Bagikan hasil** melalui menu berbagi perangkat atau salin teks. Tombol **Kartu PNG** mengunduh kartu hasil 1200 × 630 dengan gambar arena. Link yang dibagikan saat game dihosting dapat membuka pilihan mode Daily atau Rush.
- **Menu utama** dapat dibuka dari pause, layar hasil, latihan, atau istirahat Boss Rush. Kembali ke menu mengakhiri percobaan aktif.
- Kontrol HP mempunyai tombol **Q / Air Lock** dekat tombol Beam dan tombol **R / Ascent**. Layar awal HP memprioritaskan pilihan mode dan tombol Mulai.

Timer hanya menghitung waktu bermain aktif; pause, berpindah tab, dan pilihan upgrade Boss Rush tidak menghabiskan waktu. Rekor Daily dan Boss Rush tersimpan **lokal di browser**, terpisah dari rekor dan leaderboard Adventure. Latihan dan Boss Rush tidak menambah progres album Adventure. Menghapus data situs menghapus rekor lokal; penyimpanan yang diblokir tidak menghentikan game. Daily mempertahankan tanggal tantangan saat run dimulai walaupun melewati pergantian hari.

### Atlas dan grafik monster

- Lobby menampilkan ilustrasi Rayquaza bersama Groudon dan Kyogre, judul bergaya poster, slogan ID/EN, serta pilihan mode dan tombol Mulai yang lebih jelas. Panel pertarungan baru muncul setelah permainan dimulai.

- Delapan monster digambar ulang dengan detail armor, sirip, tentakel, batu, dan ekspresi: Groudon, Kyogre, Deoxys, Diglett, Dugtrio, Geodude, Graveler, dan Golem.
- Boss memiliki animasi diam, kilatan saat terkena serangan, aura fase kedua, dan efek serangan yang lebih jelas. Hitbox dan aturan pertarungan tetap sama.
- Arena boss mempunyai ornamen tepi magma, ombak, atau konstelasi sesuai lawan. Bar HP kecil di atas monster dan ikon peringatan saat menyiapkan serangan membantu membaca pertarungan; dekorasi arena mengikuti pengaturan efek ringan/reduced motion.
- Tombol **MONSTER** membuka Atlas Monster dengan ilustrasi besar serta petunjuk ID/EN. Membuka atlas saat bermain otomatis menjeda permainan.
- Gambar disimpan dalam cache 32 frame agar tidak digambar ulang dari awal setiap frame. Pengaturan efek ringan dan reduced motion tetap didukung.

### Sistem petualangan

- Evolusi **Rayquaza → Mega Rayquaza**
- Pokémon liar yang berevolusi: **Diglett → Dugtrio**, **Geodude → Graveler → Golem**
- Item: Berry, Potion, Rare Candy, Thunder Stone, Master Ball, Slowpoke Tail, Extreme Speed, Delta Stream, Meteorite, Mega Stone
- Hazard & bonus: Draco Meteor, Portal, Golden Magikarp, Shiny item
- Sistem cuaca (Sunny / Rain / Sandstorm / Hail), Combo, Frenzy, Gym Badges
- Boss Battle setiap 5 level dengan skill unik: Precipice Blades Groudon, Origin Wave Kyogre, dan Psycho Boost + teleport Deoxys
- Pilihan 1 dari 3 Emerald Blessing setiap 3 level; orb dipilih langsung di arena tanpa menghentikan permainan
- Leaderboard online mingguan dan sepanjang masa

## Keseimbangan alam & Air Lock

- Meter kiri menunjukkan pengaruh Groudon (panas), kanan pengaruh Kyogre (hujan).
- Ambil orb biru **K** untuk melawan panas, atau orb jingga **G** untuk melawan hujan. Orb tidak menambah panjang Rayquaza. Pilihan yang mendekatkan meter ke tengah mengisi Air Lock **30%**; pilihan lainnya **10%**. Makanan memberi **5%**, kemenangan boss **25%**.
- Saat meter Air Lock penuh, tekan **Q** atau tombol **Air Lock**. Selama **5 detik**, cuaca diredakan, retakan/arus dan meteor dibersihkan, serta serangan Groudon/Kyogre dibatalkan. Air Lock tidak melindungi dari dinding, tubuh sendiri, batu, Pokémon liar, tubuh boss, atau Psycho Boost Deoxys.
- Mulai level 3, pengaruh alam dapat memunculkan maksimal **3 petak** lingkungan dengan peringatan **2 detik**. Retakan aktif berbahaya; arus hanya memperlambat gerakan. Hyper Beam dapat membersihkannya.
- Setelah menyerang, boss memiliki celah pemulihan minimal **2,2 detik**, ditandai cincin hijau dan tulisan **CELAH**. Hyper Beam mendapat **+1 damage** selama celah tersebut. Serangan di luar celah tetap memberikan damage normal.
- Wave Kyogre memiliki koridor selebar **9 petak pada fase 1**, lalu **7 petak pada fase 2**.

## Deploy

1. Drag folder ini ke [Netlify Drop](https://app.netlify.com/drop), atau
2. Sambungkan repo ini ke Netlify (Git) untuk auto-deploy setiap `git push`.

## Validasi lokal

`node legends-check.cjs` menguji adaptasi boss dan rute keluar, ketiga jalur Mega, partner, sinematik dengan frame loop asli, pause/reset/expiry, penyimpanan pilihan, serta UI ID/EN dan mobile. Request eksternal diblokir selama pengujian.

`node monster-art-check.cjs` memeriksa delapan ilustrasi, cache, atlas, pause, ID/EN, tampilan HP 320px, dan pengaturan gerakan/efek ringan. Gunakan pengaturan Playwright yang sama seperti pengujian di bawah.

Pemeriksaan sintaks dan referensi DOM:

```powershell
node "C:\Users\lenovo\.codex\skills\storm-emeralda-game-dev\scripts\check_game.mjs" ".\index.html"
```

Dengan Playwright terpasang dan Microsoft Edge tersedia, jalankan `node expeditions-check.cjs` untuk memeriksa mode, timer, latihan, pemisahan rekor, hasil PNG, ID/EN, dan tampilan mobile. `PLAYWRIGHT_PATH` dapat menunjuk instalasi Playwright di luar folder game; `STORM_TEST_OUTPUT` menentukan folder screenshot. Pengujian ini memblokir semua request non-lokal, sehingga tidak mengirim skor ke leaderboard produksi.
