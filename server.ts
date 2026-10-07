import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface AnalyzePayload {
  teacherName?: string;
  schoolLevel?: string;
  subject?: string;
  topic?: string;
  reflectionText: string;
  spmFocus?: string[];
  supervisorRole?: string;
}

app.post('/api/analyze', async (req, res) => {
  try {
    const {
      teacherName = 'Guru',
      schoolLevel = 'Fase D (SMP)',
      subject = 'Umum',
      topic = 'Pembelajaran',
      reflectionText,
      spmFocus = ['Literasi', 'Numerasi', 'Iklim Keamanan', 'Inklusivitas'],
      supervisorRole = 'Pengawas & Kepala Sekolah',
    } = req.body as AnalyzePayload;

    if (!reflectionText || !reflectionText.trim()) {
      return res.status(400).json({ error: 'Refleksi dan hambatan pembelajaran guru harus diisi.' });
    }

    if (!ai) {
      // Return structured pedagogical analysis if no API key is provided
      const fallbackData = generateFallbackAnalysis({
        teacherName,
        schoolLevel,
        subject,
        topic,
        reflectionText,
        spmFocus,
        supervisorRole,
      });
      return res.json(fallbackData);
    }

    const systemInstruction = `Anda adalah "Asisten AI Pendampingan Edukatif" yang bertugas membantu Pengawas Sekolah dan Kepala Sekolah dalam mendampingi Guru.
Tugas utama Anda adalah menganalisis refleksi dan hambatan pembelajaran yang ditulis oleh Guru, kemudian menghasilkan draft analisis dan rekomendasi solusi yang konstruktif.

Prinsip Utama Pendampingan:
1. Pembelajaran Mendalam (Deep Learning): Dorong proses belajar yang berfokus pada pemahaman bermakna, berpikir kritis, kolaborasi, dan relevansi dunia nyata (bukan sekadar hafalan).
2. Keselarasan SPM (Standar Pelayanan Minimal): Solusi harus mendukung indikator prioritas seperti peningkatan literasi, numerasi, iklim keamanan, dan inklusivitas sekolah.
3. Pendekatan Apresiatif & Konstruktif: Awali dengan validasi/apresiasi terhadap refleksi guru sebelum memberikan solusi.

Aturan Format Output:
Berikan tanggapan secara terstruktur dengan format berikut:
1. [APRESIASI & VALIDASI]
Tuliskan 1-2 kalimat apresiasi atas upaya dan refleksi yang telah dilakukan guru.

2. [ANALISIS AKAR MASALAH]
Tuliskan 1 kalimat ringkas mengenai inti kendala/hambatan yang dihadapi guru dari sudut pandang pedagogis.

3. [REKOMENDASI SOLUSI PRAKTIS FOR GURU]
Berikan 2-3 langkah konkret dan praktis yang bisa langsung diterapkan guru di kelas pada sesi pembelajaran berikutnya.

4. [CATATAN DISKUSI UNTUK KS & PENGAWAS]
Berikan 1-2 poin saran tindakan pendampingan atau fasilitasi yang perlu dilakukan oleh Kepala Sekolah atau Pengawas saat kunjungan/observasi kelas.

Gunakan bahasa Indonesia yang santun, profesional, menguatkan, dan mudah dipahami untuk mendukung efektivitas pengajaran di sekolah.`;

    const userPrompt = `Lakukan analisis terhadap refleksi dan hambatan guru berikut:
- Nama Guru: ${teacherName}
- Jenjang/Fase: ${schoolLevel}
- Mata Pelajaran: ${subject}
- Topik/Materi: ${topic}
- Fokus Prioritas SPM: ${Array.isArray(spmFocus) ? spmFocus.join(', ') : 'Literasi, Numerasi, Iklim Keamanan, Inklusivitas'}
- Peran Pendamping: ${supervisorRole}

Isi Refleksi dan Hambatan Pembelajaran Guru:
"""
${reflectionText}
"""

Mohon berikan analisis lengkap dan terstruktur dalam format JSON dengan format baku:
- apresiasiValidasi: 1-2 kalimat apresiasi dan validasi tulus atas refleksi guru.
- analisisAkarMasalah: 1 kalimat ringkas mengenai inti kendala dari sudut pandang pedagogis.
- rekomendasiSolusi: array berisi 2 hingga 3 langkah konkret & praktis untuk sesi belajar berikutnya.
- catatanDiskusiKSPengawas: array berisi 1 hingga 2 poin saran tindakan pendampingan / fasilitasi bagi KS atau Pengawas.
- formattedOutput: string lengkap gabungan berformat baku:
1. [APRESIASI & VALIDASI]
...
2. [ANALISIS AKAR MASALAH]
...
3. [REKOMENDASI SOLUSI PRAKTIS FOR GURU]
...
4. [CATATAN DISKUSI UNTUK KS & PENGAWAS]
...
- pertanyaanPemantikCoaching: array 2-3 pertanyaan pemantik dialog percakapan pasca-observasi.
- keselarasanSPM: penjelasan ringkas keselarasan indikator SPM.
- dimensiDeepLearning: penjelasan fokus pemahaman bermakna dan berpikir kritis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            apresiasiValidasi: {
              type: Type.STRING,
              description: '1-2 kalimat apresiasi atas upaya dan refleksi yang telah dilakukan guru',
            },
            analisisAkarMasalah: {
              type: Type.STRING,
              description: '1 kalimat ringkas mengenai inti kendala/hambatan guru dari sudut pandang pedagogis',
            },
            rekomendasiSolusi: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 langkah konkret dan praktis yang bisa langsung diterapkan guru di kelas',
            },
            catatanDiskusiKSPengawas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '1-2 poin saran tindakan pendampingan atau fasilitasi oleh KS/Pengawas',
            },
            formattedOutput: {
              type: Type.STRING,
              description: 'Format baku lengkap gabungan 4 bagian',
            },
            pertanyaanPemantikCoaching: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 pertanyaan reflektif coaching untuk KS/Pengawas saat supervisi',
            },
            keselarasanSPM: {
              type: Type.STRING,
              description: 'Penjelasan keterkaitan dengan indikator prioritas SPM sekolah',
            },
            dimensiDeepLearning: {
              type: Type.STRING,
              description: 'Keterkaitan dengan pembelajaran mendalam dan pemikiran kritis',
            },
          },
          required: [
            'apresiasiValidasi',
            'analisisAkarMasalah',
            'rekomendasiSolusi',
            'catatanDiskusiKSPengawas',
            'formattedOutput',
          ],
        },
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating analysis:', error);
    // Graceful fallback if model error occurs
    const fallback = generateFallbackAnalysis(req.body);
    return res.json({
      ...fallback,
      _note: 'Dihasilkan melalui modul cadangan berbasis SPM & Deep Learning.',
    });
  }
});

function generateFallbackAnalysis(data: any) {
  const teacher = data.teacherName || 'Bapak/Ibu Guru';
  const subject = data.subject || 'pembelajaran';
  const topic = data.topic || 'topik ini';

  const apresiasi = `Apresiasi tinggi atas keterbukaan dan komitmen reflektif ${teacher} dalam mengenali dinamika pembelajaran ${subject} pada materi ${topic}. Kesadaran untuk mengevaluasi tantangan di kelas merupakan langkah fundamental dalam mewujudkan perbaikan mutu pembelajaran yang berkelanjutan.`;

  const akarMasalah = `Aktivitas belajar masih cenderung berpusat pada instruksi satu arah dan penyampaian konten konseptual, sehingga ruang untuk eksplorasi kontekstual, pemikiran kritis siswa, dan diferensiasi kebutuhan belajar belum terfasilitasi secara optimal.`;

  const solusi = [
    `Terapkan strategi Think-Pair-Share atau studi kasus kontekstual selama 15 menit agar siswa aktif berdialog, menghubungkan konsep ${topic} dengan pengalaman nyata mereka, dan memupuk pemikiran kritis.`,
    `Gunakan teknik scaffolding berjenjang dan kartu panduan visual untuk mengakomodasi keberagaman kecepatan belajar siswa sehingga setiap murid merasa aman mencoba tanpa takut salah.`,
    `Sisipkan refleksi formatif singkat 5 menit di akhir sesi menggunakan 'Exit Ticket' (contoh: 1 hal yang dipahami, 1 hal yang masih membingungkan) untuk memetakan pemahaman bermakna siswa secara terukur.`,
  ];

  const catatanKS = [
    `Fasilitasi sesi percakapan coaching pasca-observasi dengan menanyakan sudut pandang ${teacher} terlebih dahulu terkait momen keberhasilan murid dan area yang ingin dikembangkan.`,
    `Dukung penyediaan sumber belajar kontekstual dan dorong kolaborasi ${teacher} dalam Komunitas Belajar (Kombel) sekolah untuk berbagi praktik baik pembelajaran mendalam.`,
  ];

  const formattedOutput = `1. [APRESIASI & VALIDASI]
${apresiasi}

2. [ANALISIS AKAR MASALAH]
${akarMasalah}

3. [REKOMENDASI SOLUSI PRAKTIS FOR GURU]
${solusi.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

4. [CATATAN DISKUSI UNTUK KS & PENGAWAS]
${catatanKS.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}`;

  return {
    apresiasiValidasi: apresiasi,
    analisisAkarMasalah: akarMasalah,
    rekomendasiSolusi: solusi,
    catatanDiskusiKSPengawas: catatanKS,
    formattedOutput,
    pertanyaanPemantikCoaching: [
      `Bagaimana respons murid saat Bapak/Ibu mencoba pendekatan kontekstual tersebut?`,
      `Dukungan apa dari Kepala Sekolah atau rekan sejawat yang paling Bapak/Ibu butuhkan saat ini?`,
    ],
    keselarasanSPM: `Mendukung penguatan indikator Kualitas Pembelajaran, Iklim Keamanan Belajar (lingkungan suportif), serta peningkatan Literasi & Numerasi melalui pemahaman bermakna.`,
    dimensiDeepLearning: `Berfokus pada pemikiran kritis, relevansi dunia nyata, dan partisipasi kolaboratif aktif murid daripada sekadar hafalan fakta.`,
  };
}

// Development or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
