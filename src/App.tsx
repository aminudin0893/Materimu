import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Sparkles, Loader2, Copy, Check, AlertCircle, 
  ChevronDown, Settings2, Download, Layers, FileText, User, Users, ListChecks, Eye, EyeOff, Clipboard, Image as ImageIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DAFTAR_MAPEL, initialData } from './constants';
import { ModulContent } from './components/ModulContent';

export default function App() {
  const [subject, setSubject] = useState('Pendidikan Agama Islam');
  const [topic, setTopic] = useState('Puasa Ramadhan');
  
  // State Metadata
  const [alokasiWaktu, setAlokasiWaktu] = useState('3 JP x 40 Menit');
  const [kelas, setKelas] = useState('Fase D - Kelas VII');
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState('2024/2025');
  const [namaPenyusun, setNamaPenyusun] = useState('Aminudin, S.Pd.');
  
  const [showAdvanced, setShowAdvanced] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isJpgLoading, setIsJpgLoading] = useState(false);
  const [isExportingMode, setIsExportingMode] = useState(false);
  
  // State View Mode dan Export Target
  const [viewMode, setViewMode] = useState('all'); 
  const [exportTarget, setExportTarget] = useState('all'); 
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [showJpgMenu, setShowJpgMenu] = useState(false);
  
  const [result, setResult] = useState<any>(initialData);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [expandedSubtopics, setExpandedSubtopics] = useState<number[]>([]); 
  const [expandAll, setExpandAll] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const jpgMenuRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setCustomApiKey(savedKey);
    
    const savedMetadata = localStorage.getItem('modul_metadata');
    if (savedMetadata) {
      try {
        const m = JSON.parse(savedMetadata);
        if (m.namaPenyusun) setNamaPenyusun(m.namaPenyusun);
        if (m.kelas) setKelas(m.kelas);
        if (m.semester) setSemester(m.semester);
        if (m.tahunAjaran) setTahunAjaran(m.tahunAjaran);
        if (m.alokasiWaktu) setAlokasiWaktu(m.alokasiWaktu);
        if (m.subject) setSubject(m.subject);
      } catch (e) {}
    }

    const savedResult = localStorage.getItem('last_generated_modul');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        if (parsed && parsed.judulMateri) {
          setResult(parsed);
        }
      } catch (e) {
        console.error("Failed to load saved result", e);
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (customApiKey) {
      localStorage.setItem('gemini_api_key', customApiKey);
    }
  }, [customApiKey]);

  useEffect(() => {
    const metadata = { namaPenyusun, kelas, semester, tahunAjaran, alokasiWaktu, subject };
    localStorage.setItem('modul_metadata', JSON.stringify(metadata));
  }, [namaPenyusun, kelas, semester, tahunAjaran, alokasiWaktu, subject]);

  useEffect(() => {
    if (result && result !== initialData) {
      localStorage.setItem('last_generated_modul', JSON.stringify(result));
    }
  }, [result]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    const scriptCanvas = document.createElement('script');
    scriptCanvas.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    scriptCanvas.async = true;
    document.body.appendChild(scriptCanvas);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPdfMenu(false);
      }
      if (jpgMenuRef.current && !jpgMenuRef.current.contains(event.target as Node)) {
        setShowJpgMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => { 
      if (document.body.contains(script)) document.body.removeChild(script); 
      if (document.body.contains(scriptCanvas)) document.body.removeChild(scriptCanvas);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) { setError('Silakan masukkan judul materi.'); return; }

    setIsLoading(true); setError(''); setCopied(false); 
    setExpandedSubtopics([]); setExpandAll(false); setShowPdfMenu(false); setShowJpgMenu(false); setViewMode('all');

    const apiKey = customApiKey || process.env.GEMINI_API_KEY!;
    if (!apiKey) {
      setError('API Key Gemini tidak ditemukan. Silakan masukkan API Key Anda.');
      setIsLoading(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    const ismubaSubjects = ['Kemuhammadiyahan', 'Al-Islam', 'Bahasa Arab'];
    const instruksiPendekatan = ismubaSubjects.includes(subject)
      ? "3. Wajib ada penjabaran 'Pendekatan Kurikulum ISMUBA' (Integrasi Al-Islam, Kemuhammadiyahan, dan Bahasa Arab) pada bagian pendekatanKhusus."
      : "3. Wajib ada penjabaran 'Kurikulum Berbasis Cinta' (Welas Asih/Kasih Sayang) pada bagian pendekatanKhusus.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Buatkan Modul Ajar/RPP ${subject} SANGAT LENGKAP untuk materi: "${topic}" bagi peserta didik tingkat ${kelas}. Total Alokasi Waktu adalah: ${alokasiWaktu}. Bagi alokasi waktu tersebut secara logis pada bagian atpTabel.`,
        config: {
          systemInstruction: `Kamu adalah Guru Ahli pembuat Modul Ajar Kurikulum Merdeka untuk mata pelajaran ${subject}. ATURAN WAJIB: 1. Gunakan bahasa Indonesia baku (EYD/PUEBI). 2. Jika penjelasan panjang, WAJIB pecah jadi beberapa paragraf (\\n\\n). ${instruksiPendekatan} 4. 3-4 TP. 5. Buat atpTabel yang memuat (tahap, kegiatan, durasi) dan pastikan durasi total sesuai. 6. Buat 2 Pertanyaan Pemantik, masing-masing lengkapi dengan 2 contoh jawaban alternatif dari siswa dan penjelasan/penguatan dari guru. 7. Pengertian min 2 paragraf. 8. Minimal 1 Dalil. 9. Sub-topik min 3. 10. LKPD. 11. Tugas Individu & Kelompok. 12. 5 Soal PG + Kunci. 13. Instrumen Penilaian rinci.`,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          responseSchema: {
            type: "object",
            properties: {
              judulMateri: { type: "string" },
              modelPembelajaran: { type: "string" },
              pendekatanKhusus: { type: "string" },
              tp: { type: "array", items: { type: "string" } },
              atpTabel: { 
                type: "array", 
                items: { 
                  type: "object", 
                  properties: { 
                    tahap: { type: "string" }, 
                    kegiatan: { type: "string" }, 
                    durasi: { type: "string" } 
                  } 
                } 
              },
              pertanyaanPemantik: { 
                type: "array", 
                items: { 
                  type: "object", 
                  properties: { 
                    pertanyaan: { type: "string" }, 
                    jawabanAlternatif1: { type: "string" }, 
                    jawabanAlternatif2: { type: "string" },
                    penjelasanGuru: { type: "string" }
                  } 
                } 
              },
              pengertian: { type: "string" },
              dalil: { type: "array", items: { type: "object", properties: { sumber: { type: "string" }, teksArab: { type: "string" }, terjemahan: { type: "string" } } } },
              subTopik: { type: "array", items: { type: "object", properties: { judulSub: { type: "string" }, penjelasan: { type: "string" } } } },
              lkpd: { type: "object", properties: { judul: { type: "string" }, tujuan: { type: "string" }, langkahKerja: { type: "array", items: { type: "string" } } } },
              tugasIndividu: { type: "object", properties: { judul: { type: "string" }, instruksi: { type: "string" } } },
              tugasKelompok: { type: "object", properties: { judul: { type: "string" }, instruksi: { type: "string" } } },
              pilihanGanda: { type: "array", items: { type: "object", properties: { soal: { type: "string" }, opsiA: { type: "string" }, opsiB: { type: "string" }, opsiC: { type: "string" }, opsiD: { type: "string" }, opsiE: { type: "string" }, kunci: { type: "string" } } } },
              instrumenPenilaian: { type: "object", properties: { sikap: { type: "array", items: { type: "string" } }, pengetahuan: { type: "string" }, keterampilan: { type: "array", items: { type: "string" } } } }
            },
            required: ["judulMateri", "modelPembelajaran", "pendekatanKhusus", "tp", "atpTabel", "pertanyaanPemantik", "pengertian", "dalil", "subTopik", "lkpd", "tugasIndividu", "tugasKelompok", "pilihanGanda", "instrumenPenilaian"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        let cleanJson = responseText.trim();
        // Bersihkan jika ada pembungkus markdown ```json ... ```
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        
        try {
          const parsedResult = JSON.parse(cleanJson);
          parsedResult.generatedSubject = subject; 
          setResult(parsedResult);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Gagal memproses data modul. AI memberikan format yang tidak lengkap. Silakan coba lagi dengan topik yang lebih spesifik.');
        }
      } else {
        throw new Error('Respons tidak valid dari AI.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyusun materi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = (target: string) => {
    if (!result) return;
    const html2pdf = (window as any).html2pdf;
    if (typeof html2pdf === 'undefined') {
      setError("Library PDF sedang dimuat, mohon tunggu sebentar.");
      return;
    }

    setShowPdfMenu(false);
    setShowJpgMenu(false);
    setIsPdfLoading(true);
    setExportTarget(target);
    if (target === 'all') setExpandAll(true); 
    setIsExportingMode(true); 

    setTimeout(() => {
      const element = document.getElementById('modul-ajar-content');
      let prefix = "Modul_Ajar";
      if (target === 'lkpd') prefix = "LKPD";
      if (target === 'penugasan_individu') prefix = "Tugas_Individu";
      if (target === 'penugasan_kelompok') prefix = "Tugas_Kelompok";
      if (target.startsWith('evaluasi')) prefix = "Soal_Evaluasi";

      const subjectSafeName = (result.generatedSubject || subject).replace(/\s+/g, '_');
      const opt = {
        margin: [15, 5, 15, 5], 
        filename: `${prefix}_${subjectSafeName}_${result.judulMateri.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] } 
      };

      html2pdf().set(opt).from(element).save()
        .then(() => {
          setIsPdfLoading(false);
          setExpandAll(false);
          setIsExportingMode(false);
          setExportTarget('all');
        })
        .catch((err: any) => {
          console.error("Error creating PDF", err);
          setError("Gagal membuat PDF.");
          setIsPdfLoading(false);
          setExpandAll(false);
          setIsExportingMode(false);
          setExportTarget('all');
        });
    }, 1000); 
  };

  const handleExportJPG = (target: string) => {
    if (!result) return;
    const html2canvas = (window as any).html2canvas;
    if (typeof html2canvas === 'undefined') {
      setError("Library Gambar sedang dimuat, mohon tunggu sebentar.");
      return;
    }

    setShowPdfMenu(false);
    setShowJpgMenu(false);
    setIsJpgLoading(true);
    setExportTarget(target);
    if (target === 'all') setExpandAll(true); 
    setIsExportingMode(true); 

    setTimeout(() => {
      const element = document.getElementById('modul-ajar-content')!;
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      const originalPadding = element.style.padding;
      
      element.style.width = '800px';
      element.style.maxWidth = '800px';
      element.style.padding = '30px 40px'; 
      
      let prefix = "Modul_Ajar";
      if (target === 'lkpd') prefix = "LKPD";
      if (target === 'penugasan_individu') prefix = "Tugas_Individu";
      if (target === 'penugasan_kelompok') prefix = "Tugas_Kelompok";
      if (target.startsWith('evaluasi')) prefix = "Soal_Evaluasi";

      const subjectSafeName = (result.generatedSubject || subject).replace(/\s+/g, '_');

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        windowWidth: 900 
      }).then((canvas: HTMLCanvasElement) => {
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
        element.style.padding = originalPadding;

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.download = `${prefix}_${subjectSafeName}_${result.judulMateri.replace(/\s+/g, '_')}.jpg`;
        link.href = imgData;
        link.click();

        setIsJpgLoading(false);
        setExpandAll(false);
        setIsExportingMode(false);
        setExportTarget('all');
      }).catch((err: any) => {
        console.error("Error creating JPG", err);
        setError("Gagal membuat JPG.");
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
        element.style.padding = originalPadding;
        setIsJpgLoading(false);
        setExpandAll(false);
        setIsExportingMode(false);
        setExportTarget('all');
      });
    }, 1000);
  };

  const handleCopy = () => {
    if (!result) return;
    const currentSubject = result.generatedSubject || subject;
    let textToCopy = `MODUL AJAR ${currentSubject.toUpperCase()}\nMATERI: ${result.judulMateri.toUpperCase()}\nPenyusun: ${namaPenyusun} | Fase/Kelas: ${kelas} | Semester: ${semester} | Tahun Ajaran: ${tahunAjaran} | Waktu: ${alokasiWaktu}\n\n`;
    textToCopy += `A. MODEL PEMBELAJARAN\n${result.modelPembelajaran}\n\n`;
    textToCopy += `B. PENDEKATAN\n${result.pendekatanKhusus}\n\n`;
    textToCopy += `C. TUJUAN PEMBELAJARAN (TP)\n`;
    result.tp?.forEach((item: string, i: number) => textToCopy += `${i + 1}. ${item}\n`);
    textToCopy += `\n`;
    textToCopy += `D. ALUR TUJUAN PEMBELAJARAN (ATP)\n`;
    result.atpTabel?.forEach((row: any) => { textToCopy += `[${row.tahap} - ${row.durasi}]\n${row.kegiatan}\n\n`; });
    textToCopy += `E. PERTANYAAN PEMANTIK\n`;
    result.pertanyaanPemantik?.forEach((p: any, i: number) => {
      textToCopy += `${i + 1}. T: ${p.pertanyaan}\n`;
      textToCopy += `   - Alternatif Jawaban Siswa 1: "${p.jawabanAlternatif1}"\n`;
      if(p.jawabanAlternatif2) textToCopy += `   - Alternatif Jawaban Siswa 2: "${p.jawabanAlternatif2}"\n`;
      textToCopy += `   - Penjelasan Guru: ${p.penjelasanGuru}\n`;
    });
    textToCopy += `\nF. MATERI PEMBELAJARAN\n1. Pengertian\n${result.pengertian}\n\n`;
    if (result.dalil?.length) {
      textToCopy += `2. Dalil Naqli\n`;
      result.dalil.forEach((d: any) => { textToCopy += `Sumber: ${d.sumber}\n`; if(d.teksArab) textToCopy += `${d.teksArab}\n`; textToCopy += `Arti: "${d.terjemahan}"\n\n`; });
    }
    if (result.subTopik?.length) {
      textToCopy += `3. Rincian Materi\n`;
      result.subTopik.forEach((sub: any, i: number) => textToCopy += `   3.${i + 1}. ${sub.judulSub}\n   ${sub.penjelasan}\n\n`);
    }
    if (result.lkpd) {
      textToCopy += `G. LEMBAR KERJA PESERTA DIDIK (LKPD)\nJudul: ${result.lkpd.judul}\nTujuan: ${result.lkpd.tujuan}\nLangkah Kerja:\n`;
      result.lkpd.langkahKerja?.forEach((l: string, i: number) => textToCopy += `${i + 1}. ${l}\n`);
      textToCopy += `\n`;
    }
    textToCopy += `H. PENUGASAN\n`;
    if (result.tugasIndividu) textToCopy += `1. Tugas Individu\n   - Judul: ${result.tugasIndividu.judul}\n   - Instruksi: ${result.tugasIndividu.instruksi}\n`;
    if (result.tugasKelompok) textToCopy += `2. Tugas Kelompok\n   - Judul: ${result.tugasKelompok.judul}\n   - Instruksi: ${result.tugasKelompok.instruksi}\n\n`;
    if (result.pilihanGanda?.length) {
      textToCopy += `I. EVALUASI FORMATIF (Pilihan Ganda)\n`;
      result.pilihanGanda.forEach((pg: any, i: number) => {
        textToCopy += `${i + 1}. ${pg.soal}\n   A. ${pg.opsiA}\n   B. ${pg.opsiB}\n   C. ${pg.opsiC}\n   D. ${pg.opsiD}\n   E. ${pg.opsiE}\n   Kunci: ${pg.kunci}\n\n`;
      });
    }
    if (result.instrumenPenilaian) {
      textToCopy += `J. INSTRUMEN PENILAIAN\n1. Penilaian Sikap:\n`;
      result.instrumenPenilaian.sikap?.forEach((s: string) => textToCopy += `   - ${s}\n`);
      textToCopy += `2. Penilaian Pengetahuan: ${result.instrumenPenilaian.pengetahuan}\n3. Penilaian Keterampilan:\n`;
      result.instrumenPenilaian.keterampilan?.forEach((k: string) => textToCopy += `   - ${k}\n`);
    }

    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error('Gagal menyalin', err); }
    document.body.removeChild(textArea);
  };

  const toggleAccordion = (index: number) => {
    setExpandedSubtopics(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      return [...prev, index];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {!isExportingMode && (
          <header className="text-center pt-6 pb-2">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white rounded-xl mb-4 shadow-sm">
              <BookOpen size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">WAKA AIK SMPMUSAPRO</h1>
            <p className="text-emerald-600 font-semibold text-sm md:text-base mt-1">oleh: Aminudin, S.Pd.</p>
            <p className="text-slate-500 mt-2 text-sm md:text-base max-w-xl mx-auto">Aplikasi penyusun Modul Ajar Terstruktur</p>
          </header>
        )}

        {!isExportingMode && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative md:w-1/3 shrink-0">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base font-semibold text-slate-700 appearance-none pr-10 cursor-pointer"
                    disabled={isLoading || isPdfLoading || isJpgLoading}
                  >
                    {DAFTAR_MAPEL.map((mapel) => (<option key={mapel} value={mapel}>{mapel}</option>))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><ChevronDown size={18} /></div>
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Masukkan Topik Materi (cth: Sejarah Nabi, Persamaan Linear...)"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base font-semibold"
                  disabled={isLoading || isPdfLoading || isJpgLoading}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Custom Gemini API Key (Opsional)</label>
                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Masukkan API Key Anda..."
                      className="w-full pl-3 pr-16 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      disabled={isLoading || isPdfLoading || isJpgLoading}
                    />
                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setCustomApiKey(text);
                          } catch (err) {
                            console.error('Gagal menempel teks', err);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Tempel dari clipboard"
                      >
                        <Clipboard size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                        title={showApiKey ? "Sembunyikan" : "Tampilkan"}
                      >
                        {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-end pb-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
                  >
                    <Settings2 size={16} /> 
                    {showAdvanced ? 'Tutup Pengaturan' : 'Pengaturan Identitas'}
                    <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {showAdvanced && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Penyusun</label><input type="text" value={namaPenyusun} onChange={e=>setNamaPenyusun(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fase / Kelas</label><select value={kelas} onChange={e=>setKelas(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"><option value="Fase A - Kelas I/II">Fase A - Kelas I/II</option><option value="Fase B - Kelas III/IV">Fase B - Kelas III/IV</option><option value="Fase C - Kelas V/VI">Fase C - Kelas V/VI</option><option value="Fase D - Kelas VII">Fase D - Kelas VII</option><option value="Fase D - Kelas VIII">Fase D - Kelas VIII</option><option value="Fase D - Kelas IX">Fase D - Kelas IX</option><option value="Fase E - Kelas X">Fase E - Kelas X</option><option value="Fase F - Kelas XI/XII">Fase F - Kelas XI/XII</option></select></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label><select value={semester} onChange={e=>setSemester(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"><option value="Ganjil">Ganjil</option><option value="Genap">Genap</option></select></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tahun Ajaran</label><input type="text" value={tahunAjaran} onChange={e=>setTahunAjaran(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alokasi Waktu</label><input type="text" value={alokasiWaktu} onChange={e=>setAlokasiWaktu(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" /></div>
                  </div>
                )}

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || isPdfLoading || isJpgLoading || !topic.trim()}
                  className="w-full md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {isLoading ? (<><Loader2 className="animate-spin" size={18} /> Menyusun Dokumen...</>) : (<><Sparkles size={18} /> Buat Modul Ajar</>)}
                </button>
              </div>
            </form>
            {error && (<div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100 text-sm"><AlertCircle size={16} /> <p>{error}</p></div>)}
          </section>
        )}

        {result && !isExportingMode && (
          <section className="space-y-4">
            <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-200/70 rounded-xl shadow-inner">
              {[
                { id: 'all', label: 'Semua Modul', icon: <Layers size={16} /> },
                { id: 'lkpd', label: 'Lembar LKPD', icon: <FileText size={16} /> },
                { id: 'penugasan_individu', label: 'Tugas Individu', icon: <User size={16} /> },
                { id: 'penugasan_kelompok', label: 'Tugas Kelompok', icon: <Users size={16} /> },
                { id: 'evaluasi_tanpa_kunci', label: 'Soal (Siswa)', icon: <ListChecks size={16} /> },
                { id: 'evaluasi_dengan_kunci', label: 'Soal (Guru)', icon: <Check size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center justify-center gap-2 flex-1 min-w-[150px] py-2.5 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center px-1 pb-2 gap-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Eye size={20} className="text-emerald-600" /> Tinjauan</h2>
              <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto relative">
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowPdfMenu(!showPdfMenu)} disabled={isPdfLoading || isJpgLoading} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-sm">
                    {isPdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} PDF <ChevronDown size={14} />
                  </button>
                  {showPdfMenu && (
                    <div className="absolute right-0 md:right-auto md:left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
                      <button onClick={() => handleExportPDF('all')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Modul Ajar Lengkap</button>
                      <button onClick={() => handleExportPDF('lkpd')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Lembar LKPD</button>
                      <button onClick={() => handleExportPDF('penugasan_individu')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Tugas Individu</button>
                      <button onClick={() => handleExportPDF('penugasan_kelompok')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Tugas Kelompok</button>
                      <button onClick={() => handleExportPDF('evaluasi_tanpa_kunci')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Soal (Siswa)</button>
                      <button onClick={() => handleExportPDF('evaluasi_dengan_kunci')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold">Soal (Guru)</button>
                    </div>
                  )}
                </div>
                <div className="relative" ref={jpgMenuRef}>
                  <button onClick={() => setShowJpgMenu(!showJpgMenu)} disabled={isPdfLoading || isJpgLoading} className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold text-sm">
                    {isJpgLoading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} JPG <ChevronDown size={14} />
                  </button>
                  {showJpgMenu && (
                    <div className="absolute right-0 md:right-auto md:left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
                      <button onClick={() => handleExportJPG('all')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Modul Ajar Lengkap</button>
                      <button onClick={() => handleExportJPG('lkpd')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold border-b">Lembar LKPD</button>
                      <button onClick={() => handleExportJPG('evaluasi_tanpa_kunci')} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-semibold">Soal (Siswa)</button>
                    </div>
                  )}
                </div>
                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-sm">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Tersalin!' : 'Salin Teks'}
                </button>
              </div>
            </div>
          </section>
        )}

        {result && (
          <ModulContent 
            result={result}
            subject={subject}
            kelas={kelas}
            semester={semester}
            tahunAjaran={tahunAjaran}
            namaPenyusun={namaPenyusun}
            alokasiWaktu={alokasiWaktu}
            isExportingMode={isExportingMode}
            displayTarget={isExportingMode ? exportTarget : viewMode}
            expandedSubtopics={expandedSubtopics}
            expandAll={expandAll}
            toggleAccordion={toggleAccordion}
          />
        )}
      </div>
    </div>
  );
}
