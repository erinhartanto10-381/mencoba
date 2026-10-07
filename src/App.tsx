/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Copy,
  Check,
  Printer,
  RotateCcw,
  History,
  FileText,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  MessageSquare,
  HelpCircle,
  Edit3,
  BookmarkPlus,
  Trash2,
  Download,
} from 'lucide-react';
import { PRESET_CASES, SPM_INDICATORS, DEEP_LEARNING_PILLARS, PresetCase } from './data/presets.ts';

interface AnalysisResult {
  apresiasiValidasi: string;
  analisisAkarMasalah: string;
  rekomendasiSolusi: string[];
  catatanDiskusiKSPengawas: string[];
  formattedOutput: string;
  pertanyaanPemantikCoaching?: string[];
  keselarasanSPM?: string;
  dimensiDeepLearning?: string;
}

interface SavedSession {
  id: string;
  timestamp: string;
  teacherName: string;
  schoolLevel: string;
  subject: string;
  topic: string;
  spmFocus: string[];
  supervisorRole: string;
  reflectionText: string;
  analysis: AnalysisResult;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'form' | 'presets' | 'history' | 'guide'>('form');

  // Form State
  const [teacherName, setTeacherName] = useState('Bapak Ahmad Fauzi, S.Pd.');
  const [schoolLevel, setSchoolLevel] = useState('Fase D (SMP)');
  const [subject, setSubject] = useState('Matematika');
  const [topic, setTopic] = useState('Aritmetika Sosial & Diskon Nyata');
  const [supervisorRole, setSupervisorRole] = useState<'Pengawas Sekolah' | 'Kepala Sekolah'>('Pengawas Sekolah');
  const [supervisorName, setSupervisorName] = useState('Drs. M. Hartanto, M.Pd.');
  const [spmFocus, setSpmFocus] = useState<string[]>([
    'Numerasi & Pemecahan Masalah',
    'Kualitas Pembelajaran',
  ]);
  const [reflectionText, setReflectionText] = useState(
    `Kemarin saat pembelajaran Aritmetika Sosial materi diskon dan keuntungan, anak-anak terlihat lancar ketika saya berikan latihan rumus langsung seperti 'hitung 20% dari Rp100.000'. Namun saat saya berikan soal cerita kontekstual tentang membandingkan promo belanja di dua supermarket berbeda, sebagian besar murid diam, bingung harus mulai dari mana, dan bertanya rumus apa yang harus dipakai. Saya merasa pembelajaran saya masih sebatas drill rumus, siswa belum memahami makna esensial di balik persentase, dan belum mampu bernalar kritis mengaitkan matematika dengan keputusan hidup sehari-hari.`
  );

  // Loading & Output states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Output state
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState<AnalysisResult | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('asisten_edukatif_history');
      if (saved) {
        setSavedSessions(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const saveHistoryToStorage = (updated: SavedSession[]) => {
    setSavedSessions(updated);
    try {
      localStorage.setItem('asisten_edukatif_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleSpmToggle = (indicatorName: string) => {
    if (spmFocus.includes(indicatorName)) {
      if (spmFocus.length > 1) {
        setSpmFocus(spmFocus.filter((item) => item !== indicatorName));
      }
    } else {
      setSpmFocus([...spmFocus, indicatorName]);
    }
  };

  const handleApplyPreset = (preset: PresetCase) => {
    setTeacherName(preset.teacherName);
    setSchoolLevel(preset.schoolLevel);
    setSubject(preset.subject);
    setTopic(preset.topic);
    setReflectionText(preset.reflectionText);
    setSpmFocus(preset.spmFocus);
    setActiveTab('form');
  };

  const handleSubmitAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reflectionText.trim()) {
      setErrorMsg('Harap isi teks refleksi dan hambatan pembelajaran guru.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setLoadingStep('1/3: Menganalisis refleksi guru & memetakan akar masalah pedagogis...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('2/3: Menyelaraskan dengan pilar Deep Learning & indikator SPM...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('3/3: Merumuskan rekomendasi praktis & catatan supervisi klinis...');
    }, 2400);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName,
          schoolLevel,
          subject,
          topic,
          reflectionText,
          spmFocus,
          supervisorRole,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi asisten AI');
      }

      const data: AnalysisResult = await res.json();
      setAnalysisResult(data);
      setEditableResult(data);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg('Terjadi kendala saat menganalisis. Silakan coba kembali.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
    }
  };

  const getFullFormattedText = () => {
    const data = editableResult || analysisResult;
    if (!data) return '';
    return `=======================================================
LEMBAR CATATAN PENDAMPINGAN EDUKATIF
=======================================================
Pendamping      : ${supervisorName} (${supervisorRole})
Guru Sasaran    : ${teacherName}
Mata Pelajaran  : ${subject} (${schoolLevel})
Topik/Materi    : ${topic}
Fokus SPM       : ${spmFocus.join(', ')}
Tanggal Analisis: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
=======================================================

1. [APRESIASI & VALIDASI]
${data.apresiasiValidasi}

2. [ANALISIS AKAR MASALAH]
${data.analisisAkarMasalah}

3. [REKOMENDASI SOLUSI PRAKTIS FOR GURU]
${data.rekomendasiSolusi.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

4. [CATATAN DISKUSI UNTUK KS & PENGAWAS]
${data.catatanDiskusiKSPengawas.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}
${
  data.pertanyaanPemantikCoaching?.length
    ? `\n[PERTANYAAN PEMANTIK COACHING (ALUR TIRTA)]\n${data.pertanyaanPemantikCoaching
        .map((p, idx) => `• ${p}`)
        .join('\n')}`
    : ''
}
${data.keselarasanSPM ? `\n[KESELARASAN SPM]: ${data.keselarasanSPM}` : ''}
${data.dimensiDeepLearning ? `\n[PEMBELAJARAN MENDALAM]: ${data.dimensiDeepLearning}` : ''}
=======================================================`;
  };

  const handleCopy = () => {
    const text = getFullFormattedText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToHistory = () => {
    const current = editableResult || analysisResult;
    if (!current) return;

    const newSession: SavedSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      teacherName,
      schoolLevel,
      subject,
      topic,
      spmFocus,
      supervisorRole,
      reflectionText,
      analysis: current,
    };

    const updated = [newSession, ...savedSessions];
    saveHistoryToStorage(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = savedSessions.filter((s) => s.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleLoadSession = (session: SavedSession) => {
    setTeacherName(session.teacherName);
    setSchoolLevel(session.schoolLevel);
    setSubject(session.subject);
    setTopic(session.topic);
    setSpmFocus(session.spmFocus);
    setSupervisorRole(session.supervisorRole as any);
    setReflectionText(session.reflectionText);
    setAnalysisResult(session.analysis);
    setEditableResult(session.analysis);
    setActiveTab('form');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Asisten AI Pendampingan Edukatif
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SPM & Deep Learning
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pemberdayaan Pengawas Sekolah & Kepala Sekolah dalam Supervisi Akademik Klinis
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Analisis Refleksi</span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Studi Kasus Riil</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat ({savedSessions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Pilar</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Notice Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-slate-100 py-3 px-4 border-b border-emerald-800/40 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Prinsip Inti:</strong> Pendekatan Apresiatif &bull; Pembelajaran Mendalam (Deep Learning) &bull; Keselarasan SPM Rapor Pendidikan
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini 3.8 Flash Aktif
            </span>
            <span className="text-slate-500">|</span>
            <span>Standar Supervisi Akademik Indonesia</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Formulir Analisis & Hasil */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Input (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6 print:hidden">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Input Refleksi Guru
                      </h2>
                      <p className="text-xs text-slate-500">
                        Data observasi & kendala yang dihadapi guru
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('presets')}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Pilih Kasus Contoh</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitAnalysis} className="space-y-4">
                  {/* Supervisor Profile */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Peran Pendamping
                      </label>
                      <select
                        value={supervisorRole}
                        onChange={(e) => setSupervisorRole(e.target.value as any)}
                        className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Pengawas Sekolah">Pengawas Sekolah</option>
                        <option value="Kepala Sekolah">Kepala Sekolah</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        Nama Pendamping
                      </label>
                      <input
                        type="text"
                        value={supervisorName}
                        onChange={(e) => setSupervisorName(e.target.value)}
                        placeholder="Nama KS / Pengawas"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Teacher & Class Metadata */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Guru
                      </label>
                      <input
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Contoh: Ibu Rina, S.Pd."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jenjang / Fase
                      </label>
                      <select
                        value={schoolLevel}
                        onChange={(e) => setSchoolLevel(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Fase A (SD Kelas 1-2)">Fase A (SD Kelas 1-2)</option>
                        <option value="Fase B (SD Kelas 3-4)">Fase B (SD Kelas 3-4)</option>
                        <option value="Fase C (SD Kelas 5-6)">Fase C (SD Kelas 5-6)</option>
                        <option value="Fase D (SMP Kelas 7-9)">Fase D (SMP Kelas 7-9)</option>
                        <option value="Fase E (SMA Kelas 10)">Fase E (SMA Kelas 10)</option>
                        <option value="Fase F (SMA Kelas 11-12)">Fase F (SMA Kelas 11-12)</option>
                        <option value="Fase F (SMK Kejuruan)">Fase F (SMK Kejuruan)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mata Pelajaran
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Misal: Matematika / IPAS"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Topik / Materi Pokok
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Misal: Aritmetika Sosial"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Fokus Prioritas SPM */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Fokus Prioritas Indikator SPM:</span>
                      <span className="text-[11px] text-slate-400 font-normal">Pilih 1 atau lebih</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SPM_INDICATORS.map((ind) => {
                        const active = spmFocus.includes(ind.name);
                        return (
                          <button
                            key={ind.id}
                            type="button"
                            onClick={() => handleSpmToggle(ind.name)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              active
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}
                            {ind.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refleksi & Hambatan Pembelajaran Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Refleksi & Hambatan Pembelajaran Guru
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {reflectionText.length} karakter
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Tuliskan catatan refleksi, kendala yang dialami guru di kelas, reaksi siswa, kesulitan pemahaman, atau dinamika kelompok..."
                      className="w-full text-xs leading-relaxed bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-inner"
                      required
                    ></textarea>

                    {/* Question Prompts Helper */}
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="italic flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        Tips: Jelaskan apa yang membuat siswa kesulitan dan respon guru saat itu.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setReflectionText(
                            `Kemarin saat pembelajaran, anak-anak terlihat kurang fokus dan cenderung pasif saat diminta membaca dan memecahkan soal berbasis studi kasus nyata. Kebanyakan menunggu jawaban dari saya atau teman yang paling pintar. Saya merasa metode ceramah dan latihan saya belum berhasil memantik pemikiran kritis dan pemahaman bermakna bagi seluruh murid.`
                          )
                        }
                        className="text-emerald-600 hover:underline"
                      >
                        Pakai Contoh Cepat
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm">Sedang Menganalisis...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm">Analisis & Susun Rekomendasi Pendampingan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Principle Box */}
              <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  3 Prinsip Pendampingan Edukatif:
                </div>
                <ul className="space-y-1.5 text-slate-600 pl-5 list-disc marker:text-emerald-500">
                  <li>
                    <strong>Deep Learning:</strong> Dorong pemahaman bermakna, berpikir kritis, kolaborasi, dan relevansi nyata (bukan sekadar hafalan).
                  </li>
                  <li>
                    <strong>Keselarasan SPM:</strong> Kuatkan indikator prioritas: literasi, numerasi, iklim keamanan belajar, dan inklusivitas.
                  </li>
                  <li>
                    <strong>Pendekatan Apresiatif:</strong> Awali dengan apresiasi tulus atas refleksi guru sebelum menyodorkan perbaikan.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Output / Result Card (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Loading State Skeleton */}
              {loading && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Asisten AI Sedang Mengolah Analisis
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{loadingStep}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Ready Output State */}
              {!loading && analysisResult && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden transition-all">
                  {/* Action Bar Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                          Draft Analisis & Rekomendasi Pendampingan
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {teacherName} &bull; {subject} ({schoolLevel})
                        </h3>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        title="Edit Draf Hasil"
                        className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          isEditing
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditing ? 'Selesai Edit' : 'Edit Draf'}</span>
                      </button>

                      <button
                        onClick={handleCopy}
                        title="Salin Teks Format Baku"
                        className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Format Baku</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSaveToHistory}
                        title="Simpan ke Arsip Supervisi"
                        className="p-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Simpan</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        title="Cetak Lembar Supervisi"
                        className="p-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 flex items-center gap-1.5 transition-all"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-300" />
                        <span>Cetak</span>
                      </button>
                    </div>
                  </div>

                  {saveSuccess && (
                    <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-2 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Berhasil disimpan ke Riwayat Dokumen Supervisi!</span>
                    </div>
                  )}

                  {/* Print Document Header (Visible in print or clean view) */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Pendamping
                      </span>
                      <span className="font-semibold text-slate-800">{supervisorName}</span>
                      <span className="block text-[11px] text-slate-500">({supervisorRole})</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Materi / Topik
                      </span>
                      <span className="font-semibold text-slate-800">{topic}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Fokus SPM Terpilih
                      </span>
                      <span className="font-semibold text-slate-800">{spmFocus.join(', ')}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">
                        Tanggal Supervisi
                      </span>
                      <span className="font-semibold text-slate-800">
                        {new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </div>

                  {/* 4 Mandatory Structured Sections */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* 1. [APRESIASI & VALIDASI] */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 relative">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs">
                          1
                        </span>
                        <h4 className="font-bold text-sm tracking-wide text-emerald-900 uppercase">
                          [APRESIASI &amp; VALIDASI]
                        </h4>
                      </div>

                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={editableResult?.apresiasiValidasi}
                          onChange={(e) =>
                            setEditableResult({
                              ...editableResult!,
                              apresiasiValidasi: e.target.value,
                            })
                          }
                          className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-emerald-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed italic bg-emerald-100/40 p-3 rounded-xl border border-emerald-200/50">
                          &ldquo;{editableResult?.apresiasiValidasi || analysisResult.apresiasiValidasi}&rdquo;
                        </p>
                      )}
                      <p className="text-[11px] text-emerald-700/80 mt-2">
                        *Memvalidasi kesadaran reflektif guru untuk membangun iklim saling percaya sebelum memberikan umpan balik.
                      </p>
                    </div>

                    {/* 2. [ANALISIS AKAR MASALAH] */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs">
                          2
                        </span>
                        <h4 className="font-bold text-sm tracking-wide text-amber-900 uppercase">
                          [ANALISIS AKAR MASALAH]
                        </h4>
                      </div>

                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={editableResult?.analisisAkarMasalah}
                          onChange={(e) =>
                            setEditableResult({
                              ...editableResult!,
                              analisisAkarMasalah: e.target.value,
                            })
                          }
                          className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-amber-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
                        />
                      ) : (
                        <div className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed bg-amber-100/40 p-3 rounded-xl border border-amber-200/50">
                          {editableResult?.analisisAkarMasalah || analysisResult.analisisAkarMasalah}
                        </div>
                      )}
                      <p className="text-[11px] text-amber-700/80 mt-2">
                        *Sorotan pedagogis 1 kalimat ringkas mengenai hambatan pembelajaran mendalam di kelas.
                      </p>
                    </div>

                    {/* 3. [REKOMENDASI SOLUSI PRAKTIS FOR GURU] */}
                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs">
                          3
                        </span>
                        <h4 className="font-bold text-sm tracking-wide text-blue-900 uppercase">
                          [REKOMENDASI SOLUSI PRAKTIS FOR GURU]
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {(editableResult?.rekomendasiSolusi || analysisResult.rekomendasiSolusi).map(
                          (solusi, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-blue-200/60 shadow-xs"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={solusi}
                                  onChange={(e) => {
                                    const next = [
                                      ...(editableResult?.rekomendasiSolusi ||
                                        analysisResult.rekomendasiSolusi),
                                    ];
                                    next[idx] = e.target.value;
                                    setEditableResult({
                                      ...editableResult!,
                                      rekomendasiSolusi: next,
                                    });
                                  }}
                                  className="w-full text-xs sm:text-sm text-slate-800 border border-blue-200 rounded px-2 py-1"
                                />
                              ) : (
                                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                                  {solusi}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      <p className="text-[11px] text-blue-700/80 mt-2">
                        *Langkah konkret dan operasional yang dapat langsung diterapkan guru pada pertemuan kelas berikutnya.
                      </p>
                    </div>

                    {/* 4. [CATATAN DISKUSI UNTUK KS & PENGAWAS] */}
                    <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs">
                          4
                        </span>
                        <h4 className="font-bold text-sm tracking-wide text-purple-900 uppercase">
                          [CATATAN DISKUSI UNTUK KS &amp; PENGAWAS]
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {(
                          editableResult?.catatanDiskusiKSPengawas ||
                          analysisResult.catatanDiskusiKSPengawas
                        ).map((catatan, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-purple-200/60 shadow-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={catatan}
                                onChange={(e) => {
                                  const next = [
                                    ...(editableResult?.catatanDiskusiKSPengawas ||
                                      analysisResult.catatanDiskusiKSPengawas),
                                  ];
                                  next[idx] = e.target.value;
                                  setEditableResult({
                                    ...editableResult!,
                                    catatanDiskusiKSPengawas: next,
                                  });
                                }}
                                className="w-full text-xs sm:text-sm text-slate-800 border border-purple-200 rounded px-2 py-1"
                              />
                            ) : (
                              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                                {catatan}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-purple-700/80 mt-2">
                        *Tindakan fasilitasi, penyediaan sumber daya, atau fokus observasi bagi Pengawas / KS.
                      </p>
                    </div>

                    {/* Bonus: Alur Percakapan Coaching Pasca-Observasi (TIRTA) */}
                    {analysisResult.pertanyaanPemantikCoaching &&
                      analysisResult.pertanyaanPemantikCoaching.length > 0 && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>Pertanyaan Pemantik Percakapan Coaching (Alur TIRTA)</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Gunakan pertanyaan terbuka ini saat sesi tatap muka refleksi pasca-observasi:
                          </p>
                          <div className="space-y-1.5 pl-2">
                            {analysisResult.pertanyaanPemantikCoaching.map((q, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-start gap-2"
                              >
                                <span className="text-emerald-600 font-bold">&bull;</span>
                                <span className="italic">&ldquo;{q}&rdquo;</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Bonus: Keterkaitan Rapor Pendidikan / SPM & Deep Learning */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                        <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                          <span>Penyelarasan SPM Sekolah:</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {analysisResult.keselarasanSPM ||
                            'Mendukung indikator prioritas literasi, numerasi, iklim keamanan, dan inklusivitas.'}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                        <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                          <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Pilar Pembelajaran Mendalam:</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {analysisResult.dimensiDeepLearning ||
                            'Berfokus pada pemahaman bermakna, nalar kritis, dan koneksi dunia nyata.'}
                        </p>
                      </div>
                    </div>

                    {/* Official Signatures Box for Print / Official Export */}
                    <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-700 print:grid">
                      <div>
                        <p className="text-slate-500">Guru yang Didampingi,</p>
                        <div className="h-16"></div>
                        <p className="font-bold underline">{teacherName}</p>
                        <p className="text-[11px] text-slate-400">NIP. ............................</p>
                      </div>
                      <div>
                        <p className="text-slate-500">{supervisorRole},</p>
                        <div className="h-16"></div>
                        <p className="font-bold underline">{supervisorName}</p>
                        <p className="text-[11px] text-slate-400">NIP. ............................</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Initial Empty State when no analysis done yet */}
              {!loading && !analysisResult && (
                <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-sm text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-900">
                      Siap Menganalisis Refleksi Guru
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Lengkapi data refleksi guru di formulir sebelah kiri atau pilih salah satu studi kasus riil yang tersedia untuk menguji sistem asisten pendampingan.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSubmitAnalysis()}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Analisis Contoh yang Ada</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Bank Studi Kasus Riil */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-slate-900">
                Bank Studi Kasus &amp; Refleksi Riil Guru di Sekolah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Koleksi refleksi nyata yang sering dihadapi guru di Indonesia. Pilih salah satu kasus untuk langsung dimuat ke formulir analisis pendampingan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRESET_CASES.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {preset.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{preset.schoolLevel}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {preset.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">{preset.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                      <div>
                        <span className="text-slate-400 font-medium">Guru: </span>
                        <span className="font-semibold">{preset.teacherName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Mapel & Topik: </span>
                        <span>
                          {preset.subject} &bull; {preset.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Fokus: {preset.spmFocus.slice(0, 1).join(', ')}
                    </div>
                    <button
                      onClick={() => handleApplyPreset(preset)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Gunakan Kasus Ini</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Riwayat Dokumen Supervisi */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Riwayat Dokumen Pendampingan Supervisi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arsip catatan supervisi yang telah dianalisis dan disimpan di peramban ini.
                </p>
              </div>

              {savedSessions.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Hapus seluruh riwayat supervisi yang tersimpan?')) {
                      saveHistoryToStorage([]);
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Semua Riwayat</span>
                </button>
              )}
            </div>

            {savedSessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">Belum Ada Dokumen Tersimpan</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Setelah melakukan analisis refleksi guru, klik tombol &quot;Simpan&quot; di pojok atas hasil draf untuk mengarsipkannya di sini.
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg"
                >
                  Mulai Analisis Refleksi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {session.subject} &bull; {session.schoolLevel}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {session.teacherName}
                        </h4>
                        <p className="text-xs text-slate-500">{session.topic}</p>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(session.timestamp).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-700 italic line-clamp-2">
                      &ldquo;{session.analysis.apresiasiValidasi}&rdquo;
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleDeleteHistory(session.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                      <button
                        onClick={() => handleLoadSession(session)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <span>Buka Lembar Dokumen</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Panduan Pilar Pendampingan & SPM */}
        {activeTab === 'guide' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Panduan Kerangka Kerja Supervisi Edukatif
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Landasan konseptual pendampingan berbasis Pembelajaran Mendalam (Deep Learning) dan Standar Pelayanan Minimal (SPM) Pendidikan.
              </p>
            </div>

            {/* 4 Pilar Pembelajaran Mendalam */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  4 Pilar Pembelajaran Mendalam (Deep Learning)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEEP_LEARNING_PILLARS.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indikator SPM Rapor Pendidikan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Indikator Prioritas Standar Pelayanan Minimal (SPM)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SPM_INDICATORS.map((ind) => (
                  <div
                    key={ind.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5"
                  >
                    <div className="text-xs font-bold text-emerald-700">{ind.name}</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ind.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alur Supervisi Klinis 3 Tahap */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Siklus Pendampingan Akademik Berkelanjutan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-bold text-emerald-400 mb-1">Tahap 1: Pra-Observasi</div>
                  <p className="text-xs text-slate-300">
                    Menyepakati fokus pengembangan bersama guru, memetakan indikator SPM yang ingin diperkuat, dan membangun rasa saling percaya tanpa kesan mengadili.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-bold text-teal-400 mb-1">Tahap 2: Observasi Kelas</div>
                  <p className="text-xs text-slate-300">
                    Mengamati interaksi murid, keaktifan nalar kritis, keterlibatan inklusif, dan iklim keamanan psikologis di kelas tanpa menginterupsi proses ajar.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs font-bold text-cyan-400 mb-1">Tahap 3: Pasca-Observasi</div>
                  <p className="text-xs text-slate-300">
                    Sesi coaching reflektif: diawali apresiasi validasi, identifikasi akar masalah bersama guru, dan merumuskan langkah praktis untuk sesi selanjutnya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Asisten AI Pendampingan Edukatif &bull; Pengawas &amp; Kepala Sekolah</span>
          </div>
          <div>
            Didukung oleh Google Gemini 3.8 Flash &bull; Selaras dengan Kebijakan Kemendikbudristek RI
          </div>
        </div>
      </footer>
    </div>
  );
}
