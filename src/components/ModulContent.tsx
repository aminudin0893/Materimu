import React from 'react';
import { 
  Layers, Target, Clock, Lightbulb, BookText, FileText, User, Users, ListChecks, ClipboardCheck, Sun, Heart, ChevronUp, ChevronDown, Grid 
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
}

export const ModulContent: React.FC<ModulContentProps> = ({
  result, subject, kelas, semester, tahunAjaran, namaPenyusun, alokasiWaktu,
  isExportingMode, displayTarget, expandedSubtopics, expandAll, toggleAccordion
}) => {
  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
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
      <div className="mb-4 pb-4 border-b border-slate-300 text-sm text-slate-800 flex justify-between font-serif" style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
        <div className="flex flex-col justify-center space-y-2 text-base">
            <p><span className="font-semibold inline-block w-40">Nama Siswa</span> : ...........................................................</p>
            <p><span className="font-semibold inline-block w-40">Kelas / No. Absen</span> : {defaultKelas} / ........................................</p>
            <p><span className="font-semibold inline-block w-40">Tanggal</span> : ...........................................................</p>
        </div>
        <div className="text-right flex flex-col justify-start">
            <div className="border border-slate-600 p-1.5 w-24 text-center font-bold bg-slate-100 tracking-widest text-xs">NILAI</div>
            <div className="border border-t-0 border-slate-600 p-2 h-16 w-24"></div>
        </div>
      </div>
    );
  };

  const IdentitasKelompok = () => {
    const defaultKelas = kelas.includes("-") ? kelas.split("-")[1].trim() : kelas;
    return (
      <div className="mb-4 pb-4 border-b border-slate-300 text-sm text-slate-800 flex justify-between font-serif" style={{ pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
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
            <div className="border border-slate-600 p-1.5 w-24 text-center font-bold bg-slate-100 tracking-widest text-xs">NILAI</div>
            <div className="border border-t-0 border-slate-600 p-2 h-16 w-24"></div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="modul-ajar-content" 
      className={`bg-white rounded-2xl overflow-hidden text-slate-800 ${isExportingMode ? 'p-0 text-sm font-serif' : `shadow-sm border border-slate-200 ${displayTarget === 'all' ? 'divide-y divide-slate-100' : 'p-6 md:p-8'}`}`}
    >
      
      {/* KOP SEKOLAH */}
      {(isExportingMode || displayTarget !== 'all') && (
        <div className="text-center pt-2 pb-3 mb-6 border-b-[3px] border-slate-800 border-double" style={{ pageBreakAfter: 'avoid' }}>
          <h2 className="text-xl font-extrabold uppercase tracking-widest text-slate-900 mb-1">
            SMP MUHAMMADIYAH 1 PROBOLINGGO
          </h2>
          <h1 className="text-lg font-bold uppercase tracking-widest text-slate-800 leading-tight mt-3">
            {displayTarget === 'all' && `MODUL AJAR ${(result.generatedSubject || subject).toUpperCase()}`}
            {displayTarget === 'lkpd' && `LEMBAR KERJA PESERTA DIDIK (LKPD)`}
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
        <div className={`grid md:grid-cols-2 gap-6 ${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-300 pb-6 mb-6' : 'p-6 md:p-8 bg-rose-50/30'}`} style={{ pageBreakInside: 'avoid' }}>
          <div className={`p-5 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-300' : 'bg-white border border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-3 text-indigo-700">
              <Layers size={20} />
              <h3 className="font-bold text-lg text-slate-800">A. Model Pembelajaran</h3>
            </div>
            <div className="text-slate-700">{formatText(result.modelPembelajaran)}</div>
          </div>
          <div className={`p-5 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-300' : isIsmuba ? 'bg-white border border-sky-200 shadow-sm' : 'bg-white border border-rose-200 shadow-sm'}`}>
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
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-300 pb-6 mb-6' : 'p-6 md:p-8'}`}>
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
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-300 pb-6 mb-6' : 'p-6 md:p-8 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-4 text-indigo-600" style={{ pageBreakAfter: 'avoid' }}>
            <Clock size={20} />
            <h3 className="text-lg font-bold text-slate-800">D. Alur Pembelajaran (1 Pertemuan)</h3>
          </div>
          <div className={`${isExportingMode || displayTarget !== 'all' ? '' : 'overflow-x-auto'}`}>
            <table className={`w-full text-left border-collapse ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-500' : 'border border-slate-400 bg-white'}`} style={{ pageBreakInside: 'auto' }}>
              <thead style={{ display: 'table-header-group' }}>
                <tr className={`text-slate-800 ${isExportingMode || displayTarget !== 'all' ? 'bg-slate-200 border-slate-500' : 'bg-slate-200 border-slate-400'}`}>
                  <th className={`p-3 font-bold w-1/4 text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>Tahap Kegiatan</th>
                  <th className={`p-3 font-bold w-auto text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>Deskripsi Kegiatan Guru & Siswa</th>
                  <th className={`p-3 font-bold w-32 text-center align-middle border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>Durasi</th>
                </tr>
              </thead>
              <tbody className="text-slate-800" style={{ pageBreakInside: 'auto' }}>
                {result.atpTabel?.map((row: any, i: number) => (
                  <tr key={i} style={{ pageBreakInside: 'avoid', pageBreakAfter: 'auto' }}>
                    <td className={`p-3 font-semibold align-top text-center border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>{row.tahap}</td>
                    <td className={`p-3 align-top leading-relaxed border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>{formatText(row.kegiatan)}</td>
                    <td className={`p-3 font-bold text-center align-top whitespace-nowrap border ${isExportingMode || displayTarget !== 'all' ? 'border-slate-500' : 'border-slate-400'}`}>{row.durasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E. Pemantik */}
      {shouldRender('all') && (
        <div className={`${isExportingMode || displayTarget !== 'all' ? 'border-b border-slate-300 pb-6 mb-6' : 'p-6 md:p-8 bg-amber-50/30'}`}>
          <div className="flex items-center gap-2 mb-4 text-amber-500" style={{ pageBreakAfter: 'avoid' }}>
            <Lightbulb size={20} />
            <h3 className="text-lg font-bold text-slate-800">E. Pertanyaan Pemantik</h3>
          </div>
          <div className="space-y-4">
            {result.pertanyaanPemantik?.map((p: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-300' : 'bg-white border border-amber-100 shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                <div className="flex gap-2 font-bold text-slate-800 mb-2 leading-relaxed">
                  <span className="text-amber-600 shrink-0">Tanya:</span>
                  <span>{p.pertanyaan}</span>
                </div>
                <div className="pl-7 space-y-2 mb-3 text-sm">
                   <div className="flex gap-2"><span className="font-semibold text-slate-500 shrink-0">Siswa 1:</span><span className="text-slate-700 italic">"{p.jawabanAlternatif1 || p.jawaban}"</span></div>
                   {p.jawabanAlternatif2 && <div className="flex gap-2"><span className="font-semibold text-slate-500 shrink-0">Siswa 2:</span><span className="text-slate-700 italic">"{p.jawabanAlternatif2}"</span></div>}
                </div>
                <div className={`mt-3 pt-3 flex gap-2 ${isExportingMode || displayTarget !== 'all' ? 'border-t border-slate-200' : 'border-t border-slate-100'}`}>
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
              <div key={idx} className={`p-4 rounded-xl ${isExportingMode || displayTarget !== 'all' ? 'border border-slate-300' : 'bg-slate-50 border border-slate-200'}`} style={{ pageBreakInside: 'avoid' }}>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-md mb-3 inline-block ${isExportingMode || displayTarget !== 'all' ? 'bg-slate-200 text-slate-800' : 'bg-emerald-100 text-emerald-700'}`}>{d.sumber}</span>
                {d.teksArab && <p className="text-2xl font-arabic text-slate-900 text-right mb-4 leading-loose" dir="rtl">{d.teksArab}</p>}
                <p className={`text-slate-700 italic pl-4 py-1 border-l-4 leading-relaxed ${isExportingMode || displayTarget !== 'all' ? 'border-slate-400' : 'border-emerald-400'}`}>"{d.terjemahan}"</p>
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
                      <div className={`text-slate-700 ${isExportingMode || displayTarget !== 'all' ? 'pt-1 pb-3' : 'px-6 pb-6 border-t border-slate-100 pt-5 bg-slate-50/50'}`}>
                        {formatText(sub.penjelasan)}
                        {sub.subSubTopik && sub.subSubTopik.length > 0 && (
                          <ul className="mt-3 space-y-1.5 list-disc pl-5">
                            {sub.subSubTopik.map((item: string, i: number) => (
                              <li key={i} className="text-sm leading-relaxed">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
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
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-300 pt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8 bg-blue-50/30'}`}>
          {displayTarget === 'lkpd' && <IdentitasKelompok />}
          {displayTarget === 'all' && <div className="flex items-center gap-2 mb-4 text-blue-600" style={{ pageBreakAfter: 'avoid' }}><FileText size={20} /><h3 className="text-lg font-bold text-slate-800">G. Lembar Kerja Peserta Didik (LKPD)</h3></div>}
          <div className={`rounded-xl ${displayTarget === 'lkpd' ? ((isExportingMode || displayTarget !== 'all') ? 'border-none p-0' : 'border border-slate-300 p-4') : ((isExportingMode || displayTarget !== 'all') ? 'border border-slate-300 p-4' : 'p-6 bg-white border border-blue-100 shadow-sm')}`} style={{ pageBreakInside: 'avoid' }}>
            <p className={`font-bold text-slate-900 mb-3 ${displayTarget === 'lkpd' ? 'text-lg text-center uppercase mb-5' : 'text-lg'}`}>{result.lkpd.judul}</p>
            <div className={`${displayTarget === 'lkpd' ? 'mb-4' : 'bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4'}`}><p className="text-slate-800 text-sm leading-relaxed text-justify"><strong>Tujuan Penugasan:</strong><br/>{result.lkpd.tujuan}</p></div>
            <p className="text-sm font-bold text-slate-800 mb-2">Langkah-langkah Pengerjaan:</p>
            <div className="space-y-2 text-sm text-slate-800 leading-relaxed text-justify pl-1">{result.lkpd.langkahKerja?.map((l: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-semibold shrink-0">{i + 1}.</span><span>{l}</span></div>))}</div>
          </div>
        </div>
      )}

      {/* H. Penugasan */}
      {(shouldRender('all') || shouldRender('penugasan_individu') || shouldRender('penugasan_kelompok')) && (
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-300 pt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8'}`}>
          {displayTarget === 'all' && <h3 className="text-lg font-bold text-slate-800 mb-4" style={{ pageBreakAfter: 'avoid' }}>H. Penugasan</h3>}
          <div className={`grid ${displayTarget === 'all' ? 'md:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
            {(shouldRender('all') || shouldRender('penugasan_individu')) && result.tugasIndividu && (
              <div className={`${displayTarget !== 'all' ? '' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-300' : 'p-5 rounded-xl border border-slate-200 bg-white shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                {displayTarget === 'penugasan_individu' && <IdentitasIndividu />}
                {displayTarget === 'all' && <div className={`flex items-center gap-2 font-bold mb-3 pb-2 text-slate-800 ${(isExportingMode || displayTarget !== 'all') ? 'border-b border-slate-300' : 'border-b border-slate-100'}`}><User size={18} /> Tugas Individu</div>}
                <p className={`font-bold text-slate-900 mb-3 ${displayTarget !== 'all' ? 'text-lg uppercase text-center mb-5' : 'text-md'}`}>{result.tugasIndividu.judul}</p>
                <div className="text-slate-800 text-sm">{formatText(result.tugasIndividu.instruksi)}</div>
              </div>
            )}
            {(shouldRender('all') || shouldRender('penugasan_kelompok')) && result.tugasKelompok && (
              <div className={`${displayTarget !== 'all' ? '' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-300' : 'p-5 rounded-xl border border-slate-200 bg-white shadow-sm'}`} style={{ pageBreakInside: 'avoid' }}>
                {displayTarget === 'penugasan_kelompok' && <IdentitasKelompok />}
                {displayTarget === 'all' && <div className={`flex items-center gap-2 font-bold mb-3 pb-2 text-slate-800 ${(isExportingMode || displayTarget !== 'all') ? 'border-b border-slate-300' : 'border-b border-slate-100'}`}><Users size={18} /> Tugas Kelompok</div>}
                <p className={`font-bold text-slate-900 mb-3 ${displayTarget !== 'all' ? 'text-lg uppercase text-center mb-5' : 'text-md'}`}>{result.tugasKelompok.judul}</p>
                <div className="text-slate-800 text-sm">{formatText(result.tugasKelompok.instruksi)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* I. Teka-Teki Silang */}
      {result.tekaTekiSilang && (shouldRender('all') || shouldRender('tts')) && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? 'border-t border-slate-300 pt-6 mt-6' : 'p-6 md:p-8'}`}>
          {displayTarget === 'tts' && <IdentitasIndividu />}
          <div className="flex items-center gap-2 mb-6 text-emerald-600" style={{ pageBreakAfter: 'avoid' }}>
            <Grid size={20} className={displayTarget === 'tts' ? 'hidden' : ''} />
            <h3 className="text-lg font-bold text-slate-800">Teka-Teki Silang (TTS)</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Grid TTS Dinamis */}
            <div className="flex flex-col items-center justify-start p-4 bg-slate-50 border border-slate-200 rounded-2xl overflow-auto" style={{ pageBreakInside: 'avoid' }}>
              <div className="grid grid-cols-10 gap-0.5 bg-slate-300 border border-slate-400 p-0.5 shadow-md mb-4">
                {(() => {
                  const gridSize = 10;
                  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
                  
                  // Fill grid logic
                  result.tekaTekiSilang.mendatar?.forEach((item: any) => {
                    const { x, y, jawaban, nomor } = item;
                    if (typeof x === 'number' && typeof y === 'number' && x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                      if (!grid[y][x]) grid[y][x] = { nomor };
                      for (let i = 0; i < (jawaban?.length || 0); i++) {
                        if (x + i < gridSize) {
                          if (!grid[y][x + i]) grid[y][x + i] = { active: true };
                          else grid[y][x + i].active = true;
                        }
                      }
                    }
                  });

                  result.tekaTekiSilang.menurun?.forEach((item: any) => {
                    const { x, y, jawaban, nomor } = item;
                    if (typeof x === 'number' && typeof y === 'number' && x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                      if (!grid[y][x]) grid[y][x] = { nomor };
                      else if (nomor) grid[y][x].nomor = nomor;
                      
                      for (let i = 0; i < (jawaban?.length || 0); i++) {
                        if (y + i < gridSize) {
                          if (!grid[y + i][x]) grid[y + i][x] = { active: true };
                          else grid[y + i][x].active = true;
                        }
                      }
                    }
                  });

                  return grid.map((row, y) => 
                    row.map((cell, x) => (
                      <div 
                        key={`${x}-${y}`} 
                        className={`w-6 h-6 sm:w-8 sm:h-8 border border-slate-400 flex items-center justify-center relative ${cell?.active || cell?.nomor ? 'bg-white' : 'bg-slate-800'}`}
                      >
                        {cell?.nomor && (
                          <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold leading-none text-slate-800">{cell.nomor}</span>
                        )}
                      </div>
                    ))
                  );
                })()}
              </div>
              <p className="text-[10px] text-slate-500 italic text-center max-w-xs">Kotak di atas disinkronkan dengan pertanyaan. Gunakan petunjuk di bawah untuk mengisi kotak yang tersedia.</p>
            </div>

            {/* Pertanyaan TTS */}
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">M</span> Mendatar
                </h4>
                <div className="space-y-3">
                  {result.tekaTekiSilang.mendatar?.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0 w-5">{item.nomor}.</span>
                      <div className="flex flex-col">
                        <span className="text-slate-700 leading-relaxed">{item.pertanyaan}</span>
                        {(displayTarget === 'all' || displayTarget === 'tts') && (
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Jawaban: {item.jawaban}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">M</span> Menurun
                </h4>
                <div className="space-y-3">
                  {result.tekaTekiSilang.menurun?.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm flex gap-3">
                      <span className="font-bold text-blue-600 shrink-0 w-5">{item.nomor}.</span>
                      <div className="flex flex-col">
                        <span className="text-slate-700 leading-relaxed">{item.pertanyaan}</span>
                        {(displayTarget === 'all' || displayTarget === 'tts') && (
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Jawaban: {item.jawaban}</span>
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
        <div className={`${(isExportingMode || displayTarget !== 'all') && displayTarget === 'all' ? 'border-t border-slate-300 pt-4 mt-4' : (isExportingMode || displayTarget !== 'all') ? 'pt-1' : 'p-6 md:p-8'}`}>
          {displayTarget.startsWith('evaluasi') && <IdentitasIndividu />}
          <div className={`flex items-center gap-2 mb-5 ${displayTarget.startsWith('evaluasi') ? 'text-slate-800' : 'text-emerald-600'}`} style={{ pageBreakAfter: 'avoid' }}>
            <ListChecks size={20} className={displayTarget.startsWith('evaluasi') ? 'hidden' : ''} />
            <h3 className="text-lg font-bold text-slate-800">{displayTarget.startsWith('evaluasi') ? 'Petunjuk Pengerjaan: Pilihlah satu jawaban yang menurut Anda paling tepat!' : 'I. Evaluasi Formatif'}</h3>
          </div>
          <div className="space-y-4">
            {result.pilihanGanda.map((pg: any, idx: number) => (
              <div key={idx} className={`${displayTarget.startsWith('evaluasi') ? 'pb-3' : (isExportingMode || displayTarget !== 'all') ? 'p-4 rounded-xl border border-slate-300' : 'p-6 rounded-xl bg-slate-50 border border-slate-200'}`} style={{ pageBreakInside: 'avoid' }}>
                <div className="flex gap-2 font-bold text-slate-900 mb-3 leading-relaxed"><span className="shrink-0">{idx + 1}.</span><span>{pg.soal}</span></div>
                <div className={`grid ${displayTarget.startsWith('evaluasi') ? 'grid-cols-1 gap-2 ml-6' : 'grid-cols-1 sm:grid-cols-2 gap-3'} text-sm text-slate-800 mb-3 pl-2`}>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">A.</span><span className="leading-relaxed">{pg.opsiA}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">B.</span><span className="leading-relaxed">{pg.opsiB}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">C.</span><span className="leading-relaxed">{pg.opsiC}</span></div>
                  <div className="flex gap-2"><span className="font-bold shrink-0 w-4">D.</span><span className="leading-relaxed">{pg.opsiD}</span></div>
                  <div className={`flex gap-2 ${!displayTarget.startsWith('evaluasi') ? 'sm:col-span-2' : ''}`}><span className="font-bold shrink-0 w-4">E.</span><span className="leading-relaxed">{pg.opsiE}</span></div>
                </div>
                {(displayTarget === 'all' || displayTarget === 'evaluasi_dengan_kunci') && <div className={`text-sm font-bold mt-1 inline-block px-3 py-1.5 rounded-md ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-400 text-slate-800' : 'bg-emerald-100 border border-emerald-200 text-emerald-800'}`}>Kunci Jawaban: {pg.kunci}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* J. Penilaian */}
      {result.instrumenPenilaian && shouldRender('all') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? 'border-t border-slate-300 text-slate-800 pt-4 mt-4' : 'p-6 md:p-8 bg-slate-800 text-slate-50'}`}>
          <div className="flex items-center gap-2 mb-4 text-slate-400" style={{ pageBreakAfter: 'avoid' }}><ClipboardCheck size={20} /><h3 className={`text-lg font-bold ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-white'}`}>J. Instrumen Penilaian</h3></div>
          <div className="grid md:grid-cols-3 gap-5 text-sm" style={{ pageBreakInside: 'avoid' }}>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-300' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-300' : 'text-emerald-400 border-slate-600'}`}>Aspek Sikap</p>
              <div className={`space-y-2 leading-relaxed text-justify ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{result.instrumenPenilaian.sikap?.map((s: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-bold shrink-0">•</span><span>{s}</span></div>))}</div>
            </div>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-300' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-300' : 'text-blue-400 border-slate-600'}`}>Aspek Pengetahuan</p>
              <div className={`leading-relaxed ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{formatText(result.instrumenPenilaian.pengetahuan)}</div>
            </div>
            <div className={`p-4 rounded-xl ${(isExportingMode || displayTarget !== 'all') ? 'border border-slate-300' : 'bg-slate-700/50 border border-slate-600'}`}>
              <p className={`font-bold mb-3 pb-2 border-b uppercase tracking-wider ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800 border-slate-300' : 'text-amber-400 border-slate-600'}`}>Aspek Keterampilan</p>
              <div className={`space-y-2 leading-relaxed text-justify ${(isExportingMode || displayTarget !== 'all') ? 'text-slate-800' : 'text-slate-300'}`}>{result.instrumenPenilaian.keterampilan?.map((k: string, i: number) => (<div key={i} className="flex gap-2 items-start" style={{ pageBreakInside: 'avoid' }}><span className="font-bold shrink-0">•</span><span>{k}</span></div>))}</div>
            </div>
          </div>
        </div>
      )}

      {/* K. Glosarium */}
      {result.glosarium && shouldRender('all') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? 'border-t border-slate-300 pt-6 mt-6' : 'p-6 md:p-8 bg-slate-50'}`}>
          <div className="flex items-center gap-2 mb-4 text-slate-600" style={{ pageBreakAfter: 'avoid' }}>
            <BookText size={20} />
            <h3 className="text-lg font-bold text-slate-800">Glosarium</h3>
          </div>
          <div className="space-y-3">
            {result.glosarium.map((item: any, i: number) => (
              <div key={i} className="text-sm" style={{ pageBreakInside: 'avoid' }}>
                <span className="font-bold text-slate-900">{item.istilah}</span>: <span className="text-slate-700">{item.arti}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* L. Daftar Pustaka */}
      {result.daftarPustaka && shouldRender('all') && (
        <div className={`${(isExportingMode || displayTarget !== 'all') ? 'border-t border-slate-300 pt-6 mt-6' : 'p-6 md:p-8'}`}>
          <div className="flex items-center gap-2 mb-4 text-slate-600" style={{ pageBreakAfter: 'avoid' }}>
            <FileText size={20} />
            <h3 className="text-lg font-bold text-slate-800">Daftar Pustaka</h3>
          </div>
          <div className="space-y-2">
            {result.daftarPustaka.map((item: string, i: number) => (
              <div key={i} className="text-sm text-slate-700 leading-relaxed pl-5 -indent-5" style={{ pageBreakInside: 'avoid' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
