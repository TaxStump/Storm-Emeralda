# Storm Emeralda 🐉

Snake game bertema Pokémon — kendalikan **Rayquaza** di gua dan kumpulkan item Pokémon!

## Cara main

Buka `index.html` di browser, atau deploy ke Netlify.

- **Gerak:** ← ↑ ↓ → atau WASD
- **Hyper Beam:** Spasi atau tombol ⚡ pada kontrol HP
- **Pause/Lanjutkan:** Escape
- **Fullscreen:** tombol ⛶ FULLSCREEN pada komputer

## Fitur

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
- Wave Kyogre tetap memiliki jalur aman selebar **9 petak**. Partner Pokémon dan perubahan sistem Mega belum termasuk tahap ini.

## Deploy

1. Drag folder ini ke [Netlify Drop](https://app.netlify.com/drop), atau
2. Sambungkan repo ini ke Netlify (Git) untuk auto-deploy setiap `git push`.
