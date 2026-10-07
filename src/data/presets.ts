export interface PresetCase {
  id: string;
  title: string;
  badge: string;
  spmFocus: string[];
  teacherName: string;
  schoolLevel: string;
  subject: string;
  topic: string;
  reflectionText: string;
  description: string;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'numerasi-deep-learning',
    title: 'Siswa Hafal Rumus tetapi Bingung Soal Cerita Nyata',
    badge: 'Numerasi & Deep Learning',
    spmFocus: ['Numerasi & Pemecahan Masalah', 'Kualitas Pembelajaran'],
    teacherName: 'Bapak Ahmad Fauzi, S.Pd.',
    schoolLevel: 'Fase D (SMP Kelas 7-9)',
    subject: 'Matematika',
    topic: 'Aritmetika Sosial & Persentase Diskon',
    description: 'Murid bisa menghitung rumus diskon saat angka langsung diberikan, tetapi bingung saat disajikan masalah belanja nyata.',
    reflectionText: `Kemarin saat pembelajaran Aritmetika Sosial materi diskon dan keuntungan, anak-anak terlihat lancar ketika saya berikan latihan rumus langsung seperti 'hitung 20% dari Rp100.000'. Namun saat saya berikan soal cerita kontekstual tentang membandingkan promo belanja di dua supermarket berbeda, sebagian besar murid diam, bingung harus mulai dari mana, dan bertanya rumus apa yang harus dipakai. Saya merasa pembelajaran saya masih sebatas drill rumus, siswa belum memahami makna esensial di balik persentase, dan belum mampu bernalar kritis mengaitkan matematika dengan keputusan hidup sehari-hari.`,
  },
  {
    id: 'literasi-kritis',
    title: 'Siswa Enggan Membaca Teks Panjang & Kesulitan Menarik Kesimpulan',
    badge: 'Literasi & Pemikiran Kritis',
    spmFocus: ['Literasi Membaca & Menalar', 'Kualitas Pembelajaran'],
    teacherName: 'Ibu Ratna Dewi, M.Pd.',
    schoolLevel: 'Fase C (SD Kelas 5-6)',
    subject: 'Bahasa Indonesia & IPAS',
    topic: 'Teks Eksplanasi tentang Perubahan Lingkungan',
    description: 'Siswa hanya menyalin kalimat pertama dan kesulitan menganalisis sebab-akibat fenomena alam.',
    reflectionText: `Saya merasa kesulitan membangkitkan minat baca murid saat mempelajari teks eksplanasi tentang banjir dan kerusakan hutan. Saat diminta membaca artikel 3 paragraf, banyak siswa yang cepat bosan, hanya membaca sekilas, lalu saat ditanya inti masalah atau penyebab utamanya, mereka hanya menyalin mentah kalimat pertama paragraf. Sangat sedikit yang mampu menghubungkan informasi antar paragraf apalagi memberikan opini solusi lingkungan. Saya bingung cara memfasilitasi kegiatan membaca yang menyenangkan dan melatih pemikiran kritis tanpa membebani siswa.`,
  },
  {
    id: 'inklusivitas-diferensiasi',
    title: 'Keberagaman Kemampuan Tinggi, Siswa Tertinggal Merasa Minder',
    badge: 'Inklusivitas & Diferensiasi',
    spmFocus: ['Inklusivitas & Diferensiasi', 'Iklim Keamanan Belajar'],
    teacherName: 'Ibu Siti Nurhaliza, S.Pd.',
    schoolLevel: 'Fase E (SMA Kelas 10)',
    subject: 'Fisika / IPAS',
    topic: 'Energi Terbarukan & Efisiensi Energi',
    description: 'Rentang kemampuan siswa sangat lebar, siswa lambat belajar pasif dan tidak berani bertanya.',
    reflectionText: `Tantangan terbesar di kelas saya adalah variasi kemampuan siswa yang sangat heterogen. Sekitar 5 siswa sangat cepat menangkap konsep dan mendominasi diskusi kelompok, sementara ada 6-8 siswa yang kemampuan dasar perhitungannya masih sangat lemah sehingga mereka hanya pasif dan tampak malu/minder untuk bertanya. Akibatnya saat tugas kelompok tentang rancangan miniatur energi surya, hanya anak yang pintar yang bekerja, sedangkan anak yang tertinggal merasa tidak dilibatkan. Saya ingin menerapkan pembelajaran berdiferensiasi yang inklusif namun waktu dan kesiapan materi saya terbatas.`,
  },
  {
    id: 'iklim-keamanan-partisipasi',
    title: 'Siswa Takut Salah Berbicara & Dominasi Siswa Vokal',
    badge: 'Iklim Keamanan & Kolaborasi',
    spmFocus: ['Iklim Keamanan Belajar', 'Kualitas Pembelajaran'],
    teacherName: 'Bapak Hendra Pratama, S.Pd.',
    schoolLevel: 'Fase B (SD Kelas 3-4)',
    subject: 'Pendidikan Pancasila & PPKn',
    topic: 'Musyawarah & Menghargai Pendapat',
    description: 'Siswa takut ditertawakan teman bila keliru menjawab, suasana kelas tegang saat tanya jawab.',
    reflectionText: `Ketika saya membuka sesi tanya jawab dan pendapat mengenai aturan kelas dan musyawarah, hanya ada 2 anak yang selalu mengacungkan tangan. Murid-murid lain menunduk atau saling lirik karena khawatir diejek atau ditertawakan jika jawabannya kurang tepat. Pernah ada satu murid mencoba menjawab dan terdengar bisikan tawa dari teman belakangnya, yang membuatnya langsung terdiam dan tidak mau bicara lagi. Saya menyadari iklim psikologis di kelas saya belum cukup aman bagi seluruh siswa untuk berani mengambil risiko belajar dan berpendapat secara terbuka.`,
  },
  {
    id: 'smk-relevansi-industri',
    title: 'Praktik Kejuruan Masih Terpaku Prosedur, Kurang Pemecahan Masalah Nyata',
    badge: 'Koneksi Industri & Deep Learning',
    spmFocus: ['Kualitas Pembelajaran', 'Literasi & Pemecahan Masalah'],
    teacherName: 'Bapak Bambang Sutrisno, S.T.',
    schoolLevel: 'Fase F (SMK Kelas 11-12)',
    subject: 'Teknik Komputer & Jaringan / Produktif',
    topic: 'Troubleshooting Jaringan Lokal (LAN) Perkantoran',
    description: 'Siswa bisa memasang kabel sesuai modul, namun macet saat diberi studi kasus gangguan jaringan riil di kantor.',
    reflectionText: `Pada modul praktik perakitan dan konfigurasi jaringan LAN, siswa berhasil mengikuti langkah-langkah di jobsheet secara rapi. Namun saat saya buat simulasi kerusakan acak di lapangan (misalnya IP conflict atau kegagalan gateway pada skenario kantor nyata), mereka panik dan tidak terbiasa melakukan analisis logis atau bertanya secara terstruktur. Mereka terbiasa dengan hafalan langkah baku daripada menganalisis penyebab akar masalah. Saya ingin mendorong pembelajaran berbasis proyek (PBL) yang benar-benar mendalam dan menumbuhkan daya nalar problem solver standar industri.`,
  },
];

export const SPM_INDICATORS = [
  {
    id: 'literasi',
    name: 'Literasi Membaca & Menalar',
    desc: 'Kemampuan memahami, mengevaluasi, dan merefleksi teks secara mendalam.',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'numerasi',
    name: 'Numerasi & Pemecahan Masalah',
    desc: 'Penalaran kuantitatif, interpretasi data, dan aplikasi logika dalam kehidupan.',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'keamanan',
    name: 'Iklim Keamanan Belajar',
    desc: 'Ruang kelas bebas perundungan, rasa aman berpendapat, dan respek timbal balik.',
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 'inklusivitas',
    name: 'Inklusivitas & Kesetaraan',
    desc: 'Layanan belajar adil bagi keragaman kemampuan, gender, dan latar belakang siswa.',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'kualitas',
    name: 'Kualitas Pembelajaran',
    desc: 'Manajemen kelas efektif, instruksi berdiferensiasi, dan umpan balik konstruktif.',
    color: 'from-rose-600 to-pink-600',
  },
];

export const DEEP_LEARNING_PILLARS = [
  {
    title: 'Pemahaman Bermakna (Meaningful Learning)',
    desc: 'Bukan sekadar mengingat rumus/fakta, tetapi memahami "mengapa" dan esensi konsep sehingga dapat ditransfer ke situasi baru.',
  },
  {
    title: 'Berpikir Kritis & Reflektif (Critical Thinking)',
    desc: 'Menstimulasi rasa ingin tahu siswa melalui penyelidikan, analisis bukti, menimbang perspektif, dan merumuskan argumen.',
  },
  {
    title: 'Kolaborasi Otentik (Authentic Collaboration)',
    desc: 'Siswa belajar bersama untuk mencapai tujuan nyata, mendengarkan, saling mengisi peran, dan membangun kecerdasan sosial.',
  },
  {
    title: 'Relevansi Dunia Nyata (Real-World Relevance)',
    desc: 'Menghubungkan materi pelajaran dengan isu aktual di lingkungan murid, kehidupan sehari-hari, dan dunia kerja masa depan.',
  },
];
