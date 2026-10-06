# Storm Emeralda 🐉

Snake game bertema Pokémon — kendalikan **Rayquaza** di gua dan kumpulkan item Pokémon!

## Cara main

Buka `index.html` di browser, atau deploy ke Netlify.

- **Gerak:** ← ↑ ↓ → atau WASD
- **Hyper Beam:** Spasi atau tombol ⚡ pada kontrol HP
- **Pause/Lanjutkan:** Escape
- **Fullscreen:** tombol ⛶ FULLSCREEN pada komputer maupun HP. Browser yang tidak mendukung fullscreen memakai **LAYAR FOKUS**.

## Fitur

### Evolusi taman, dekorasi & Pikachu menumpang

- **Togepi → Togetic**, **Azurill → Marill**, dan **Swablu → Altaria** terbuka setelah mencapai **25 hati** serta **3 penyelamatan spesies tersebut**. Buka taman lalu tekan **Evolusikan menjadi…**. Evolusi gratis, tidak mengurangi berry/hati/jumlah penyelamatan, dan menampilkan lingkaran cahaya serta reaksi pada kartu Pokémon.
- Setelah evolusi terbuka, tombol **Tampilkan…** dapat mengganti tampilan antara bentuk awal dan evolusi. Nama dan ilustrasi taman mengikuti pilihan. Partner memakai bentuk yang dipilih saat run dimulai; perubahan di taman saat pause berlaku untuk perjalanan berikutnya. Kemampuan partner tetap mengikuti tingkat ikatan yang sudah ada, termasuk pemisahan bonus Adventure dari Daily/Boss Rush/Latihan.
- **Kolam Safir** terbuka pada total 2 penyelamatan, **Bunga Bintang** pada 4, dan **Sarang Awan** pada 6. Pasang atau simpan masing-masing lewat panel Dekorasi Taman; ketiganya bisa dipasang bersamaan tanpa biaya. Kolam memiliki riak, bunga ditemani kunang-kunang, dan sarang berbentuk awan.
- Pilihan evolusi, bentuk, dan dekorasi disimpan di `storm-emeralda-garden-growth-v1`, terpisah dari koleksi dan perawatan. Koleksi lama langsung dihitung untuk syarat pembukaan. Penyimpanan diblokir tetap mendukung fitur selama halaman terbuka dengan status yang terlihat.
- **Pikachu menumpang pada segmen punggung di belakang kepala Rayquaza**, mengikuti posisi animasi gerak. Saat Thunder Shock benar-benar melindungi telur dari Murkrow, Pikachu melompat menuju penyerang lalu kembali ke punggung. Kemampuan tetap satu perlindungan per misi telur; tidak menambah damage atau skor. Reduced motion memakai pose tanpa lompatan.

Validasi: `node garden-growth-check.cjs` memeriksa syarat evolusi, tiga bentuk baru, pergantian tampilan, bentuk partner per run, pemasangan dekorasi, penyimpanan/reload/migrasi/data rusak/storage diblokir, gambar tanpa efek terhadap gameplay, posisi rider/lompatan/kembali, keyboard, fokus, ID/EN, 320/390px, frame loop asli, dan reduced motion. `STORM_TEST_OUTPUT` menentukan folder screenshot. Jaringan eksternal diblokir selama tes.

### Fullscreen HP

- Tombol fullscreen tersedia di layar kecil. Jika fullscreen bawaan tidak tersedia atau permintaannya ditolak, **Layar Fokus** memakai area layar browser; bilah browser bisa tetap terlihat.
- Posisi tegak menempatkan arena di atas kontrol sentuh. Posisi mendatar menempatkan arena di kiri dan kontrol di kanan. Tombol arah, Hyper Beam, Air Lock, serta Dragon Ascent tetap tersedia dengan target sentuh minimal 44px.
- Arena menyesuaikan tinggi layar yang terlihat, rotasi, dan area aman perangkat. Skor, level, efek aktif, informasi boss, dan timer mode ditampilkan secara ringkas. Informasi partner, misi telur, Sky Rift, dan pilihan upgrade bisa diperiksa pada panel informasi saat pause.
- Keluar fullscreen atau Layar Fokus ketika bermain otomatis menjeda run. Masuk fullscreen dari menu tetap memungkinkan memilih mode dan memulai permainan. Escape juga keluar dari Layar Fokus.
- `node mobile-fullscreen-check.cjs` menguji fullscreen bawaan, fallback, permintaan yang ditolak, enam ukuran tegak/mendatar, ukuran dan posisi kontrol, tombol arah/Beam/Air Lock/Ascent, boss, keluar-pause, menu, restart, Escape, serta ID/EN. Pengujian menggunakan emulasi layar sentuh di Edge dengan jaringan eksternal diblokir; bukan pengujian pada perangkat fisik.

### Taman interaktif & partner dari telur

- Buka **TAMAN / GARDEN** untuk memberi berry, mengajak bermain, dan memilih Togepi, Azurill, atau Swablu sebagai partner perjalanan berikutnya. Setiap spesies terbuka setelah satu telur spesies tersebut berhasil diselamatkan. Koleksi telur lama langsung berlaku; jumlah penyelamatan tetap tersimpan dengan format sebelumnya.
- Bekal awal **6 berry**. Setiap berry Oran, Pinap, atau Pecha yang dikumpulkan di Adventure menambah **1 bekal**, maksimum **99**. Berry yang diambil Pip juga dihitung. Item lain dan berry tantangan Sky Rift tidak mengisi bekal; Daily, Boss Rush, serta Latihan tidak menambahnya.
- **Beri berry** memakai 1 bekal dan menambah 2 hati; **Ajak bermain** gratis dan menambah 1 hati. Masing-masing aksi punya jeda **30 detik per Pokémon**, tetap berlaku setelah reload. Ikatan maksimum 30 hati: tingkat 1 pada 0–9, tingkat 2 pada 10–24, tingkat 3 pada 25–30. Pada ikatan penuh, perawatan tetap bisa dilakukan dengan biaya dan jeda yang sama, tanpa tambahan hati.
- **Togepi:** setiap **10 / 9 / 8 berry** sesuai tingkat ikatan memberi +1 Shield, maksimum 3 Shield. Jika Shield penuh, satu hitungan penuh disimpan sampai berry berikutnya setelah Shield berkurang. Hitungan direset setiap run.
- **Azurill:** setiap berry memberi tambahan **+4 / +5 / +6 Air Lock** sesuai tingkat ikatan, dengan batas meter 100.
- **Swablu:** setiap berry memberi tambahan **+4 / +5 / +6 Dragon Ascent** sesuai tingkat ikatan, dengan batas meter 100.
- Bonus partner telur hanya aktif di **Adventure**. Daily dan Boss Rush menampilkan partner sebagai teman tanpa bonus; Latihan tanpa partner. Pilihan partner dan tingkat kekuatannya ditetapkan saat run dimulai, sehingga merawat atau mengganti pilihan di taman tidak mengubah run yang sedang dijeda.
- Penghuni taman bergerak lembut, melompat saat dirawat, dan menampilkan hati, berry, atau bola. Kartu Pokémon juga merespons saat dirawat; reduced motion memakai pose diam. Latar taman disimpan dalam cache. Tombol tutup di sudut tetap terjangkau saat menggulir di HP. Membuka taman menjeda permainan; menutup taman tidak otomatis melanjutkan run.
- Bekal, hati, dan jeda perawatan tersimpan di browser dengan kunci `storm-emeralda-garden-care-v1`, terpisah dari jumlah penyelamatan dan skor. Jika penyimpanan diblokir, fitur tetap bekerja selama halaman terbuka dan status penyimpanannya ditampilkan. Menghapus data situs menghapus progres lokal.

Validasi: `node garden-check.cjs` memakai Playwright dan Edge seperti pengujian lain. Mencakup penyelamatan dan pengambilan berry melalui gerakan, pembukaan partner, perawatan, jeda/reload, tingkat ikatan, kemampuan dan batas meter, pemisahan mode, pause/reset, migrasi koleksi lama, penyimpanan rusak/diblokir, keyboard, fokus tombol, ID/EN, lebar 320/390px, animasi frame loop asli, serta reduced motion. Semua jaringan eksternal diblokir; `STORM_TEST_OUTPUT` menentukan folder screenshot.

### Pikachu — Thunder Guardian

- Di **Lautan Safir** pada Adventure, pulau Pikachu mulai dicari setelah 6 detik di luar pertarungan boss. Area 3 × 3 dipilih tanpa menimpa objek lain. Kemunculan menunggu jika ada Sky Rift atau pilihan upgrade; pulau tidak punya batas waktu.
- Dekati Pikachu hingga **3 petak jarak Manhattan**, lalu gunakan **Air Lock** dengan meter penuh (Q atau tombol Air Lock). Air Lock yang masih aktif juga dapat menyelamatkannya ketika pemain mendekat. Pemakaian Air Lock jauh dari pulau tidak membuka Pikachu.
- Pertemanan tersimpan lokal dengan kunci terpisah dari album dan telur. Pikachu muncul di taman; pilih **Ajak untuk perjalanan berikutnya** atau pilih Pikachu di menu partner. Pilihan tidak mengganti partner di tengah run. Jika penyimpanan diblokir, pertemanan tetap bekerja selama halaman terbuka dan keterbatasannya ditampilkan.
- **Thunder Shock** melindungi satu kali per misi telur, hanya ketika Murkrow akan benar-benar mencuri telur. Menghindari sergapan sendiri tidak menghabiskan bantuan. Perlindungan yang terpakai tidak pulih saat boss datang; misi telur baru memulihkannya. Tidak menambah damage boss, tidak mengambil berry, dan tidak memberi skor tambahan.
- Dalam Daily dan Boss Rush, Pikachu hanya menemani tanpa bonus pertempuran; Latihan tetap tanpa partner. Pertemuan pulau hanya tersedia di Adventure.
- Gambar Canvas memiliki telinga dan ekor yang bergerak sendiri, napas, kedipan, pose Thunder Shock, lambaian saat disentuh di taman, serta tidur singkat saat idle. Portrait taman dianimasikan hanya ketika dialog terbuka; latarnya disimpan dalam cache. Reduced motion menampilkan pose statis.

Validasi: `node pikachu-check.cjs` dengan pengaturan Playwright yang sama. Tes mencakup penempatan, jarak/Air Lock, persistensi, perlindungan per misi, pause/reset, pemisahan mode, animasi asli, tampilan HP, ID/EN, dan penyimpanan diblokir. Semua request eksternal diblokir.

### Sanctuary Journey: telur dan perjalanan wilayah

- **Adventure** dimulai di **Gua Kristal**. Tiga kemenangan boss pertama membuka **Lautan Safir**, **Langit Fajar**, lalu **Taman Kosmik**. Skor tinggi saja tidak melewati wilayah. Setelah itu permainan berlanjut tanpa batas di taman kosmik. Daily, Boss Rush, dan Latihan mempertahankan alur sebelumnya.
- Perpindahan wilayah menampilkan ilustrasi dan aturan baru. Permainan serta seluruh timer dijeda sampai pemain menekan **Terbang ke wilayah baru** atau Escape. Pertarungan boss sendiri tetap berjalan tanpa dialog kedatangan.
- **Kristal gua:** +8 Air Lock. **Mutiara laut:** bergeser satu petak ke kanan setiap 4 detik jika petaknya kosong, +12 Air Lock. **Cincin angin:** +12 Dragon Ascent. **Debu bintang:** +8 Air Lock dan +8 Ascent. Bonus tidak menambah skor atau panjang tubuh; meter tetap mengikuti batas normal.
- **Telur opsional:** kesempatan pertama setelah 12 detik bermain; kemunculan menunggu bila ada Sky Rift atau pilihan upgrade. Sentuh telur bercincin mint untuk menerima misi, lalu masuki sarang emas dengan kepala. Telur mengikuti ujung ekor tanpa menambah panjang tubuh. Tawaran yang diabaikan berakhir setelah 25 detik; misi yang sudah diterima tidak memiliki batas waktu pengantaran.
- **Murkrow:** setelah telur dibawa, pemburu menandai petak ekor selama 2,6 detik sebelum menyambar. Jika ekor masih berada di petak tersebut, telur dibawa pergi. Kepala/tubuh tidak terkena damage, Shield dan skor tidak berkurang. Setelah menghindar ada jeda 7 detik sebelum bidikan berikutnya.
- Saat boss muncul, telur dititipkan di tempat aman dan sergapan dibatalkan. Misi serta spesies telur dipertahankan; telur/sarang ditempatkan kembali pada petak yang tersedia setelah pertarungan. Bila ruang belum cukup, telur tetap dititipkan.
- Berhasil mengantar menetaskan **Togepi, Azurill, atau Swablu**, menampilkan efek menetas, dan memberi **+25 Air Lock**. Misi berikutnya dijadwalkan 35 detik sesudah misi selesai atau tawaran berakhir.
- Tombol **TAMAN / GARDEN** membuka pulau taman dengan ilustrasi ketiga Pokémon dan jumlah penyelamatannya. Progres disimpan lokal di browser, terpisah dari skor dan album lama. Jika penyimpanan diblokir, taman masih bekerja selama halaman terbuka dan menampilkan keterbatasan tersebut. Membuka taman saat bermain menjeda game; sesudah menutupnya, gunakan Lanjutkan.
- Latar gua dan lautan digambar di Canvas serta disimpan dalam cache. Tidak ada unduhan aset atau layanan tambahan. Efek ringan dan reduced motion tetap didukung.

Validasi fitur ini: `node sanctuary-check.cjs` dengan `PLAYWRIGHT_PATH` bila diperlukan. Pengujian memblokir jaringan eksternal dan memeriksa penyelamatan, pemburu, persistensi, boss, perpindahan wilayah, timer, ID/EN, tampilan 320/390px, dan penyimpanan yang diblokir. `STORM_TEST_OUTPUT` menentukan folder screenshot.

### Legends: boss adaptif, jalur Mega, dan partner

Di lobby, buka **Gaya bermain / Play style** untuk memilih jalur Mega dan partner. Pilihan serta pengaturan sinematik disimpan di browser. Jalur dan partner berlaku untuk Adventure, Daily, dan Boss Rush; latihan tetap menggunakan mekanik dasarnya.

- **Boss adaptif:** membaca maksimal 32 gerakan dan 8 arah Beam terakhir. Pola di tepi, gerakan lurus, gerakan berkelok, serta arah Beam berulang memengaruhi prediksi serangan; Deoxys dapat memilih posisi teleport di luar jalur tembakan yang sering dipakai. HUD menunjukkan pola yang sedang dibaca. Serangan tetap memberi peringatan minimal 1,25 detik. Pencarian rute memeriksa kemungkinan keluar berdasarkan posisi dan bahaya saat ini; bila tidak menemukan rute, boss menunda serangan. Musuh bergerak dan keputusan pemain masih dapat mengubah kondisi sesudah pemeriksaan.
- **Notifikasi boss:** kedatangan dan fase kedua menampilkan pemberitahuan singkat selama 3,2 detik. Game tetap berjalan tanpa dialog atau tombol Lanjut. Notifikasi bisa dimatikan di Gaya bermain; pause manual dan otomatis ketika tab tersembunyi tetap berlaku.
- **Tempest:** saat Mega, gerak lebih cepat 8 ms per langkah dan Beam menyambarkan petir ke 1–3 monster liar dalam jarak 4 petak dari target sebelumnya. Upgrade Combo menaikkan jumlah sambaran. Petir tambahan tidak menggandakan damage boss.
- **Prism:** saat Mega, Beam bercabang dan membelok sekali di tepi arena. Upgrade Hyper Core memperpanjang pantulan 6–10 petak. Seluruh cabang hanya menghitung satu hit pada boss per tembakan.
- **Ancient:** saat masuk Mega dari bentuk normal, mendapat 1 Shield (maksimum 3). Shield yang pecah memberi perlindungan 0,85–1,15 detik sesuai tier Guard; serangan skill boss bisa dipantulkan untuk 2 damage. Tabrakan dinding tetap fatal dan menabrak tubuh sendiri/boss tidak memantulkan serangan. Memperpanjang Mega yang masih aktif tidak memberi Shield lagi.
- **Grafik jalur:** tiga palet Mega baru, motif petir/kristal/perisai, dan efek petir berantai. Palet kosmetik Pastel serta Shiny tetap diprioritaskan; motif jalur masih terlihat.
- **Luma, pemandu:** mencari saran rute 3–5 langkah dengan mempertimbangkan tubuh, batu, musuh, meteor, dan waktu serangan. Titik mint diperbarui setiap langkah; rute adalah saran berdasarkan kondisi saat ini. Portal tidak dipakai dalam perencanaan.
- **Pip, kolektor:** mengambil berry dalam jangkauan rute 3–5 langkah setiap 12/10/8 detik. Berry memberi poin dan efek combo tanpa memanjangkan tubuh. Pip tidak mengambil item evolusi atau power-up lain. Kedua partner naik tingkat ikatan pada 8 dan 16 item dalam satu run; reset saat memulai run baru.

Semua keputusan dijalankan lokal tanpa API AI. Perubahan ini tidak mengirim atau memigrasikan skor lama.

### Sky Rift & Perfect Dodge

- **Sky Rift:** di Adventure dan Harian, tiga portal opsional muncul setiap 60-90 detik di luar pertarungan boss. Dalam 15 detik, masuk portal B/M/G untuk memilih tantangan tanpa menu atau jeda. Tantangan berjalan 15 detik di arena yang sama.
- **Berry Rush (B):** ambil 3 berry biru bercincin; tubuh tidak memanjang.
- **Meteor Dash (M):** bertahan 15 detik, dengan dua meteor per gelombang dan tanda peringatan 1,8 detik.
- **Golden Chase (G):** tangkap ikan emas bercincin yang berpindah setiap 2,4 detik.
- Berhasil memberi **2x poin selama 10 detik dan +20 charge Ascent**. Mengabaikan atau gagal tidak mengurangi skor. Rift ditutup saat boss datang; meteor khusus event dibersihkan. Pause membekukan timer. Latihan dan Boss Rush tidak memunculkan Rift.
- **Perfect Dodge:** keluar dari petak serangan boss yang aktif atau maksimal 250 ms sebelum aktif, lalu tetap aman saat aktivasi, memberi **+15 Ascent dan +10 Air Lock**. Maksimum sekali per serangan, cooldown 1,2 detik. Teleportasi, serangan yang dibersihkan, dan masa kebal Shield tidak memberi bonus.
- `node sky-rift-check.cjs` menguji tantangan, hadiah, penempatan, timer, mode, Perfect Dodge, notifikasi boss tanpa jeda, dan tampilan mobile. Semua request eksternal diblokir.

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

`node legends-check.cjs` menguji adaptasi boss dan rute keluar, ketiga jalur Mega, partner, notifikasi boss tanpa jeda dengan frame loop asli, pause/reset/expiry, penyimpanan pilihan, serta UI ID/EN dan mobile. Request eksternal diblokir selama pengujian.

`node monster-art-check.cjs` memeriksa delapan ilustrasi, cache, atlas, pause, ID/EN, tampilan HP 320px, dan pengaturan gerakan/efek ringan. Gunakan pengaturan Playwright yang sama seperti pengujian di bawah.

Pemeriksaan sintaks dan referensi DOM:

```powershell
node "C:\Users\lenovo\.codex\skills\storm-emeralda-game-dev\scripts\check_game.mjs" ".\index.html"
```

Dengan Playwright terpasang dan Microsoft Edge tersedia, jalankan `node expeditions-check.cjs` untuk memeriksa mode, timer, latihan, pemisahan rekor, hasil PNG, ID/EN, dan tampilan mobile. `PLAYWRIGHT_PATH` dapat menunjuk instalasi Playwright di luar folder game; `STORM_TEST_OUTPUT` menentukan folder screenshot. Pengujian ini memblokir semua request non-lokal, sehingga tidak mengirim skor ke leaderboard produksi.
