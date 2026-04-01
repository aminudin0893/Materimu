import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Sparkles, Loader2, Copy, Check, AlertCircle, 
  ChevronDown, Settings2, Download, Layers, FileText, User, Users, ListChecks, Eye, EyeOff, Clipboard, Image as ImageIcon, RotateCw, Share2, Grid, Maximize2, Minimize2, Presentation, Printer, Lock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DAFTAR_MAPEL, initialData } from './constants';
import { ModulContent } from './components/ModulContent';
import { MindMap } from './components/MindMap';
import { PresentationView } from './components/PresentationView';

export default function App() {
  const [subject, setSubject] = useState('Pendidikan Agama Islam');
  const [topic, setTopic] = useState('Puasa Ramadhan');
  
  // State Metadata
  const [alokasiWaktu, setAlokasiWaktu] = useState('3 JP x 40 Menit');
  const [kelas, setKelas] = useState('Fase D - Kelas VII');
  const [semester, setSemester] = useState('Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState('2024/2025');
  const [namaPenyusun, setNamaPenyusun] = useState('Aminudin, S.Pd.');
  const [logo, setLogo] = useState<string | null>(null);
  
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'jpg'>('pdf');
  
  const [result, setResult] = useState<any>(initialData);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [expandedSubtopics, setExpandedSubtopics] = useState<number[]>([]); 
  const [expandAll, setExpandAll] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [ttsTopic, setTtsTopic] = useState('');
  const [ttsNumQuestions, setTtsNumQuestions] = useState(10);
  const [ttsMode, setTtsMode] = useState<'guru' | 'siswa'>('siswa');
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [requestHistory, setRequestHistory] = useState<number[]>([]);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);
  const jpgMenuRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "Menganalisis kurikulum terbaru...",
    "Menyusun tujuan pembelajaran (TP)...",
    "Merancang alur pembelajaran (ATP)...",
    "Membangun pertanyaan pemantik...",
    "Menyusun materi inti & dalil...",
    "Membuat Lembar Kerja (LKPD)...",
    "Menyusun instrumen penilaian...",
    "Membangun Teka-Teki Silang...",
    "Menyusun soal evaluasi formatif...",
    "Hampir selesai, sedang merapikan format..."
  ];

  // Helper to fix truncated JSON from AI
  const fixTruncatedJson = (json: string): string => {
    try {
      JSON.parse(json);
      return json;
    } catch (e) {
      let stack: string[] = [];
      let inString = false;
      let escaped = false;
      let lastValidIndex = 0;

      for (let i = 0; i < json.length; i++) {
        const char = json[i];
        if (escaped) { escaped = false; continue; }
        if (char === '\\') { escaped = true; continue; }
        if (char === '"') { inString = !inString; continue; }
        if (inString) continue;

        if (char === '{') { stack.push('}'); lastValidIndex = i; }
        else if (char === '[') { stack.push(']'); lastValidIndex = i; }
        else if (char === '}' || char === ']') {
          if (stack.length > 0 && stack[stack.length - 1] === char) {
            stack.pop();
            lastValidIndex = i;
          }
        }
      }

      let fixedJson = json.trim();
      
      // Remove trailing comma or colon if present at the end of truncated string
      if (fixedJson.endsWith(',') || fixedJson.endsWith(':')) {
        fixedJson = fixedJson.slice(0, -1).trim();
      }
      
      if (inString) fixedJson += '"';
      while (stack.length > 0) {
        fixedJson += stack.pop();
      }
      
      try {
        JSON.parse(fixedJson);
        return fixedJson;
      } catch (e2) {
        // If still failing, try to find the last complete object/array by backtracking
        for (let i = json.length - 1; i >= 0; i--) {
          if (json[i] === '}' || json[i] === ']') {
            try {
              const sub = json.substring(0, i + 1);
              JSON.parse(sub);
              return sub;
            } catch (e) {}
          }
        }
        return json; // Return original if all else fails
      }
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('is_logged_in');
    if (savedLogin === 'true') setIsLoggedIn(true);

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
        if (m.numQuestions) setNumQuestions(m.numQuestions);
        if (m.logo) setLogo(m.logo);
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
    const metadata = { namaPenyusun, kelas, semester, tahunAjaran, alokasiWaktu, subject, numQuestions, logo };
    localStorage.setItem('modul_metadata', JSON.stringify(metadata));
  }, [namaPenyusun, kelas, semester, tahunAjaran, alokasiWaktu, subject, numQuestions, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (result && result !== initialData) {
      localStorage.setItem('last_generated_modul', JSON.stringify(result));
    }
  }, [result]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Amin0893&#') {
      setIsLoggedIn(true);
      localStorage.setItem('is_logged_in', 'true');
      setLoginError('');
    } else {
      setLoginError('Email salah. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('is_logged_in');
    setPasswordInput('');
  };

  useEffect(() => {
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
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    if (requestHistory.length > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const filtered = requestHistory.filter(t => t > oneMinuteAgo);
        if (filtered.length !== requestHistory.length) {
          setRequestHistory(filtered);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [requestHistory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const resetAllStates = () => {
    setResult(null);
    setTopic("");
    setError("");
    localStorage.removeItem('last_generated_modul');
  };

  const handleCopyAll = () => {
    handleCopy();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link aplikasi telah disalin ke clipboard!");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) { setError('Silakan masukkan judul materi.'); return; }

    setIsLoading(true); setError(''); setCopied(false); 
    setExpandedSubtopics([]); setExpandAll(false); setShowPdfMenu(false); setShowJpgMenu(false); setViewMode('all');

    const apiKey = customApiKey || process.env.GEMINI_API_KEY!;
    if (!apiKey) {
      setError('Kode tidak ditemukan. Silakan masukkan kode Anda.');
      setIsLoading(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    // Update request history
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const currentRPM = requestHistory.filter(t => t > oneMinuteAgo).length;

    if (currentRPM >= 15) {
      setError('Batas kuota gratis (15 RPM) tercapai. Silakan tunggu beberapa saat sebelum membuat modul lagi.');
      setIsLoading(false);
      return;
    }

    const updatedHistory = [...requestHistory.filter(t => t > oneMinuteAgo), now];
    setRequestHistory(updatedHistory);

    const ismubaSubjects = ['Kemuhammadiyahan', 'Al-Islam', 'Bahasa Arab'];
    const instruksiPendekatan = ismubaSubjects.includes(subject)
      ? "3. Wajib ada penjabaran 'Pendekatan Kurikulum ISMUBA' (Integrasi Al-Islam, Kemuhammadiyahan, dan Bahasa Arab) pada bagian pendekatanKhusus."
      : "3. Wajib ada penjabaran 'Kurikulum Berbasis Cinta' (Welas Asih/Kasih Sayang) pada bagian pendekatanKhusus.";

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Buatkan Modul Ajar/RPP ${subject} yang LENGKAP DAN KOMPREHENSIF untuk materi: "${topic}" bagi peserta didik tingkat ${kelas}. Total Alokasi Waktu adalah: ${alokasiWaktu}. Bagi alokasi waktu tersebut secara logis pada bagian atpTabel.`,
        config: {
          systemInstruction: `Kamu adalah Guru Ahli pembuat Modul Ajar Kurikulum Merdeka untuk mata pelajaran ${subject}. 
          ATURAN WAJIB: 
          1. Gunakan bahasa Indonesia baku (EYD/PUEBI). 
          2. Jika penjelasan panjang, WAJIB pecah jadi beberapa paragraf (\\n\\n). 
          ${instruksiPendekatan} 
          4. 3-4 TP. 
          5. Buat atpTabel yang memuat (tahap, kegiatan, durasi). WAJIB mencakup 3 tahap utama: Pendahuluan, Kegiatan Inti (sesuai sintaks model pembelajaran yang dipilih), dan Penutup. PENTING: Kolom 'kegiatan' (Deskripsi Kegiatan Guru & Siswa) dan 'durasi' HARUS TERISI LENGKAP, JANGAN DIBIARKAN KOSONG. Pada bagian 'kegiatan', jelaskan interaksi Guru & Siswa secara sangat rinci, langkah-demi-langkah, sistematis, dan profesional (gunakan poin-poin penomoran). Pastikan durasi total sesuai alokasi waktu. 
          6. Buat 2 Pertanyaan Pemantik, masing-masing lengkapi dengan 2 contoh jawaban alternatif dari siswa dan penjelasan/penguatan dari guru. 
          7. Pengertian min 2 paragraf. 
          8. Minimal 1 Dalil. 
          9. Sub-topik min 3. 
          10. LKPD. 
          11. Tugas Individu & Kelompok. 
          12. ${numQuestions} Soal PG + Kunci. 
          13. Teka-Teki Silang (TTS) HARUS berjumlah 10 pertanyaan (5 mendatar & 5 menurun) yang relevan dengan materi. PENTING: Usahakan jawaban Mendatar dan Menurun memiliki setidaknya satu huruf yang sama agar dapat saling bersilangan (intersect) dalam kotak TTS.
          14. Instrumen Penilaian rinci.
          15. Pada bagian 'modelPembelajaran', berikan rekomendasi model pembelajaran yang canggih, inovatif, dan profesional (seperti Project Based Learning, Problem Based Learning, Discovery Learning, Inquiry Learning, atau Flipped Classroom) yang paling relevan dengan materi. Struktur jawaban WAJIB: 
              - Nama Model Pembelajaran
              - Alasan Pemilihan (Mengapa model ini efektif untuk topik ini)
              - Sintaks/Langkah-langkah Inti Model tersebut.
          16. KELUARKAN HANYA JSON VALID. JANGAN ADA TEKS LAIN DI LUAR JSON. 
          PENTING: Pastikan seluruh konten lengkap namun tetap efisien dalam penggunaan kata agar tidak terputus di tengah jalan.`,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
          temperature: 0.7,
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
              subTopik: { 
                type: "array", 
                items: { 
                  type: "object", 
                  properties: { 
                    judulSub: { type: "string" }, 
                    penjelasan: { type: "string" },
                    subSubTopik: { 
                      type: "array", 
                      items: { 
                        type: "object", 
                        properties: { 
                          judul: { type: "string" }, 
                          deskripsi: { type: "string" } 
                        } 
                      } 
                    }
                  } 
                } 
              },
              lkpd: { type: "object", properties: { judul: { type: "string" }, tujuan: { type: "string" }, langkahKerja: { type: "array", items: { type: "string" } } } },
              tugasIndividu: { type: "object", properties: { judul: { type: "string" }, instruksi: { type: "string" } } },
              tugasKelompok: { type: "object", properties: { judul: { type: "string" }, instruksi: { type: "string" } } },
              pilihanGanda: { type: "array", items: { type: "object", properties: { soal: { type: "string" }, opsiA: { type: "string" }, opsiB: { type: "string" }, opsiC: { type: "string" }, opsiD: { type: "string" }, opsiE: { type: "string" }, kunci: { type: "string" } } } },
              tekaTekiSilang: {
                type: "object",
                properties: {
                  mendatar: { type: "array", items: { type: "object", properties: { nomor: { type: "integer" }, pertanyaan: { type: "string" }, jawaban: { type: "string" } } } },
                  menurun: { type: "array", items: { type: "object", properties: { nomor: { type: "integer" }, pertanyaan: { type: "string" }, jawaban: { type: "string" } } } }
                }
              },
              instrumenPenilaian: { type: "object", properties: { sikap: { type: "array", items: { type: "string" } }, pengetahuan: { type: "string" }, keterampilan: { type: "array", items: { type: "string" } } } }
            },
            required: ["judulMateri", "modelPembelajaran", "pendekatanKhusus", "tp", "atpTabel", "pertanyaanPemantik", "pengertian", "dalil", "subTopik", "lkpd", "tugasIndividu", "tugasKelompok", "pilihanGanda", "tekaTekiSilang", "instrumenPenilaian"]
          }
        }
      });

      const responseText = response.text;
      const finishReason = response.candidates?.[0]?.finishReason;
      if (finishReason === 'MAX_TOKENS') {
        console.warn("AI response was truncated due to max tokens.");
      }
      console.log("AI Response Raw:", responseText);
      
      if (responseText) {
        let cleanJson = "";
        
        // Robust JSON extraction: cari kurung kurawal pertama dan terakhir
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanJson = responseText.substring(firstBrace, lastBrace + 1);
        } else {
          cleanJson = responseText.trim();
        }
        
        // Bersihkan jika masih ada pembungkus markdown (fallback)
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        
        try {
          let parsedResult;
          try {
            parsedResult = JSON.parse(cleanJson);
          } catch (e) {
            console.warn("Initial JSON parse failed, attempting to fix truncated JSON...");
            const fixedJson = fixTruncatedJson(cleanJson);
            parsedResult = JSON.parse(fixedJson);
          }
          
          // Fallback for missing fields to ensure app doesn't crash
          if (!parsedResult.judulMateri) {
            parsedResult.judulMateri = topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          }
          if (!parsedResult.tp || !Array.isArray(parsedResult.tp)) parsedResult.tp = ["Tujuan pembelajaran sedang disusun..."];
          if (!parsedResult.atpTabel || !Array.isArray(parsedResult.atpTabel) || parsedResult.atpTabel.length === 0) {
            parsedResult.atpTabel = initialData.atpTabel;
          } else {
            // Pastikan setiap baris memiliki konten
            parsedResult.atpTabel = parsedResult.atpTabel.map((row: any) => ({
              tahap: row.tahap || "Tahap Pembelajaran",
              kegiatan: row.kegiatan && row.kegiatan.trim() !== "" ? row.kegiatan : "Deskripsi kegiatan sedang disusun oleh AI...",
              durasi: row.durasi && row.durasi.trim() !== "" ? row.durasi : "15 Menit"
            }));
          }
          if (!parsedResult.pengertian) parsedResult.pengertian = "Materi sedang dalam proses penyusunan...";
          if (!parsedResult.subTopik) parsedResult.subTopik = [];
          if (!parsedResult.pilihanGanda) parsedResult.pilihanGanda = [];
          if (!parsedResult.tekaTekiSilang) parsedResult.tekaTekiSilang = { mendatar: [], menurun: [] };

          parsedResult.generatedSubject = subject; 
          setResult(parsedResult);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Cleaned JSON that failed:', cleanJson);
          throw new Error('Gagal memproses data modul secara sempurna. AI memberikan format yang terputus. Silakan coba lagi atau gunakan topik yang lebih spesifik untuk hasil yang lebih lengkap.');
        }
      } else {
        throw new Error('Respons tidak valid dari AI.');
      }
    } catch (err: any) {
      console.error("Generate Error:", err);
      let errorMessage = err.message || 'Terjadi kesalahan saat menyusun materi.';
      
      // Handle Quota Exceeded (429)
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
        errorMessage = "Kuota API Gemini Anda telah habis atau terlalu banyak permintaan dalam waktu singkat. Silakan tunggu beberapa saat (1-2 menit) atau gunakan API Key lain di menu Pengaturan.";
      }
      
      // Handle Service Unavailable (503)
      if (errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('high demand')) {
        errorMessage = "Server Gemini sedang mengalami permintaan yang sangat tinggi (High Demand). Silakan tunggu 1-2 menit dan coba klik tombol Generate kembali.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTTS = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetTopic = ttsTopic || topic;
    if (!targetTopic.trim()) { setError('Silakan masukkan judul materi untuk TTS.'); return; }

    setIsTtsLoading(true); setError(''); 
    const apiKey = customApiKey || process.env.GEMINI_API_KEY!;
    if (!apiKey) {
      setError('API Key Gemini tidak ditemukan.');
      setIsTtsLoading(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Buatkan Teka-Teki Silang (TTS) untuk materi: "${targetTopic}" tingkat ${kelas}.`,
        config: {
          systemInstruction: `Kamu adalah Guru Ahli pembuat media pembelajaran. 
          Buatlah Teka-Teki Silang (TTS) yang relevan dengan materi "${targetTopic}".
          JUMLAH PERTANYAAN HARUS TEPAT ${ttsNumQuestions}. 
          Bagi menjadi Mendatar dan Menurun secara seimbang (misal: jika 10, maka 5 mendatar & 5 menurun).
          PENTING: Usahakan jawaban Mendatar dan Menurun memiliki setidaknya satu huruf yang sama agar dapat saling bersilangan (intersect) dalam kotak TTS.
          KELUARKAN HANYA JSON VALID.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              tekaTekiSilang: {
                type: "object",
                properties: {
                  mendatar: { type: "array", items: { type: "object", properties: { nomor: { type: "integer" }, pertanyaan: { type: "string" }, jawaban: { type: "string" } } } },
                  menurun: { type: "array", items: { type: "object", properties: { nomor: { type: "integer" }, pertanyaan: { type: "string" }, jawaban: { type: "string" } } } }
                }
              }
            },
            required: ["tekaTekiSilang"]
          }
        }
      });

      const parsed = JSON.parse(response.text);
      setResult((prev: any) => ({
        ...prev,
        tekaTekiSilang: parsed.tekaTekiSilang
      }));
    } catch (err: any) {
      console.error("TTS Error:", err);
      let errorMessage = err.message || 'Gagal menyusun Teka-teki Silang.';
      
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
        errorMessage = "Kuota API Gemini habis. Silakan tunggu 1-2 menit.";
      } else if (errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE') || errorMessage.includes('high demand')) {
        errorMessage = "Server Gemini sedang sibuk (High Demand). Silakan coba lagi dalam 1 menit.";
      }
      
      setError(errorMessage);
    } finally {
      setIsTtsLoading(false);
    }
  };

  const handlePrint = (target: string) => {
    if (!result) return;
    setExportTarget(target);
    if (target === 'all') setExpandAll(true);
    setIsExportingMode(true);
    setShowExportModal(false);

    // Wait for DOM to render expanded content
    setTimeout(() => {
      window.print();
      // Reset after print dialog closes
      setIsExportingMode(false);
      setExpandAll(false);
      setExportTarget('all');
    }, 1000);
  };

  const handleExportPDF = (target: string) => {
    if (!result) return;
    
    // Check if library is loaded
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      setError("Library PDF gagal dimuat. Silakan muat ulang halaman (Refresh).");
      return;
    }

    setShowExportModal(false);
    setIsPdfLoading(true);
    setExportTarget(target);
    if (target === 'all') setExpandAll(true); 
    setIsExportingMode(true); 

    // Safety timeout to prevent hanging (120 seconds for very large docs)
    const safetyTimeout = setTimeout(() => {
      setIsPdfLoading(false);
      setIsExportingMode(false);
      setExpandAll(false);
      setError("Proses penyimpanan memakan waktu terlalu lama. Dokumen mungkin terlalu besar untuk diproses secara otomatis. Silakan gunakan fitur 'Cetak Langsung (Print)' untuk hasil yang lebih stabil.");
    }, 120000);

    // Wait for DOM update to ensure everything is rendered
    setTimeout(() => {
      try {
        const targetId = target === 'mindmap' ? 'mindmap-content' : 'modul-ajar-content';
        const element = document.getElementById(targetId);
        if (!element) {
          throw new Error("Gagal menemukan konten untuk disimpan.");
        }

        // Force a specific width and ensure visibility for PDF generation
        const originalWidth = element.style.width;
        const originalMaxWidth = element.style.maxWidth;
        const originalOverflow = element.style.overflow;
        const originalPadding = element.style.padding;
        const originalBackground = element.style.background;
        
        element.style.width = '800px'; 
        element.style.maxWidth = '800px';
        element.style.overflow = 'visible';
        element.style.padding = '20px';
        element.style.background = '#ffffff';
        
        window.scrollTo(0, 0);

        let prefix = "Modul_Ajar";
        if (target === 'lkpd') prefix = "LKPD";
        if (target === 'penugasan_individu') prefix = "Tugas_Individu";
        if (target === 'penugasan_kelompok') prefix = "Tugas_Kelompok";
        if (target === 'tts') prefix = "TTS";
        if (target === 'mindmap') prefix = "MindMap";
        if (target.startsWith('evaluasi')) prefix = "Soal_Evaluasi";

        const subjectSafeName = (result.generatedSubject || subject).replace(/\s+/g, '_');
        const fileName = `${prefix}_${subjectSafeName}_${result.judulMateri.replace(/\s+/g, '_')}.pdf`;

        const elementHeight = element.scrollHeight;
        let dynamicScale = 1.5; 
        if (elementHeight > 5000) dynamicScale = 1.2;
        if (elementHeight > 10000) dynamicScale = 1.0;
        if (elementHeight > 15000) dynamicScale = 0.8;
        if (elementHeight > 20000) dynamicScale = 0.6;

        const opt = {
          margin: [10, 10, 10, 10], 
          filename: fileName,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: dynamicScale, 
            useCORS: true, 
            logging: false,
            backgroundColor: '#ffffff',
            removeContainer: true,
            imageTimeout: 0,
            allowTaint: true,
            onclone: (clonedDoc: Document) => {
              clonedDoc.body.style.background = 'white';
              const clonedTargetId = target === 'mindmap' ? 'mindmap-content' : 'modul-ajar-content';
              const clonedElement = clonedDoc.getElementById(clonedTargetId);
              if (clonedElement) {
                clonedElement.style.background = 'white';
                clonedElement.style.boxShadow = 'none';
                clonedElement.style.border = 'none';
                // Remove any elements that shouldn't be in the PDF
                const toRemove = clonedElement.querySelectorAll('.no-print, button, .export-exclude, .lucide-loader2');
                toRemove.forEach(el => el.remove());
                clonedElement.style.padding = '20px';
                clonedElement.style.width = '800px';
                clonedElement.style.maxWidth = '800px';
              }
            }
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
          pagebreak: { mode: ['css', 'legacy'], before: '.page-break' } 
        };

        // Execute html2pdf using the more robust .save() method
        html2pdf().set(opt).from(element).save().then(() => {
          clearTimeout(safetyTimeout);
          setIsPdfLoading(false);
          setExpandAll(false);
          setIsExportingMode(false);
          setExportTarget('all');
          // Reset styles
          element.style.width = originalWidth;
          element.style.maxWidth = originalMaxWidth;
          element.style.overflow = originalOverflow;
          element.style.padding = originalPadding;
          element.style.background = originalBackground;
        })
        .catch((err: any) => {
          clearTimeout(safetyTimeout);
          console.error("Error creating PDF", err);
          setError("Gagal membuat PDF. Silakan coba lagi atau gunakan fitur 'Cetak Langsung (Print)'.");
          setIsPdfLoading(false);
          setExpandAll(false);
          setIsExportingMode(false);
          setExportTarget('all');
          element.style.width = originalWidth;
          element.style.maxWidth = originalMaxWidth;
          element.style.overflow = originalOverflow;
          element.style.padding = originalPadding;
          element.style.background = originalBackground;
        });
      } catch (e: any) {
        clearTimeout(safetyTimeout);
        console.error("PDF Export Exception", e);
        setError(e.message || "Terjadi kesalahan sistem saat memproses PDF.");
        setIsPdfLoading(false);
        setExpandAll(false);
        setIsExportingMode(false);
        setExportTarget('all');
      }
    }, 3000); 
  };

  const handleExportJPG = (target: string) => {
    if (!result) return;
    
    // Check if library is loaded
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) {
      setError("Library Gambar gagal dimuat. Silakan muat ulang halaman (Refresh).");
      return;
    }

    setShowExportModal(false);
    setIsJpgLoading(true);
    setExportTarget(target);
    if (target === 'all') setExpandAll(true); 
    setIsExportingMode(true); 
    
    // Safety timeout to prevent hanging (120 seconds)
    const safetyTimeout = setTimeout(() => {
      setIsJpgLoading(false);
      setIsExportingMode(false);
      setExpandAll(false);
      setError("Proses penyimpanan gambar memakan waktu terlalu lama. Dokumen mungkin terlalu besar.");
    }, 120000);

    setTimeout(() => {
      try {
        const targetId = target === 'mindmap' ? 'mindmap-content' : 'modul-ajar-content';
        const element = document.getElementById(targetId);
        if (!element) {
          throw new Error("Gagal menemukan konten untuk disimpan.");
        }

        const originalWidth = element.style.width;
        const originalMaxWidth = element.style.maxWidth;
        const originalPadding = element.style.padding;
        const originalBackground = element.style.background;
        const originalOverflow = element.style.overflow;

        window.scrollTo(0, 0);
        
        element.style.width = '1000px';
        element.style.maxWidth = '1000px';
        element.style.padding = '30px 40px'; 
        element.style.background = '#ffffff';
        element.style.overflow = 'visible';
        
        let prefix = "Modul_Ajar";
        if (target === 'lkpd') prefix = "LKPD";
        if (target === 'penugasan_individu') prefix = "Tugas_Individu";
        if (target === 'penugasan_kelompok') prefix = "Tugas_Kelompok";
        if (target === 'tts') prefix = "TTS";
        if (target === 'mindmap') prefix = "MindMap";
        if (target.startsWith('evaluasi')) prefix = "Soal_Evaluasi";

        const subjectSafeName = (result.generatedSubject || subject).replace(/\s+/g, '_');

        const elementHeight = element.scrollHeight;
        let dynamicScale = 2.0;
        if (elementHeight > 5000) dynamicScale = 1.5;
        if (elementHeight > 10000) dynamicScale = 1.0;
        if (elementHeight > 15000) dynamicScale = 0.8;
        if (elementHeight > 20000) dynamicScale = 0.6;

        // Use html2canvas from the window object (loaded via html2pdf bundle)
        const html2canvasLib = (window as any).html2canvas;
        
        html2canvasLib(element, {
          scale: dynamicScale,
          useCORS: true,
          windowWidth: 1100,
          logging: false,
          backgroundColor: '#ffffff',
          scrollY: 0,
          imageTimeout: 0,
          allowTaint: true,
          onclone: (clonedDoc: Document) => {
            clonedDoc.body.style.background = 'white';
            const clonedTargetId = target === 'mindmap' ? 'mindmap-content' : 'modul-ajar-content';
            const clonedElement = clonedDoc.getElementById(clonedTargetId);
            if (clonedElement) {
              clonedElement.style.background = 'white';
              clonedElement.style.boxShadow = 'none';
              clonedElement.style.border = 'none';
              const toRemove = clonedElement.querySelectorAll('.no-print, button, .export-exclude, .lucide-loader2');
              toRemove.forEach(el => el.remove());
              clonedElement.style.padding = '20px';
              clonedElement.style.width = '800px';
              clonedElement.style.maxWidth = '800px';
            }
          }
        }).then((canvas: HTMLCanvasElement) => {
          clearTimeout(safetyTimeout);
          
          // Use toBlob for better stability with large images
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `${prefix}_${subjectSafeName}_${result.judulMateri.replace(/\s+/g, '_')}.jpg`;
              link.href = url;
              link.click();
              
              // Cleanup URL object
              setTimeout(() => URL.revokeObjectURL(url), 100);
            } else {
              setError("Gagal membuat data gambar. Dokumen mungkin terlalu besar.");
            }
            
            setIsJpgLoading(false);
            setExpandAll(false);
            setIsExportingMode(false);
            setExportTarget('all');
            // Reset styles
            element.style.width = originalWidth;
            element.style.maxWidth = originalMaxWidth;
            element.style.padding = originalPadding;
            element.style.background = originalBackground;
            element.style.overflow = originalOverflow;
          }, 'image/jpeg', 0.9);
          
        }).catch((err: any) => {
          clearTimeout(safetyTimeout);
          console.error("JPG Export Error:", err);
          setError("Gagal menyimpan gambar. Dokumen mungkin terlalu besar.");
          setIsJpgLoading(false);
          setExpandAll(false);
          setIsExportingMode(false);
          setExportTarget('all');
          element.style.width = originalWidth;
          element.style.maxWidth = originalMaxWidth;
          element.style.padding = originalPadding;
          element.style.background = originalBackground;
          element.style.overflow = originalOverflow;
        });
      } catch (e) {
        clearTimeout(safetyTimeout);
        console.error("JPG Export Error", e);
        setError("Terjadi kesalahan sistem saat memproses gambar.");
        setIsJpgLoading(false);
        setIsExportingMode(false);
        setExpandAll(false);
      }
    }, 3000);
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
    if (result.tekaTekiSilang) {
      textToCopy += `I. TEKA-TEKI SILANG (TTS)\n`;
      textToCopy += `Mendatar:\n`;
      result.tekaTekiSilang.mendatar?.forEach((item: any) => textToCopy += `${item.nomor}. ${item.pertanyaan} (Jawaban: ${item.jawaban})\n`);
      textToCopy += `Menurun:\n`;
      result.tekaTekiSilang.menurun?.forEach((item: any) => textToCopy += `${item.nomor}. ${item.pertanyaan} (Jawaban: ${item.jawaban})\n`);
      textToCopy += `\n`;
    }
    if (result.pilihanGanda?.length) {
      textToCopy += `J. EVALUASI FORMATIF (Pilihan Ganda)\n`;
      result.pilihanGanda.forEach((pg: any, i: number) => {
        textToCopy += `${i + 1}. ${pg.soal}\n   A. ${pg.opsiA}\n   B. ${pg.opsiB}\n   C. ${pg.opsiC}\n   D. ${pg.opsiD}\n   E. ${pg.opsiE}\n   Kunci: ${pg.kunci}\n\n`;
      });
    }
    if (result.instrumenPenilaian) {
      textToCopy += `K. INSTRUMEN PENILAIAN\n1. Penilaian Sikap:\n`;
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden animate-gradient-xy bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] bg-amber-100/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] mix-blend-overlay"></div>
          
          {/* Floating Particles/Shapes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400/20 rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-blue-400/20 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce animation-delay-3000"></div>
        </div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden animate-in fade-in zoom-in duration-700 relative z-10">
          <div className="p-10 bg-emerald-600 text-white text-center relative overflow-hidden">
            {/* Decorative elements in header */}
            <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] animate-in slide-in-from-top-6 duration-1000">
              <Lock size={40} className="animate-pulse text-white drop-shadow-md" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Dashboard Aplikasi</h1>
            <p className="text-emerald-100/90 text-sm font-medium">Silakan masukkan akun anda untuk melanjutkan</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-10 space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Akun Aplikasi</label>
              <div className="relative group">
                <input 
                  type={showApiKey ? "text" : "password"} 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan email terdaftar..."
                  className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                >
                  {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 animate-in slide-in-from-left-2 duration-300">
                  <AlertCircle size={14} className="shrink-0" />
                  <p className="text-xs font-bold">{loginError}</p>
                </div>
              )}
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] transition-all active:scale-[0.97] flex items-center justify-center gap-3 group"
            >
              <span>Masuk Sekarang</span>
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
            
            <div className="pt-4 flex flex-col items-center gap-4">
              <div className="h-px w-12 bg-slate-200"></div>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                © 2026 Modul Ajar • Aminudin, S.Pd.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 pb-20 relative transition-colors duration-500 ${isFocusMode ? 'bg-white' : 'bg-slate-50 text-slate-800'}`}>
      {/* Refresh & Focus Mode Buttons */}
      {!isExportingMode && (
        <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 no-print">
          <button 
            onClick={handleLogout}
            className="p-2.5 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all group"
            title="Keluar / Logout"
          >
            <Lock size={18} />
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-xl shadow-sm transition-all group"
            title="Muat Ulang Halaman"
          >
            <RotateCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button 
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2.5 backdrop-blur-md border rounded-xl shadow-sm transition-all group ${isFocusMode ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/80 border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-white'}`}
            title={isFocusMode ? "Keluar Mode Fokus" : "Mode Fokus (Sembunyikan Menu)"}
          >
            {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      )}

      <div className={`mx-auto space-y-6 transition-all duration-500 ${isFocusMode ? 'max-w-5xl pt-4' : 'max-w-4xl pt-0'}`}>
        
        {!isExportingMode && !isFocusMode && (
          <header className="text-center pt-6 pb-2">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-600 text-white rounded-xl mb-4 shadow-sm">
              <BookOpen size={28} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">WAKA AIK SMPMUSAPRO</h1>
            <p className="text-emerald-600 font-semibold text-sm md:text-base mt-1">oleh: Aminudin, S.Pd.</p>
            <p className="text-slate-500 mt-2 text-sm md:text-base max-w-xl mx-auto">Modul Ajar Terstruktur</p>
          </header>
        )}

        {!isExportingMode && !isFocusMode && (
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
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Input Kode Aplikasi</label>
                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="Masukkan kode Anda..."
                      className="w-full pl-3 pr-16 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                      disabled={isLoading || isPdfLoading || isJpgLoading}
                    />
                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (customApiKey) {
                            navigator.clipboard.writeText(customApiKey);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Salin API Key"
                      >
                        <Copy size={14} />
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
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Penyusun</label>
                    <input 
                      type="text" 
                      value={namaPenyusun} 
                      onChange={e=>setNamaPenyusun(e.target.value)} 
                      placeholder="Nama Guru..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Fase / Kelas</label>
                    <select 
                      value={kelas} 
                      onChange={e=>setKelas(e.target.value)} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Fase A - Kelas I/II">Fase A - Kelas I/II</option>
                      <option value="Fase B - Kelas III/IV">Fase B - Kelas III/IV</option>
                      <option value="Fase C - Kelas V/VI">Fase C - Kelas V/VI</option>
                      <option value="Fase D - Kelas VII">Fase D - Kelas VII</option>
                      <option value="Fase D - Kelas VIII">Fase D - Kelas VIII</option>
                      <option value="Fase D - Kelas IX">Fase D - Kelas IX</option>
                      <option value="Fase E - Kelas X">Fase E - Kelas X</option>
                      <option value="Fase F - Kelas XI/XII">Fase F - Kelas XI/XII</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Semester</label>
                    <select 
                      value={semester} 
                      onChange={e=>setSemester(e.target.value)} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tahun Ajaran</label>
                    <input 
                      type="text" 
                      value={tahunAjaran} 
                      onChange={e=>setTahunAjaran(e.target.value)} 
                      placeholder="2023/2024"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Jumlah Soal</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50" 
                      value={numQuestions} 
                      onChange={e=>setNumQuestions(parseInt(e.target.value) || 1)} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alokasi Waktu</label>
                    <input 
                      type="text" 
                      value={alokasiWaktu} 
                      onChange={e=>setAlokasiWaktu(e.target.value)} 
                      placeholder="2 JP (2 x 45 Menit)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>

                  <div className="md:col-span-3 pt-2 border-t border-slate-200 mt-2 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Upload Logo Sekolah (KOP)</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                          {logo && (
                            <button 
                              type="button"
                              onClick={() => setLogo(null)}
                              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 underline"
                            >
                              Hapus Logo
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <a 
                          href="https://drive.google.com/file/d/1VvSuJzYatiDrM5-j0yNIDmUjvAGCHGuH/view?pli=1" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                          <Download size={14} />
                          Download Logo Referensi
                        </a>
                      </div>
                    </div>
                    {logo && (
                      <div className="p-2 bg-white border border-slate-200 rounded-lg inline-block">
                        <img src={logo} alt="Logo Preview" className="h-12 w-auto object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              )}

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col items-start gap-1">
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-3 text-slate-500 bg-white border border-slate-200 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                      title="Bagikan Aplikasi"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || isPdfLoading || isJpgLoading || !topic.trim()}
                      className="flex-1 md:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} /> 
                          <span className="animate-pulse">{loadingMessages[loadingMessageIndex]}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} /> 
                          Buat Modul Ajar
                        </>
                      )}
                    </button>
                  </div>
                </div>
            </form>
            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 border border-red-100 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0 text-red-500" /> 
                  <p className="leading-relaxed">{error}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                  {(error.includes('High Demand') || error.includes('Kuota')) && (
                    <button 
                      onClick={() => {
                        const form = document.querySelector('form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                    >
                      Coba Lagi
                    </button>
                  )}
                  <button 
                    onClick={() => setError("")}
                    className="px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {result && !isExportingMode && (
          <section className="space-y-4">
            {!isFocusMode && (
              <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-200/70 rounded-xl shadow-inner">
                {[
                  { id: 'all', label: 'Semua Modul', icon: <Layers size={16} /> },
                  { id: 'presentasi', label: 'Presentasi', icon: <Presentation size={16} /> },
                  { id: 'mindmap', label: 'Mind Map', icon: <Share2 size={16} /> },
                  { id: 'lkpd', label: 'Lembar LKPD', icon: <FileText size={16} /> },
                  { id: 'penugasan_individu', label: 'Tugas Individu', icon: <User size={16} /> },
                  { id: 'penugasan_kelompok', label: 'Tugas Kelompok', icon: <Users size={16} /> },
                  { id: 'tts', label: 'Teka-Teki Silang', icon: <Grid size={16} /> },
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
            )}

            {!isFocusMode && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-1 pb-2 gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Eye size={20} className="text-emerald-600" /> Tinjauan</h2>
                  <button 
                    onClick={resetAllStates}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-bold text-xs hover:bg-white hover:text-red-600 transition-all shadow-sm active:scale-95"
                    title="Hapus hasil saat ini dan buat modul baru"
                  >
                    <RotateCw size={14} /> Buat Baru
                  </button>
                </div>
                <div className="flex flex-wrap justify-end gap-2 w-full sm:w-auto relative">
                  <button 
                    onClick={() => handlePrint(viewMode)}
                    className="flex flex-col items-center justify-center px-4 py-1 bg-emerald-600 text-white border border-emerald-700 rounded-lg shadow-sm hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Printer size={16} /> Cetak Langsung
                    </div>
                    <span className="text-[8px] font-medium opacity-80 uppercase tracking-tighter">Stabil & Cepat (Rekomendasi)</span>
                  </button>

                  <button 
                    onClick={() => { setExportType('pdf'); setShowExportModal(true); }} 
                    disabled={isPdfLoading || isJpgLoading} 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-bold text-sm"
                  >
                    {isPdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Simpan PDF
                  </button>
                  
                  <button 
                    onClick={() => { setExportType('jpg'); setShowExportModal(true); }} 
                    disabled={isPdfLoading || isJpgLoading} 
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold text-sm"
                  >
                    {isJpgLoading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Simpan Gambar
                  </button>

                  <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-sm">
                    {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Tersalin!' : 'Salin Teks'}
                  </button>
                </div>
              </div>
            )}

            {/* SCROLL TO TOP */}
            {showScrollTop && !isFocusMode && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 p-3.5 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-50 animate-in fade-in slide-in-from-bottom-6 active:scale-90"
                title="Kembali ke Atas"
              >
                <ChevronDown className="rotate-180" size={24} />
              </button>
            )}

            {/* Modal Export */}
            {showExportModal && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className={`p-6 text-white flex items-center justify-between ${exportType === 'pdf' ? 'bg-indigo-600' : 'bg-sky-600'}`}>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {exportType === 'pdf' ? <Download size={20} /> : <ImageIcon size={20} />}
                      Pilih Format Simpan {exportType === 'pdf' ? 'PDF' : 'Gambar'}
                    </h3>
                    <button onClick={() => setShowExportModal(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                      <AlertCircle className="rotate-45" size={24} />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-sm text-slate-500 mb-4 px-2">Silakan pilih bagian yang ingin Anda simpan sebagai {exportType === 'pdf' ? 'dokumen PDF' : 'file gambar'}:</p>
                    
                    <button 
                      onClick={() => exportType === 'pdf' ? handleExportPDF('all') : handleExportJPG('all')}
                      className="w-full text-left px-4 py-4 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">Modul Ajar Lengkap</span>
                        {exportType === 'pdf' && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Cetak Langsung Tersedia</span>}
                      </div>
                      <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={18} />
                    </button>

                    {exportType === 'pdf' && (
                      <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Opsi Cetak Langsung (Rekomendasi)</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'all', label: 'Semua Modul' },
                            { id: 'lkpd', label: 'LKPD' },
                            { id: 'tts', label: 'TTS' },
                            { id: 'evaluasi_tanpa_kunci', label: 'Soal Siswa' },
                            { id: 'evaluasi_dengan_kunci', label: 'Soal Guru' },
                            { id: 'penugasan_individu', label: 'Tugas Individu' },
                            { id: 'penugasan_kelompok', label: 'Tugas Kelompok' },
                          ].map((item) => (
                            <button 
                              key={item.id}
                              onClick={() => handlePrint(item.id)}
                              className="flex flex-col items-start p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-100 transition-all group"
                            >
                              <span className="font-bold text-emerald-700 text-xs">{item.label}</span>
                              <span className="text-[9px] text-emerald-600 font-medium">Cetak Langsung</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button 
                        onClick={() => exportType === 'pdf' ? handleExportPDF('mindmap') : handleExportJPG('mindmap')}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <Share2 size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Mind Map</span>
                      </button>

                      <button 
                        onClick={() => exportType === 'pdf' ? handleExportPDF('lkpd') : handleExportJPG('lkpd')}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Lembar LKPD</span>
                      </button>
                    </div>

                    <button 
                      onClick={() => exportType === 'pdf' ? handleExportPDF('tts') : handleExportJPG('tts')}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group transition-all"
                    >
                      <span className="font-bold text-slate-700 text-sm">Teka-Teki Silang (TTS)</span>
                      <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={18} />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => exportType === 'pdf' ? handleExportPDF('evaluasi_tanpa_kunci') : handleExportJPG('evaluasi_tanpa_kunci')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group transition-all"
                      >
                        <span className="font-bold text-slate-700 text-xs">Soal (Siswa)</span>
                        <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={14} />
                      </button>

                      <button 
                        onClick={() => exportType === 'pdf' ? handleExportPDF('evaluasi_dengan_kunci') : handleExportJPG('evaluasi_dengan_kunci')}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group transition-all"
                      >
                        <span className="font-bold text-slate-700 text-xs">Soal (Guru)</span>
                        <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 flex justify-end">
                    <button 
                      onClick={() => setShowExportModal(false)}
                      className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {result && (
          <div id="modul-ajar-content-container">
            {(viewMode === 'presentasi' || (isExportingMode && exportTarget === 'presentasi')) && (
              <div id="presentation-content" className={viewMode === 'all' ? 'mb-8' : ''}>
                <PresentationView 
                  result={result}
                  subject={subject}
                  kelas={kelas}
                  semester={semester}
                  tahunAjaran={tahunAjaran}
                  namaPenyusun={namaPenyusun}
                  logo={logo}
                  isExportingMode={isExportingMode}
                />
              </div>
            )}
            {(viewMode === 'mindmap' || (isExportingMode && exportTarget === 'mindmap')) && (
              <div id="mindmap-content" className={viewMode === 'all' ? 'mb-8' : ''}>
                <MindMap data={result} />
              </div>
            )}
            {viewMode !== 'mindmap' && viewMode !== 'presentasi' && (
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
                ttsTopic={ttsTopic}
                setTtsTopic={setTtsTopic}
                ttsNumQuestions={ttsNumQuestions}
                setTtsNumQuestions={setTtsNumQuestions}
                ttsMode={ttsMode}
                setTtsMode={setTtsMode}
                handleGenerateTTS={handleGenerateTTS}
                isTtsLoading={isTtsLoading}
                logo={logo}
              />
            )}
          </div>
        )}

        {/* Export Loading Overlay */}
        {(isPdfLoading || isJpgLoading) && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 border border-white/20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Download className="text-emerald-600 animate-bounce" size={24} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Sedang Memproses...</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Mohon tunggu sebentar, sistem sedang menyusun dokumen {isPdfLoading ? 'PDF' : 'Gambar'} Anda. 
                  <br /><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-2 block">Jangan tutup halaman ini</span>
                </p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-2/3 animate-[shimmer_2s_infinite_linear] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 bg-[length:200%_100%]"></div>
              </div>
              <button 
                onClick={resetAllStates}
                className="mt-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors"
              >
                Batalkan & Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
