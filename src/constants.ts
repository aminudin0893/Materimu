export const DAFTAR_MAPEL = [
  "Pendidikan Agama Islam",
  "Al-Islam",
  "Kemuhammadiyahan",
  "Bahasa Arab",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam (IPA)",
  "Ilmu Pengetahuan Sosial (IPS)",
  "Bahasa Inggris",
  "Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)",
  "Informatika",
  "Seni Budaya (Seni Musik/Rupa/Teater/Tari)",
  "Prakarya dan Kewirausahaan",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "Fisika",
  "Kimia",
  "Biologi",
  "Antropologi",
  "Muatan Lokal"
];

export const initialData = {
  generatedSubject: "Pendidikan Agama Islam",
  judulMateri: "Puasa Ramadhan",
  modelPembelajaran: "Model: Problem Based Learning (PBL)\n\nAlasan: Model ini dipilih karena materi Puasa Ramadhan sangat erat kaitannya dengan problematika fikih praktis sehari-hari. Dengan PBL, siswa tidak hanya menghafal teori, tetapi belajar memecahkan kasus nyata (seperti hukum lupa makan atau menyikat gigi saat puasa), sehingga pemahaman menjadi lebih mendalam dan kontekstual.\n\nSintaks/Langkah:\n1. Orientasi pada masalah (Penyajian kasus fikih).\n2. Mengorganisasi siswa untuk belajar (Pembagian kelompok).\n3. Membimbing penyelidikan (Diskusi & literasi kitab/buku).\n4. Mengembangkan & menyajikan hasil (Presentasi solusi).\n5. Menganalisis & mengevaluasi proses (Penguatan oleh guru).",
  pendekatanKhusus: "Materi puasa diajarkan bukan sekadar sebagai kewajiban menahan lapar yang membebani, melainkan sebagai bentuk 'Cinta Allah' agar organ tubuh kita beristirahat dan menjadi lebih sehat.\n\nSelain itu, puasa diajarkan sebagai sarana menumbuhkan empati dan welas asih (kasih sayang) kepada kaum fakir miskin yang sering kelaparan, sehingga melahirkan karakter dermawan dan peduli terhadap sesama manusia.",
  tp: [
    "Peserta didik mampu menjelaskan pengertian puasa Ramadhan secara bahasa dan istilah dengan benar sesuai kaidah fikih.",
    "Peserta didik mampu menunjukkan dalil naqli kewajiban puasa Ramadhan beserta terjemahannya dengan tartil.",
    "Peserta didik mampu mengidentifikasi syarat, rukun, dan hal-hal yang membatalkan puasa secara komprehensif.",
    "Peserta didik mampu menganalisis hikmah pelaksanaan puasa Ramadhan dalam kehidupan sehari-hari untuk membentuk karakter Islami."
  ],
  atpTabel: [
    { tahap: "Pendahuluan", kegiatan: "1. Guru membuka pelajaran dengan salam hangat dan doa bersama yang dipimpin oleh ketua kelas.\n2. Guru melakukan presensi dan menanyakan kabar siswa untuk membangun kedekatan emosional.\n3. Apersepsi: Guru memberikan pertanyaan pemantik tentang pengalaman berpuasa siswa di tahun sebelumnya.\n4. Guru menyampaikan Tujuan Pembelajaran (TP) yang ingin dicapai dan memberikan motivasi tentang pentingnya mempelajari materi ini.", durasi: "15 Menit" },
    { tahap: "Kegiatan Inti (Sintaks PBL)", kegiatan: "1. Orientasi Masalah: Guru menyajikan video/cerita pendek tentang dilema fikih puasa (misal: lupa makan).\n2. Mengorganisasikan Siswa: Guru membagi siswa ke dalam kelompok heterogen (4-5 orang).\n3. Membimbing Penyelidikan: Siswa berdiskusi membedah materi syarat, rukun, dan pembatal puasa menggunakan buku paket serta mengerjakan LKPD.\n4. Mengembangkan & Menyajikan Hasil: Setiap kelompok mempresentasikan hasil diskusi studi kasus di depan kelas dengan percaya diri.\n5. Menganalisis & Mengevaluasi: Kelompok lain memberikan tanggapan kritis dan guru memberikan penguatan konsep serta meluruskan miskonsepsi.", durasi: "90 Menit" },
    { tahap: "Penutup", kegiatan: "1. Guru bersama peserta didik membuat kesimpulan poin-poin penting dari materi yang telah dipelajari.\n2. Melaksanakan evaluasi formatif singkat untuk mengukur pemahaman siswa.\n3. Refleksi: Guru menanyakan perasaan siswa selama pembelajaran dan apa yang paling menarik.\n4. Guru menyampaikan materi untuk pertemuan berikutnya dan menutup dengan doa kafaratul majelis serta salam.", durasi: "15 Menit" }
  ],
  pertanyaanPemantik: [
    {
      pertanyaan: "Pernahkah kalian merasa sangat lapar dan haus karena belum makan seharian? Apa yang sebenarnya kalian rasakan saat itu?",
      jawabanAlternatif1: "Iya pernah, rasanya badan jadi lemas, tidak fokus, dan perut perih.",
      jawabanAlternatif2: "Pernah, rasanya ingin marah-marah dan cepat emosi karena haus.",
      penjelasanGuru: "Siswa diajak untuk merefleksikan rasa lapar. Guru kemudian memberikan penjelasan bahwa begitulah kondisi yang sering dirasakan oleh saudara kita yang fakir miskin. Puasa tidak hanya soal menahan lapar, melainkan bertujuan untuk melatih empati dan kepedulian sosial kita dari pengalaman fisik tersebut."
    },
    {
      pertanyaan: "Menurut kalian, mengapa Allah SWT mewajibkan kita untuk berpuasa di bulan Ramadhan padahal itu memberatkan?",
      jawabanAlternatif1: "Agar kita bisa merasakan penderitaan orang miskin dan lebih banyak bersyukur.",
      jawabanAlternatif2: "Untuk melatih kesabaran dan menahan hawa nafsu dari hal-hal yang buruk.",
      penjelasanGuru: "Guru mengapresiasi jawaban siswa dan memberikan penjelasan penguatan bahwa puasa pada hakikatnya bukan untuk menyiksa diri. Puasa adalah sarana utama untuk melatih ketakwaan (La'allakum tattaqun), mengendalikan hawa nafsu, serta menyehatkan jasmani maupun rohani."
    }
  ],
  pengertian: "Secara bahasa (etimologi), puasa yang dalam bahasa Arab disebut *Shaum* atau *Shiyam* memiliki arti menahan diri dari sesuatu. Menahan diri di sini memiliki makna yang luas, baik menahan dari makan, minum, maupun berbicara yang tidak bermanfaat.\n\nSedangkan secara istilah (terminologi) syariat Islam, puasa adalah ibadah yang melibatkan tindakan menahan diri dari makan, minum, dan segala hal yang dapat membatalkannya. Aktivitas ini dilakukan mulai dari terbitnya fajar shadiq (waktu subuh) hingga terbenamnya matahari (waktu maghrib).\n\nPelaksanaan ibadah puasa ini harus senantiasa disertai dengan niat yang ikhlas semata-mata karena mengharap ridha Allah SWT, serta mengikuti ketentuan dan syarat yang telah ditetapkan dalam fikih Islam.",
  dalil: [
    {
      sumber: "QS. Al-Baqarah Ayat 183",
      teksArab: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
      terjemahan: "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa."
    }
  ],
  subTopik: [
    {
      judulSub: "Syarat Wajib dan Syarat Sah Puasa",
      penjelasan: "Syarat Wajib adalah kondisi yang membuat seseorang diwajibkan berpuasa. Syarat ini meliputi: beragama Islam, Baligh (sudah dewasa), Berakal sehat, Mampu (tidak sedang sakit parah atau tua renta), dan Mukim (tidak sedang dalam perjalanan jauh/musafir).\n\nSementara itu, Syarat Sah adalah kondisi yang membuat puasa seseorang diterima. Syaratnya meliputi: beragama Islam, Tamyiz (mampu membedakan yang baik dan buruk), Suci dari haid dan nifas (khusus bagi perempuan), serta dikerjakan pada hari yang diperbolehkan (bukan pada hari Tasyrik, Idul Fitri, atau Idul Adha)."
    },
    {
      judulSub: "Rukun Puasa",
      penjelasan: "Terdapat dua rukun utama dalam ibadah puasa yang tidak boleh ditinggalkan.\n\nPertama, Niat. Yaitu menyengaja di dalam hati untuk berpuasa Ramadhan. Niat puasa wajib ini harus dilakukan pada malam hari sebelum terbit fajar.\n\nKedua, Imsak. Yaitu tindakan secara sadar untuk menahan diri dari segala sesuatu yang membatalkan puasa (seperti makan, minum, dan bersetubuh) mulai dari terbit fajar hingga terbenam matahari."
    },
    {
      judulSub: "Hal-hal yang Membatalkan Puasa",
      penjelasan: "Beberapa hal yang secara otomatis membatalkan puasa seseorang antara lain: makan dan minum dengan sengaja, muntah yang disengaja, serta berhubungan suami istri di siang hari pada bulan Ramadhan.\n\nSelain itu, keluarnya darah haid atau nifas bagi perempuan, gila (hilangnya akal sehat secara tiba-tiba), dan murtad (keluar dari agama Islam) juga termasuk hal-hal yang membatalkan puasa."
    }
  ],
  lkpd: {
    judul: "Analisis Kasus: Fiqih Puasa Sehari-hari",
    tujuan: "Peserta didik dapat menganalisis dan menyelesaikan studi kasus terkait hal-hal yang membatalkan dan diperbolehkan saat puasa berdasarkan pemahaman fikih.",
    langkahKerja: [
      "Bentuklah kelompok kecil yang terdiri dari 4-5 orang peserta didik.",
      "Bacalah 3 studi kasus yang diberikan oleh guru (contoh: hukum menyikat gigi di siang hari, hukum menelan ludah, dan hukum lupa makan saat puasa).",
      "Diskusikan status hukum dari masing-masing kasus tersebut dengan merujuk pada referensi buku paket atau LKS.",
      "Tuliskan argumen dan alasan logis kelompok Anda pada kertas karton yang telah disediakan.",
      "Presentasikan hasil analisis kelompok Anda di depan kelas untuk ditanggapi oleh kelompok lain."
    ]
  },
  tugasIndividu: {
    judul: "Jurnal Kegiatan Ramadhan",
    instruksi: "Buatlah tabel kegiatan ibadah harianmu selama 1 minggu di bulan Ramadhan di buku tugasmu.\n\nCatatlah kelancaran puasa, pelaksanaan shalat 5 waktu, shalat tarawih, dan tadarus Al-Quran. Jangan lupa untuk meminta tanda tangan orang tua pada setiap harinya sebagai bentuk validasi dan bukti pelaksanaan tugas."
  },
  tugasKelompok: {
    judul: "Mading Mini: Poster Hikmah Puasa",
    instruksi: "Setiap kelompok ditugaskan untuk membuat 1 buah poster kreatif berukuran A3. Poster tersebut harus berisi ajakan berpuasa beserta rincian hikmah-hikmah pelaksanaannya.\n\nPoster dapat dibuat secara manual menggunakan kertas gambar dan pewarna, atau didesain menggunakan aplikasi digital (seperti Canva) lalu dicetak. Hasil karya terbaik akan ditempel di majalah dinding sekolah."
  },
  tekaTekiSilang: {
    mendatar: [
      { nomor: 1, pertanyaan: "Bulan diwajibkannya puasa bagi umat Islam.", jawaban: "RAMADHAN" },
      { nomor: 3, pertanyaan: "Menahan diri dari makan dan minum.", jawaban: "PUASA" },
      { nomor: 5, pertanyaan: "Makan yang dilakukan sebelum terbit fajar.", jawaban: "SAHUR" }
    ],
    menurun: [
      { nomor: 2, pertanyaan: "Waktu berbuka puasa.", jawaban: "MAGHRIB" },
      { nomor: 4, pertanyaan: "Tujuan utama puasa agar menjadi orang yang...", jawaban: "TAKWA" }
    ]
  },
  pilihanGanda: [
    {
      soal: "Perintah kewajiban melaksanakan puasa Ramadhan bagi umat Islam terdapat dalam Al-Quran surah dan ayat...",
      opsiA: "QS. Al-Baqarah ayat 183",
      opsiB: "QS. Ali Imran ayat 183",
      opsiC: "QS. Al-Maidah ayat 3",
      opsiD: "QS. An-Nisa ayat 59",
      opsiE: "QS. Al-Baqarah ayat 255",
      kunci: "A"
    },
    {
      soal: "Tindakan menahan diri dari makan, minum, dan hawa nafsu mulai dari terbit fajar hingga terbenamnya matahari disebut...",
      opsiA: "Imsak",
      opsiB: "Puasa",
      opsiC: "Niat",
      opsiD: "Zakat",
      opsiE: "Tarawih",
      kunci: "B"
    },
    {
      soal: "Berikut ini yang termasuk ke dalam syarat wajib puasa adalah...",
      opsiA: "Islam, berakal, baligh, dan mampu",
      opsiB: "Niat dan menahan diri",
      opsiC: "Suci dari haid dan nifas",
      opsiD: "Tamyiz dan beragama Islam",
      opsiE: "Makan sahur dan menyegerakan berbuka",
      kunci: "A"
    },
    {
      soal: "Seseorang yang sedang sakit parah sehingga secara medis tidak mampu untuk berpuasa, maka ia wajib menggantinya dengan cara...",
      opsiA: "Membayar fidyah saja kepada fakir miskin",
      opsiB: "Mengqadha puasanya di hari lain jika ia sudah sembuh",
      opsiC: "Bersedekah ke panti asuhan terdekat",
      opsiD: "Membayar denda puasa selama 2 bulan berturut-turut",
      opsiE: "Tidak perlu mengganti puasanya sama sekali",
      kunci: "B"
    },
    {
      soal: "Salah satu hikmah sosial yang paling menonjol dari pelaksanaan ibadah puasa adalah...",
      opsiA: "Melatih kesabaran diri sendiri dalam menghadapi cobaan",
      opsiB: "Membuat sistem pencernaan tubuh menjadi lebih beristirahat",
      opsiC: "Menumbuhkan empati dan rasa kepedulian yang tinggi pada orang miskin",
      opsiD: "Mendapatkan pahala yang berlipat ganda dari Allah SWT",
      opsiE: "Menghapus dosa-dosa kecil yang telah lalu",
      kunci: "C"
    }
  ],
  instrumenPenilaian: {
    sikap: [
      "Observasi Kedisiplinan: Meliputi kehadiran di kelas dan pengumpulan tugas secara tepat waktu.",
      "Observasi Kejujuran: Meliputi sikap saat mengerjakan evaluasi tanpa melakukan tindakan mencontek.",
      "Observasi Keaktifan: Meliputi tingkat keterlibatan siswa saat pelaksanaan diskusi dan sesi tanya jawab."
    ],
    pengetahuan: "Penilaian pengetahuan dilakukan melalui tes tertulis berupa Soal Pilihan Ganda (terdiri dari 5 butir soal). Selain itu, dilakukan pula penilaian tanya jawab lisan pada saat sesi apersepsi di awal pembelajaran.",
    keterampilan: [
      "Penilaian Kinerja: Mengukur kemampuan siswa dalam mempresentasikan dan mengomunikasikan hasil diskusi LKPD di depan kelas.",
      "Penilaian Produk: Mengukur tingkat kerapian, kejelasan pesan, dan kreativitas siswa dalam pembuatan produk berupa Poster/Mading Mini."
    ]
  }
};
