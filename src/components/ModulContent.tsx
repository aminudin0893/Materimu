import React from 'react';
import { 
  Layers, Target, Clock, Lightbulb, BookText, FileText, User, Users, ListChecks, ClipboardCheck, Sun, Heart, ChevronUp, ChevronDown, Grid, Sparkles, Loader2 
} from 'lucide-react';

interface ModulContentProps {
  result: any;
  subject: string;
  kelas: string;
  semester: string;
  tahunAjaran: string;
  namaPenyusun: string;
  alokasiWaktu: string;
  isExportingMode: boolean;
  displayTarget: string;
  expandedSubtopics: number[];
  expandAll: boolean;
  toggleAccordion: (index: number) => void;
  ttsTopic: string;
  setTtsTopic: (val: string) => void;
  ttsNumQuestions: number;
  setTtsNumQuestions: (val: number) => void;
  ttsMode: 'guru' | 'siswa';
  setTtsMode: (val: 'guru' | 'siswa') => void;
  handleGenerateTTS: (e: React.FormEvent) => void;
  isTtsLoading: boolean;
  logo?: string | null;
}

export const ModulContent: React.FC<ModulContentProps> = ({
  result, subject, kelas, semester, tahunAjaran, namaPenyusun, alokasiWaktu,
  isExportingMode, displayTarget, expandedSubtopics, expandAll, toggleAccordion,
  ttsTopic, setTtsTopic, ttsNumQuestions, setTtsNumQuestions, ttsMode, setTtsMode,
  handleGenerateTTS, isTtsLoading, logo
}) => {
  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed === '') return null;
      
      // Handle bullet points (-, *, •)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        return (
          <div key={index} className="flex gap-2 mb-1.5 pl-2 text-justify leading-relaxed" style={{ pageBreakInside: 'avoid' }}>
            <span className="text-indigo-500 font-bold shrink-0">•</span>
            <span>{trimmed.substring(2)}</span>
          </div>
        );
      }
      
      // Handle numbered points (1., 2., etc)
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.)\s(.*)/);
        if (match) {
          return (
            <div key={index} className="flex gap-2 mb-1.5 pl-2 text-justify leading-relaxed" style={{ pageBreakInside: 'avoid' }}>
              <span className="text-indigo-600 font-bold shrink-0">{match[1]}</span>
              <span>{match[2]}</span>
            </div>
          );
        }
      }

      return (
        <p key={index} className="mb-2 last:mb-0 text-justify leading-relaxed" style={{ pageBreakInside: 'avoid' }}>
          {paragraph}
        </p>
      );
    });
  };

  const shouldRender = (sectionName: string) => {
    if (displayTarget === 'all') return true;
    if (sectionName === 'evaluasi' && displayTarget.startsWith('evaluasi')) return true;
    return displayTarget === sectionName;
  };

  const ismubaSubjects = ['Kemuhammadiyahan', 'Al-Islam', 'Bahasa Arab'];
  const isIsmuba = ismubaSubjects.includes(result.generatedSubject || subject);
  const judulPendekatanKhusus = isIsmuba ? "B. Pendekatan Kurikulum ISMUBA" : "B. Pendekatan Berbasis Cinta";

  const IdentitasIndividu = () => {
    const defaultKelas = kelas.includes("-") ? kelas.split("-")[1].trim() : kelas;
    return (
      <div className={`${isExportingMode ? 'mb-2 pb-2' : 'mb-4 pb-4'} border-b ${isExportingMode ? 'border-slate-100' : 'border-slate-300'} text-sm text-slate-800 flex justify-between font-serif`} style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
        <div className="flex flex-col justify-center space-y-1 text-base">
            <p><span className="font-semibold inline-block w-40">Nama Siswa</span> : ...........................................................</p>
            <p><span className="font-semibold inline-block w-40">Kelas / No. Absen</span> : {defaultKelas} / ........................................</p>
            <p><span className="font-semibold inline-block w-40">Tanggal</span> : ...........................................................</p>
        </div>
        <div className="text-right flex flex-col justify-start">
            <div className={`border border-slate-600 p-1.5 w-24 text-center font-bold ${isExportingMode ? 'bg-white' : 'bg-slate-100'} tracking-widest text-xs`}>NILAI</div>
            <div className="border border-t-0 border-slate-600 p-2 h-16 w-24"></div>
        </div>
      </div>
    );
  };

  const IdentitasKelompok = () => {
    const defaultKelas = kelas.includes("-") ? kelas.split("-")[1].trim() : kelas;
    return (
      <div className={`mb-4 pb-4 border-b ${isExportingMode ? 'border-slate-100' : 'border-slate-300'} text-sm text-slate-800 flex justify-between font-serif`} style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
        <div className="w-3/4 pr-4">
            <div className="flex flex-col space-y-2 text-base mb-3">
              <p><span className="font-semibold inline-block w-40">Nama Kelompok</span> : ...........................................................</p>
              <p><span className="font-semibold inline-block w-40">Kelas</span> : {defaultKelas}</p>
              <p><span className="font-semibold inline-block w-40">Tanggal</span> : ...........................................................</p>
            </div>
            <p className="font-semibold text-base mb-2">Daftar Anggota Kelompok :</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-base">
              <p>1. ...................................................</p>
              <p>4. ...................................................</p>
              <p>2. ...................................................</p>
              <p>5. ...................................................</p>
              <p>3. ...................................................</p>
              <p>6. ...................................................</p>
            </div>
        </div>
        <div className="w-1/4 text-right flex flex-col items-end justify-start">
            <div className={`border border-slate-600 p-1.5 w-24 text-center font-bold ${isExportingMode ? 'bg-white' : 'bg-slate-100'} tracking-widest text-xs`}>NILAI</div>
            <div className="border border-t-0 border-slate-600 p-2 h-16 w-24"></div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="modul-ajar-content" 
      className={`${isExportingMode ? 'bg-white p-0 text-sm font-serif' : 'bg-white rounded-2xl overflow-hidden text-slate-800 shadow-sm border border-slate-200 ' + (displayTarget === 'all' ? 'divide-y divide-slate-100' : 'p-6 md:p-8')}`}
    >
      
      {/* KOP SEKOLAH */}
      {(isExportingMode || displayTarget !== 'all') && (
        <div className={`pt-2 pb-3 ${isExportingMode ? 'mb-2' : 'mb-6'} border-b-[4px] border-slate-800 border-double flex items-center gap-6`} style={{ pageBreakAfter: 'avoid' }}>
          {logo ? (
            <div className="w-24 h-24 shrink-0 flex items-center justify-center">
              <img src={logo} alt="Logo Sekolah" className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className={`w-24 h-24 shrink-0 border-2 border-dashed ${isExportingMode ? 'border-slate-100' : 'border-slate-300'} rounded-lg flex items-center justify-center text-[10px] text-slate-400 text-center p-2`}>
              Logo Sekolah
            </div>
          )}
          <div className="flex-1 text-center pr-24">
            <h2 className="text-[14px] font-bold uppercase text-slate-900 leading-tight">
              MAJELIS PENDIDIKAN DASAR MENENGAH DAN PENDIDIKAN NON FORMAL
            </h2>
            <h2 className="text-[14px] font-bold uppercase text-slate-900 leading-tight">
              PIMPINAN DAERAH MUHAMMADIYAH KOTA PROBOLINGGO
            </h2>
            <h1 className="text-[20px] font-black uppercase text-slate-900 leading-tight my-1">
              SMP MUHAMMADIYAH 1 KOTA PROBOLINGGO
            </h1>
            <h2 className="text-[14px] font-bold uppercase text-slate-900 leading-tight">
              TERAKREDITASI A
            </h2>
            <p className="text-[11px] text-slate-800 mt-1">
              Jl. Mayjend Panjaitan 73 Kota Probolinggo Email: <span className="text-blue-600 underline">smp_muh.prob@yahoo.co.id</span>
            </p>
            <p className="text-[11px] text-slate-800">
              Telp/fax. 0335-422307 Website: smpmusapro.sch.id
            </p>
          </div>
        </div>
      )}

      {/* JUDUL DOKUMEN (DIBAWAH KOP) */}
      {(isExportingMode || displayTarget !== 'all') && (
        <div className={`text-center ${isExportingMode ? 'mb-2' : 'mb-6'}`}>
          <h1 className="text-lg font-bold uppercase tracking-widest text-slate-800 leading-tight">
            {displayTarget === 'all' && `MODUL AJAR ${(result.generatedSubject || subject).toUpperCase()}`}
            {displayTarget === 'lkpd' && `LEMBAR KERJA PESERTA DIDIK (LKPD)`}
            {displayTarget === 'tts' && `TEKA-TEKI SILANG (TTS)`}
            {displayTarget === 'penugasan_individu' && `LEMBAR PENUGASAN MANDIRI`}
            {displayTarget === 'penugasan_kelompok' && `LEMBAR TUGAS KELOMPOK`}
            {displayTarget.startsWith('evaluasi') && `EVALUASI FORMATIF PESERTA DIDIK`}
          </h1>
          {displayTarget !== 'all' && (
            <h2 className="text-sm font-bold uppercase text-slate-700 mt-1">MATA PELAJARAN {(result.generatedSubject || subject).toUpperCase()}</h2>
          )}
        </div>
      )}

      {/* IDENTITAS MODUL */}
      {shouldRender('all') && (
        <div className={`${isExportingMode ? 'pt-0 pb-6' : displayTarget === 'all' ? 'p-6 md:p-8 bg-slate-50' : 'pb-6'}`}>
          {!isExportingMode && displayTarget === 'all' && (
            <div className="text-center mb-6 border-b border-slate-200 pb-6">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Modul Ajar {result.generatedSubject || subject}</h3>
              <h4 className="text-2xl font-black text-slate-900">{result.judulMateri}</h4>
            </div>
          )}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 ${isExportingMode || displayTarget !== 'all' ? 'text-sm font-serif' : 'text-base bg-white p-5 rounded-xl border border-slate-200 shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Mata Pelajaran</span><span className="font-semibold text-slate-600">: {result.generatedSubject || subject}</span></div>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Materi Pokok</span><span className="font-semibold text-slate-600">: {result.judulMateri}</span></div>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Fase / Kelas</span><span className="font-semibold text-slate-600">: {kelas}</span></div>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Semester</span><span className="font-semibold text-slate-600">: {semester}</span></div>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Penyusun</span><span className="font-semibold text-slate-600">: {namaPenyusun || '-'}</span></div>
            <div className="flex gap-2"><span className="font-bold w-32 shrink-0">Tahun Ajaran</span><span className="font-semibold text-slate-600">: {tahunAjaran || '-'}</span></div>
            <div className="flex gap-2 md:col-span-2"><span className="font-bold w-32 shrink-0">Alokasi Waktu</span><span className="font-semibold text-slate-600">: {alokasiWaktu || '-'}</span></div>
          </div>
        </div>
      )}

      {/* A. Model & B. Pendekatan */}
      {shouldRender('all') && (
        <div className={`grid md:grid-cols-2 gap-6 ${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-100 pb-6 mb-6' : 'p-6 md:p-8 bg-rose-50/30'}`} style={{ pageBreakInside: 'avoid' }}>
          <div className={`p-5 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-100' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Layers size={20} />
                <h3 className="font-bold text-lg text-slate-800">A. Model Pembelajaran</h3>
              </div>
              {!isExportingMode && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 uppercase tracking-tighter">
                  <Sparkles size={10} /> Rekomendasi AI
                </span>
              )}
            </div>
            <div className="text-slate-700 space-y-3">
              {result.modelPembelajaran && result.modelPembelajaran.includes('\n') ? (
                formatText(result.modelPembelajaran)
              ) : (
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50 italic text-sm">
                  {result.modelPembelajaran}
                </div>
              )}
            </div>
          </div>
          <div className={`p-5 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-100' : isIsmuba ? 'bg-white border border-sky-200 shadow-sm' : 'bg-white border border-rose-200 shadow-sm'}`}>
            <div className={`flex items-center gap-2 mb-3 ${isIsmuba ? 'text-sky-600' : 'text-rose-600'}`}>
              {isIsmuba ? <Sun size={20} /> : <Heart size={20} />}
              <h3 className="font-bold text-lg text-slate-800">{judulPendekatanKhusus}</h3>
            </div>
            <div className="text-slate-700">{formatText(result.pendekatanKhusus)}</div>
          </div>
        </div>
      )}

      {/* C. TP */}
      {shouldRender('all') && (
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-100 pb-6 mb-6' : 'p-6 md:p-8'}`}>
          <div className="flex items-center gap-2 mb-4 text-emerald-600" style={{ pageBreakAfter: 'avoid' }}>
            <Target size={20} />
            <h3 className="text-lg font-bold text-slate-800">C. Tujuan Pembelajaran (TP)</h3>
          </div>
          <div className="space-y-2 text-slate-700 text-justify leading-relaxed">
            {result.tp?.map((item: string, i: number) => (
              <div key={i} className="flex gap-3 items-start" style={{ pageBreakInside: 'avoid' }}>
                <span className="font-bold shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. ATP TABEL */}
      {shouldRender('all') && (
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-100 pb-6 mb-6' : 'p-6 md:p-8 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-4 text-indigo-600" style={{ pageBreakAfter: 'avoid' }}>
            <Clock size={20} />
            <h3 className="text-lg font-bold text-slate-800">D. Alur Pembelajaran (1 Pertemuan)</h3>
          </div>
          <div className={`${isExportingMode || displayTarget !== 'all' ? '' : 'overflow-x-auto'}`}>
            <table className={`w-full text-left border-collapse ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-200' : 'border border-slate-300 bg-white shadow-sm rounded-xl overflow-hidden'}`} style={{ pageBreakInside: 'auto' }}>
              <thead style={{ display: 'table-header-group' }}>
                <tr className={`text-slate-800 ${isExportingMode || displayTarget !== 'all' ? 'bg-white border-slate-200' : 'bg-slate-100 border-slate-300'}`}>
                  <th className={`p-4 font-bold w-1/4 text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'} uppercase tracking-wider text-[11px]`}>Tahap Kegiatan</th>
                  <th className={`p-4 font-bold w-auto text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'} uppercase tracking-wider text-[11px]`}>Deskripsi Kegiatan Guru & Siswa</th>
                  <th className={`p-4 font-bold w-32 text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'} uppercase tracking-wider text-[11px]`}>Durasi</th>
                </tr>
              </thead>
              <tbody className="text-slate-800" style={{ pageBreakInside: 'auto' }}>
                {result.atpTabel?.map((row: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : (isExportingMode ? 'bg-white' : 'bg-slate-50/50')} style={{ pageBreakInside: 'avoid', pageBreakAfter: 'auto' }}>
                    <td className={`p-4 font-bold align-middle text-center border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'} ${isExportingMode ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <span className="text-indigo-700 text-sm">{row.tahap}</span>
                    </td>
                    <td className={`p-4 align-top leading-relaxed border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'} text-sm`}>
                      {formatText(row.kegiatan)}
                    </td>
                    <td className={`p-4 align-middle text-center border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-slate-300'}`}>
                      <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'}`}>
                        {row.durasi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E. Pemantik */}
      {shouldRender('all') && (
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-100 pb-6 mb-6' : 'p-6 md:p-8 bg-amber-50/30'}`}>
          <div className="flex items-center gap-2 mb-4 text-amber-500" style={{ pageBreakAfter: 'avoid' }}>
            <Lightbulb size={20} />
            <h3 className="text-lg font-bold text-slate-800">E. Pertanyaan Pemantik</h3>
          </div>
          <div className="space-y-4">
            {result.pertanyaanPemantik?.map((p: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-100' : 'bg-white border border-amber-100 shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                <div className="flex gap-2 font-bold text-slate-800 mb-2 leading-relaxed">
                  <span className="text-amber-600 shrink-0">Tanya:</span>
                  <span>{p.pertanyaan}</span>
                </div>
                <div className="pl-7 space-y-2 mb-3 text-sm">
                   <div className="flex gap-2"><span className="font-semibold text-slate-500 shrink-0">Siswa 1:</span><span className="text-slate-700 italic">"{p.jawabanAlternatif1 || p.jawaban}"</span></div>
                   {p.jawabanAlternatif2 && <div className="flex gap-2"><span className="font-semibold text-slate-500 shrink-0">Siswa 2:</span><span className="text-slate-700 italic">"{p.jawabanAlternatif2}"</span></div>}
                </div>
                <div className={`mt-3 pt-3 flex gap-2 ${isExportingMode || displayTarget !== 'all' ? 'border-t border-slate-100' : 'border-t border-slate-100'}`}>
                  <span className="font-bold text-slate-600 shrink-0">Penjelasan Guru:</span>
                  <span className="text-slate-700 leading-relaxed text-justify">{p.penjelasanGuru || p.jawaban}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. Materi Inti */}
      {shouldRender('all') && (
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'pb-3' : 'p-6 md:p-8'}`}>
          <div className="flex items-center gap-2 mb-4 text-emerald-600" style={{ pageBreakAfter: 'avoid' }}>
            <BookText size={20} />
            <h3 className="text-lg font-bold text-slate-800">F. Materi Inti & Dalil</h3>
          </div>
          <div className="mb-4" style={{ pageBreakAfter: 'avoid' }}>
            <p className="font-bold text-slate-800 mb-2">1. Pengertian</p>
            <div className="text-slate-700">{formatText(result.pengertian)}</div>
          </div>
          <p className="font-bold text-slate-800 mb-2" style={{ pageBreakAfter: 'avoid' }}>2. Dalil Al-Quran / Hadits</p>
          <div className="space-y-4">
            {result.dalil?.map((d: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-100' : 'bg-slate-50 border border-slate-200'}`} style={{ pageBreakInside: 'avoid' }}>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-md mb-3 inline-block ${isExportingMode || displayTarget !== 'all' ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-700'}`}>{d.sumber}</span>
                {d.teksArab && <p className="text-2xl font-arabic text-slate-900 text-right mb-4 leading-loose" dir="rtl">{d.teksArab}</p>}
                <p className={`text-slate-700 italic pl-4 py-1 border-l-4 leading-relaxed ${isExportingMode || displayTarget !== 'all' ? 'border-slate-200' : 'border-emerald-400'}`}>"{d.terjemahan}"</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="font-bold text-slate-800 mb-2">3. Rincian Materi Pembahasan</p>
            <div className={`space-y-0 rounded-xl overflow-hidden ${isExportingMode || displayTarget !== 'all' ? '' : 'border border-slate-200 bg-white'}`}>
              {result.subTopik?.map((sub: any, index: number) => {
                const isOpen = expandedSubtopics.includes(index) || expandAll;
                return (
                  <div key={index} className={`${isExportingMode || displayTarget !== 'all' ? 'mb-4' : 'border-b border-slate-200 last:border-0'}`} style={{ pageBreakInside: 'avoid' }}>
                    <button onClick={() => !isExportingMode && toggleAccordion(index)} className={`w-full flex items-center justify-between text-left focus:outline-none ${isExportingMode || displayTarget !== 'all' ? 'py-1' : 'px-6 py-4 hover:bg-slate-50 transition-colors'}`} disabled={isExportingMode || displayTarget !== 'all'}>
                      <span className={`font-bold text-slate-800 ${isExportingMode || displayTarget !== 'all' ? 'text-md' : 'font-semibold'}`}>{index + 1}. {sub.judulSub}</span>
                      {!(isExportingMode || displayTarget !== 'all') && <span className="text-slate-400 bg-slate-100 p-1.5 rounded-full">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen || displayTarget !== 'all' ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className={`text-slate-700 ${isExportingMode || displayTarget !== 'all' ? 'pt-1 pb-3' : 'px-6 pb-6 border-t border-slate-100 pt-5 bg-slate-50/50'}`}>{formatText(sub.penjelasan)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* G. LKPD */}
      {result.lkpd && shouldRender('lkpd') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-100 pt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8 bg-blue-50/30'}`}>
          {displayTarget === 'lkpd' && <IdentitasKelompok />}
          {displayTarget === 'all' && <div className="flex items-center gap-2 mb-4 text-blue-600" style={{ pageBreakAfter: 'avoid' }}><FileText size={20} /><h3 className="text-lg font-bold text-slate-800">G. Lembar Kerja Peserta Didik (LKPD)</h3></div>}
          <div className={`rounded-xl ${displayTarget === 'lkpd' ? ((isExportingMode || displayTarget !== 'all') ? 'border-none p-0' : 'border border-slate-300 p-4') : ((isExportingMode || displayTarget !== 'all') ? 'border border-slate-100 p-4' : 'p-6 bg-white border border-blue-100 shadow-sm')}`} style={{ pageBreakInside: 'avoid' }}>
            <p className={`font-bold text-slate-900 mb-3 ${displayTarget === 'lkpd' ? 'text-lg text-center uppercase mb-5' : 'text-lg'}`}>{result.lkpd.judul}</p>
            <div className={`${displayTarget === 'lkpd' ? 'mb-4' : (isExportingMode || displayTarget !== 'all' ? 'p-4 rounded-lg border border-slate-100 mb-4' : 'bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4')}`}><p className="text-slate-800 text-sm leading-relaxed text-justify"><strong>Tujuan Penugasan:</strong><br/>{result.lkpd.tujuan}</p></div>
            <p className="text-sm font-bold text-slate-800 mb-2">Langkah-langkah Pengerjaan:</p>
            <div className="space-y-2 text-sm text-slate-800 leading-relaxed text-justify pl-1">{result.lkpd.langkahKerja?.map((l: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-semibold shrink-0">{i + 1}.</span><span>{l}</span></div>))}</div>
          </div>
        </div>
      )}

      {/* H. Penugasan */}
      {(shouldRender('all') || shouldRender('penugasan_individu') || shouldRender('penugasan_kelompok')) && (
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-100 pt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8'}`}>
          {displayTarget === 'all' && <h3 className="text-lg font-bold text-slate-800 mb-4" style={{ pageBreakAfter: 'avoid' }}>H. Penugasan</h3>}
          <div className={`grid ${displayTarget === 'all' ? 'md:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
            {(shouldRender('all') || shouldRender('penugasan_individu')) && result.tugasIndividu && (
              <div className={`${displayTarget !== 'all' ? '' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-100' : 'p-5 rounded-xl border border-slate-200 bg-white shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                {displayTarget === 'penugasan_individu' && <IdentitasIndividu />}
                {displayTarget === 'all' && <div className={`flex items-center gap-2 font-bold mb-3 pb-2 text-slate-800 ${(isExportingMode || displayTarget !== 'all') ? 'border-b border-slate-100' : 'border-b border-slate-100'}`}><User size={18} /> Tugas Individu</div>}
                <p className={`font-bold text-slate-900 mb-3 ${displayTarget !== 'all' ? 'text-lg uppercase text-center mb-5' : 'text-md'}`}>{result.tugasIndividu.judul}</p>
                <div className="text-slate-800 text-sm">{formatText(result.tugasIndividu.instruksi)}</div>
              </div>
            )}
            {(shouldRender('all') || shouldRender('penugasan_kelompok')) && result.tugasKelompok && (
              <div className={`${displayTarget !== 'all' ? '' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-100' : 'p-5 rounded-xl border border-slate-200 bg-white shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                {displayTarget === 'penugasan_kelompok' && <IdentitasKelompok />}
                {displayTarget === 'all' && <div className={`flex items-center gap-2 font-bold mb-3 pb-2 text-slate-800 ${(isExportingMode || displayTarget !== 'all') ? 'border-b border-slate-100' : 'border-b border-slate-100'}`}><Users size={18} /> Tugas Kelompok</div>}
                <p className={`font-bold text-slate-900 mb-3 ${displayTarget !== 'all' ? 'text-lg uppercase text-center mb-5' : 'text-md'}`}>{result.tugasKelompok.judul}</p>
                <div className="text-slate-800 text-sm">{formatText(result.tugasKelompok.instruksi)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* I. Teka-Teki Silang */}
      {result.tekaTekiSilang && (shouldRender('all') || shouldRender('tts')) && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? (displayTarget === 'tts' ? 'pt-2 mt-0' : 'border-t border-slate-100 pt-6 mt-6') : 'p-6 md:p-8'}`}>
          {displayTarget === 'tts' && <IdentitasIndividu />}
          <div className="flex items-center justify-between mb-4 no-print" style={{ pageBreakAfter: 'avoid' }}>
            <div className="flex items-center gap-2 text-emerald-600">
              <Grid size={20} className={displayTarget === 'tts' ? 'hidden' : ''} />
              <h3 className="text-lg font-bold text-slate-800">I. Teka-Teki Silang (TTS)</h3>
            </div>
            
            {!isExportingMode && displayTarget === 'tts' && (
              <div className={`flex items-center gap-2 ${isExportingMode ? 'bg-white' : 'bg-slate-100'} p-1 rounded-lg border ${isExportingMode ? 'border-none' : 'border-slate-200'}`}>
                <button 
                  onClick={() => setTtsMode('siswa')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${ttsMode === 'siswa' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Mode Siswa
                </button>
                <button 
                  onClick={() => setTtsMode('guru')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${ttsMode === 'guru' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Mode Guru
                </button>
              </div>
            )}
          </div>

          {!isExportingMode && displayTarget === 'tts' && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl no-print">
              <form onSubmit={handleGenerateTTS} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider ml-1">Judul Materi TTS</label>
                    <input 
                      type="text" 
                      value={ttsTopic || result.judulMateri} 
                      onChange={e => setTtsTopic(e.target.value)} 
                      placeholder="Masukkan judul materi..."
                      className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider ml-1">Jumlah Soal</label>
                    <input 
                      type="number" 
                      min="4" 
                      max="20" 
                      value={ttsNumQuestions} 
                      onChange={e => setTtsNumQuestions(parseInt(e.target.value) || 10)} 
                      className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isTtsLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  {isTtsLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> 
                      <span>Sedang Generate TTS...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> 
                      Generate Ulang TTS Otomatis
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {displayTarget === 'all' && (
            <div className="flex items-center gap-2 mb-6 text-emerald-600" style={{ pageBreakAfter: 'avoid' }}>
              <Grid size={20} />
              <h3 className="text-lg font-bold text-slate-800">I. Teka-Teki Silang (TTS)</h3>
            </div>
          )}
          
          {/* TTS Section Container */}
          <div className={isExportingMode || displayTarget === 'tts' ? 'space-y-0' : 'grid md:grid-cols-2 gap-8'}>
            {/* Grid TTS (Dynamic Generation) */}
            <div className={`flex flex-col items-center justify-center ${isExportingMode ? 'p-2 bg-white border-0 shadow-none' : 'p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl shadow-[inset_0_0_0_1000px_#f8fafc]'} ${isExportingMode || displayTarget === 'tts' ? 'w-full max-w-full mb-2' : ''}`} style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
              <div className={`grid grid-cols-[repeat(15,minmax(0,1fr))] gap-0.5 mb-1 w-full ${isExportingMode || displayTarget === 'tts' ? 'max-w-[500px]' : 'max-w-[400px]'}`}>
                {(() => {
                  const size = 15;
                  const grid = Array(size * size).fill(null).map(() => ({ char: '', number: '', isWhite: false }));
                  
                  const { mendatar = [], menurun = [] } = result.tekaTekiSilang;
                  
                  // Helper to place a word
                  const placeWord = (item: any, row: number, col: number, isHorizontal: boolean) => {
                    const word = (item.jawaban || '').toUpperCase();
                    for (let i = 0; i < word.length; i++) {
                      const r = isHorizontal ? row : row + i;
                      const c = isHorizontal ? col + i : col;
                      const pos = r * size + c;
                      grid[pos].isWhite = true;
                      grid[pos].char = word[i];
                      if (i === 0) {
                        const existing = grid[pos].number;
                        grid[pos].number = existing ? `${existing},${item.nomor}` : item.nomor.toString();
                      }
                    }
                  };

                  // Helper to check if a word can be placed
                  const canPlace = (word: string, row: number, col: number, isHorizontal: boolean) => {
                    if (isHorizontal) {
                      if (col + word.length > size) return false;
                      if (col > 0 && grid[row * size + (col - 1)].isWhite) return false;
                      if (col + word.length < size && grid[row * size + (col + word.length)].isWhite) return false;
                    } else {
                      if (row + word.length > size) return false;
                      if (row > 0 && grid[(row - 1) * size + col].isWhite) return false;
                      if (row + word.length < size && grid[(row + word.length) * size + col].isWhite) return false;
                    }

                    for (let i = 0; i < word.length; i++) {
                      const r = isHorizontal ? row : row + i;
                      const c = isHorizontal ? col + i : col;
                      if (r >= size || c >= size) return false;
                      const pos = r * size + c;
                      const cell = grid[pos];

                      if (cell.isWhite) {
                        if (cell.char !== word[i]) return false;
                      } else {
                        if (isHorizontal) {
                          if (r > 0 && grid[(r - 1) * size + c].isWhite) return false;
                          if (r < size - 1 && grid[(r + 1) * size + c].isWhite) return false;
                        } else {
                          if (c > 0 && grid[r * size + (c - 1)].isWhite) return false;
                          if (c < size - 1 && grid[r * size + (c + 1)].isWhite) return false;
                        }
                      }
                    }
                    return true;
                  };

                  const allWords = [
                    ...mendatar.map(w => ({ ...w, isHorizontal: true })),
                    ...menurun.map(w => ({ ...w, isHorizontal: false }))
                  ].sort((a, b) => b.jawaban.length - a.jawaban.length);

                  const placedWords: any[] = [];
                  const unplacedWords = [...allWords];

                  // 1. Place first word in the middle
                  if (unplacedWords.length > 0) {
                    const first = unplacedWords.shift()!;
                    const r = Math.floor(size / 2);
                    const c = Math.max(0, Math.floor((size - first.jawaban.length) / 2));
                    placeWord(first, r, c, first.isHorizontal);
                    placedWords.push({ ...first, row: r, col: c });
                  }

                  // 2. Iteratively place words by intersecting
                  let changed = true;
                  while (changed && unplacedWords.length > 0) {
                    changed = false;
                    for (let i = 0; i < unplacedWords.length; i++) {
                      const wordObj = unplacedWords[i];
                      const word = (wordObj.jawaban || '').toUpperCase();
                      let bestPos = null;

                      for (const placed of placedWords) {
                        for (let j = 0; j < placed.jawaban.length; j++) {
                          for (let k = 0; k < word.length; k++) {
                            if (placed.jawaban[j].toUpperCase() === word[k]) {
                              const r = placed.isHorizontal ? placed.row - k : placed.row + j;
                              const c = placed.isHorizontal ? placed.col + j : placed.col - k;
                              const isH = !placed.isHorizontal;
                              
                              if (r >= 0 && c >= 0 && canPlace(word, r, c, isH)) {
                                bestPos = { r, c, isH };
                                break;
                              }
                            }
                          }
                          if (bestPos) break;
                        }
                        if (bestPos) break;
                      }

                      if (bestPos) {
                        placeWord(wordObj, bestPos.r, bestPos.c, bestPos.isH);
                        placedWords.push({ ...wordObj, row: bestPos.r, col: bestPos.c, isHorizontal: bestPos.isH });
                        unplacedWords.splice(i, 1);
                        changed = true;
                        break;
                      }
                    }
                  }

                  // 3. Place remaining words in free spaces
                  unplacedWords.forEach(wordObj => {
                    const word = (wordObj.jawaban || '').toUpperCase();
                    let placed = false;
                    for (let r = 0; r < size && !placed; r += 2) {
                      for (let c = 0; c < size - word.length && !placed; c++) {
                        if (canPlace(word, r, c, true)) {
                          placeWord(wordObj, r, c, true);
                          placed = true;
                        }
                      }
                    }
                  });

                  return grid.map((cell, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square border ${!cell.isWhite ? 'bg-slate-800 border-slate-800 shadow-[inset_0_0_0_1000px_#1e293b]' : (isExportingMode ? 'bg-white border-slate-100 shadow-[inset_0_0_0_1000px_#ffffff]' : 'bg-white border-slate-300 shadow-[inset_0_0_0_1000px_#ffffff]')} rounded-sm flex items-center justify-center text-[7px] font-bold text-slate-800 relative`}
                      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                    >
                      {cell.number && (
                        <span 
                          className="absolute top-0 left-0 p-[1px] text-[8px] leading-none z-20 text-black font-black crossword-number"
                          style={{ 
                            WebkitPrintColorAdjust: 'exact',
                            printColorAdjust: 'exact'
                          }}
                        >
                          {cell.number}
                        </span>
                      )}
                      {cell.isWhite && ttsMode === 'guru' && <span className="z-0">{cell.char}</span>}
                    </div>
                  ));
                })()}
              </div>
              <p className="text-[10px] text-slate-500 italic text-center leading-tight">Isi kotak di atas dengan jawaban yang benar agar dapat menyelesaikan tugas dengan baik.</p>
            </div>

            {/* Page break for PDF export */}
            {(isExportingMode || displayTarget === 'tts') && <div className="page-break"></div>}

            {/* Pertanyaan TTS */}
            <div className={`space-y-6 ${(isExportingMode || displayTarget === 'tts') ? 'pt-8' : ''}`}>
              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>M</span> Mendatar
                </h4>
                <div className="space-y-3">
                  {result.tekaTekiSilang.mendatar?.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0 w-5">{item.nomor}.</span>
                      <div className="flex flex-col">
                        <span className="text-slate-700 leading-relaxed">{item.pertanyaan}</span>
                        {(displayTarget === 'tts' && ttsMode === 'guru') && (
                          <span className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Jawaban: {item.jawaban}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>M</span> Menurun
                </h4>
                <div className="space-y-3">
                  {result.tekaTekiSilang.menurun?.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm flex gap-3">
                      <span className="font-bold text-blue-600 shrink-0 w-5">{item.nomor}.</span>
                      <div className="flex flex-col">
                        <span className="text-slate-700 leading-relaxed">{item.pertanyaan}</span>
                        {(displayTarget === 'tts' && ttsMode === 'guru') && (
                          <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">Jawaban: {item.jawaban}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* I. Evaluasi */}
      {result.pilihanGanda?.length > 0 && shouldRender('evaluasi') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-100 pt-4 mt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8'}`}>
          {displayTarget.startsWith('evaluasi') && <IdentitasIndividu />}
          <div className={`flex items-center gap-2 mb-5 ${displayTarget.startsWith('evaluasi') ? 'text-slate-800' : 'text-emerald-600'}`} style={{ pageBreakAfter: 'avoid' }}>
            <ListChecks size={20} className={displayTarget.startsWith('evaluasi') ? 'hidden' : ''} />
            <h3 className="text-lg font-bold text-slate-800">{displayTarget.startsWith('evaluasi') ? 'Petunjuk Pengerjaan: Pilihlah satu jawaban yang menurut Anda paling tepat!' : 'J. Evaluasi Formatif'}</h3>
          </div>
          <div className="space-y-4">
            {result.pilihanGanda.map((pg: any, idx: number) => (
              <div key={idx} className={`${displayTarget.startsWith('evaluasi') ? 'pb-3' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-100' : 'p-6 rounded-xl bg-slate-50 border border-slate-200'}`} style={{ pageBreakInside: 'avoid' }}>
                <div className="flex gap-2 font-bold text-slate-900 mb-3 leading-relaxed"><span className="shrink-0">{idx + 1}.</span><span>{pg.soal}</span></div>
                <div className={`grid ${displayTarget.startsWith('evaluasi') ? 'grid-cols-1 gap-2 ml-6' : 'grid-cols-1 sm:grid-cols-2 gap-3'} text-sm text-slate-800 mb-3 pl-2`}>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">A.</span><span className="leading-relaxed">{pg.opsiA}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">B.</span><span className="leading-relaxed">{pg.opsiB}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">C.</span><span className="leading-relaxed">{pg.opsiC}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">D.</span><span className="leading-relaxed">{pg.opsiD}</span></div>
                  <div className={`flex gap-2 ${!displayTarget.startsWith('evaluasi') ? 'sm:col-span-2' : ''}`}><span className="font-bold shrink-0 w-4">E.</span><span className="leading-relaxed">{pg.opsiE}</span></div>
                </div>
                {(displayTarget === 'all' || displayTarget === 'evaluasi_dengan_kunci') && <div className={`text-sm font-bold mt-1 inline-block px-3 py-1.5 rounded-md ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-200 text-slate-800' : 'bg-emerald-100 border border-emerald-200 text-emerald-800'}`}>Kunci Jawaban: {pg.kunci}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* K. Penilaian */}
      {result.instrumenPenilaian && shouldRender('all') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? 'border-t border-slate-100 text-slate-800 pt-4 mt-4' : 'p-6 md:p-8 bg-slate-800 text-slate-50'}`}>
          <div className="flex items-center gap-2 mb-4 text-slate-400" style={{ pageBreakAfter: 'avoid' }}><ClipboardCheck size={20} /><h3 className={`text-lg font-bold ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-white'}`}>K. Instrumen Penilaian</h3></div>
          <div className="grid md:grid-cols-3 gap-5 text-sm" style={{ pageBreakInside: 'avoid' }}>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-100' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-100' : 'text-emerald-400 border-slate-600'}`}>Aspek Sikap</p>
              <div className={`space-y-2 leading-relaxed text-justify ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{result.instrumenPenilaian.sikap?.map((s: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-bold shrink-0">•</span><span>{s}</span></div>))}</div>
            </div>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-100' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-100' : 'text-blue-400 border-slate-600'}`}>Aspek Pengetahuan</p>
              <div className={`leading-relaxed ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{formatText(result.instrumenPenilaian.pengetahuan)}</div>
            </div>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-100' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-100' : 'text-amber-400 border-slate-600'}`}>Aspek Keterampilan</p>
              <div className={`space-y-2 leading-relaxed text-justify ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{result.instrumenPenilaian.keterampilan?.map((k: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-bold shrink-0">•</span><span>{k}</span></div>))}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
