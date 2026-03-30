import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Maximize2, Minimize2, 
  RotateCcw, Layout, Presentation, 
  BookOpen, Target, List, HelpCircle, User, Users, Sparkles,
  ArrowRight, GraduationCap, Calendar, Clock,
  Info, FileText, ListChecks
} from 'lucide-react';

interface PresentationViewProps {
  result: any;
  subject: string;
  kelas: string;
  semester: string;
  tahunAjaran: string;
  namaPenyusun: string;
  logo?: string | null;
  isExportingMode?: boolean;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const slideTransition = {
  initial: { opacity: 0, scale: 0.98, x: 20 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 1.02, x: -20 },
  transition: { type: 'spring', damping: 25, stiffness: 200 }
};

export const PresentationView: React.FC<PresentationViewProps> = ({
  result, subject, kelas, semester, tahunAjaran, namaPenyusun, logo, isExportingMode
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedPoint, setExpandedPoint] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpandedPoint(0);
  }, [currentSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  if (!result) return null;

  // Prepare slides
  const slides = [
    {
      type: 'title',
      title: result.judulMateri,
      subtitle: subject,
      author: namaPenyusun,
      meta: { kelas, semester, tahunAjaran },
      icon: <GraduationCap size={64} className="text-emerald-500" />
    },
    {
      type: 'text',
      title: 'Model Pembelajaran',
      content: result.modelPembelajaran,
      icon: <Sparkles size={32} className="text-violet-500" />,
      color: 'violet'
    },
    {
      type: 'text',
      title: 'Pendekatan Khusus',
      content: result.pendekatanKhusus,
      icon: <Target size={32} className="text-rose-500" />,
      color: 'rose'
    },
    {
      type: 'content',
      title: 'Tujuan Pembelajaran',
      content: result.tp || [],
      icon: <Target size={32} className="text-indigo-500" />,
      color: 'indigo'
    },
    {
      type: 'content',
      title: 'Pertanyaan Pemantik',
      content: (result.pertanyaanPemantik || []).map((p: any) => p.pertanyaan),
      icon: <HelpCircle size={32} className="text-sky-500" />,
      color: 'sky'
    },
    {
      type: 'text',
      title: 'Materi Utama',
      content: result.pengertian,
      icon: <BookOpen size={32} className="text-emerald-500" />,
      color: 'emerald'
    },
    ...(result.dalil || []).map((d: any) => ({
      type: 'dalil',
      title: `Dalil: ${d.sumber}`,
      teksArab: d.teksArab,
      terjemahan: d.terjemahan,
      icon: <Sparkles size={32} className="text-amber-500" />,
      color: 'amber'
    })),
    ...(result.subTopik || []).map((sub: any) => ({
      type: 'subtopic',
      title: sub.judulSub,
      content: sub.penjelasan,
      subSub: sub.subSubTopik || [],
      icon: <List size={32} className="text-sky-500" />,
      color: 'sky'
    })),
    {
      type: 'tasks',
      title: 'Penugasan',
      individu: result.tugasIndividu,
      kelompok: result.tugasKelompok,
      icon: <Users size={32} className="text-rose-500" />,
      color: 'rose'
    },
    {
      type: 'evaluasi',
      title: 'Evaluasi Materi',
      questions: (result.pilihanGanda || []).slice(0, 3),
      icon: <HelpCircle size={32} className="text-violet-500" />,
      color: 'violet'
    },
    {
      type: 'closing',
      title: 'Terima Kasih',
      subtitle: 'Semoga Pembelajaran Hari Ini Bermanfaat',
      author: namaPenyusun,
      icon: <Sparkles size={64} className="text-amber-400" />
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const renderSlideContent = (slide: any) => {
    const isPrint = isExportingMode;
    const containerClass = isPrint ? "min-h-[600px] border-b-2 border-slate-200 py-12" : "flex flex-col h-full pt-24 md:pt-32 pb-12 px-6 md:px-12 relative z-10";
    
    switch (slide.type) {
      case 'title':
        return (
          <div className={`flex flex-col items-center justify-center text-center space-y-8 overflow-y-auto custom-scrollbar ${isPrint ? 'min-h-[800px]' : 'h-full pt-24 md:pt-32 pb-12 px-8 md:px-16 relative z-10'}`}>
            <div className="flex flex-col items-center justify-center space-y-6 max-w-5xl w-full">
              {logo && (
                <motion.img 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  src={logo} 
                  alt="Logo" 
                  className="h-20 md:h-24 w-auto mb-2 drop-shadow-xl" 
                />
              )}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                className="p-6 bg-white shadow-2xl shadow-emerald-500/10 rounded-[2rem] mb-2 border border-emerald-50"
              >
                {slide.icon}
              </motion.div>
              <div className="space-y-4">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                  className={`${isPrint ? 'text-5xl' : 'text-4xl md:text-6xl lg:text-7xl'} font-black text-slate-900 leading-tight tracking-tight px-4`}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-emerald-600 font-bold uppercase tracking-[0.2em]"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-10 border-t border-slate-200 w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              <div className="flex flex-col items-center gap-2">
                <User size={18} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{slide.author}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Penyusun</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{slide.meta.tahunAjaran}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Tahun Ajaran</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock size={18} className="text-slate-400" />
                <p className="text-sm font-bold text-slate-800">{slide.meta.semester}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Semester</p>
              </div>
            </motion.div>
          </div>
        );

      case 'content':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-1 ${isPrint ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4 md:gap-6 overflow-y-auto pr-4 custom-scrollbar content-start`}
            >
              {slide.content.map((item: string, i: number) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-5 md:p-6 bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex gap-4 md:gap-5 items-start group"
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-${slide.color}-50 text-${slide.color}-600 flex items-center justify-center font-black text-lg md:text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                    {i + 1}
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium pt-1 md:pt-2">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'text':
        const isArabic = slide.content && /[\u0600-\u06FF]/.test(slide.content);
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${isArabic ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 ${isPrint ? '' : 'overflow-y-auto custom-scrollbar'} relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-${slide.color}-500`} />
                <p className={`text-xl md:text-3xl text-slate-700 leading-relaxed font-medium ${isArabic ? 'text-right font-serif leading-[1.8]' : 'text-justify'}`}>
                  {slide.content}
                </p>
              </motion.div>
              {!isArabic && (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-4 space-y-6"
                >
                  <div className={`p-6 bg-${slide.color}-50/50 rounded-3xl border border-${slide.color}-100`}>
                    <h4 className={`text-lg font-bold text-${slide.color}-700 mb-2 flex items-center gap-2`}>
                      <Info size={18} />
                      Info Penting
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Materi ini merupakan bagian inti dari pembelajaran hari ini. Pastikan untuk mencatat poin-poin penting.
                    </p>
                  </div>
                  <div className="p-6 bg-white/50 rounded-3xl border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" />
                      Tips Belajar
                    </h4>
                    <ul className="text-slate-600 text-sm space-y-2">
                      <li>• Baca dengan teliti</li>
                      <li>• Hubungkan dengan pengalaman</li>
                      <li>• Diskusikan dengan teman</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'dalil':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <div className="flex flex-col gap-8 h-full overflow-y-auto pr-4 custom-scrollbar">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-amber-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles size={120} className="text-amber-500" />
                </div>
                <p className="text-3xl md:text-5xl text-slate-800 leading-[1.8] text-right font-serif mb-8">
                  {slide.teksArab}
                </p>
                <div className="pt-8 border-t border-slate-100">
                  <p className="text-xs md:text-sm font-black text-amber-600 uppercase tracking-widest mb-4">Terjemahan</p>
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed italic font-medium">
                    "{slide.terjemahan}"
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'subtopic':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <div className={`grid grid-cols-1 ${isPrint ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6 md:gap-10 h-full overflow-hidden`}>
              {/* Left Column: Points (Accordion/Dropdown) */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`space-y-4 ${isPrint ? '' : 'overflow-y-auto pr-2 custom-scrollbar lg:col-span-1 order-2 lg:order-1'}`}
              >
                {slide.subSub.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    onClick={() => setExpandedPoint(expandedPoint === i ? null : i)}
                    className={`p-4 md:p-5 bg-white border ${expandedPoint === i ? `border-${slide.color}-500 ring-2 ring-${slide.color}-500/10` : 'border-slate-100'} rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${expandedPoint === i ? `bg-${slide.color}-500 text-white` : `bg-${slide.color}-50 text-${slide.color}-600`} flex items-center justify-center font-black text-xs transition-colors`}>
                          {i + 1}
                        </div>
                        <h5 className={`font-bold ${expandedPoint === i ? 'text-slate-900' : 'text-slate-600'} text-sm md:text-base group-hover:text-slate-900 transition-colors`}>{item.judul}</h5>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedPoint === i ? 180 : 0 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {expandedPoint === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed pt-3 pl-10 border-t border-slate-50 mt-3">
                            {item.deskripsi}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Column: Main Content */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`${isPrint ? '' : 'lg:col-span-2 order-1 lg:order-2'} bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-y-auto custom-scrollbar relative`}
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-${slide.color}-500`} />
                <p className="text-lg md:text-2xl text-slate-700 leading-relaxed text-justify font-medium">
                  {slide.content}
                </p>
              </motion.div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <div className="relative overflow-y-auto pr-4 custom-scrollbar h-full">
              <div className="absolute left-6 md:left-12 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 md:space-y-12 relative z-10"
              >
                {slide.items.map((item: any, i: number) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    className="flex gap-6 md:gap-10 items-start group"
                  >
                    <div className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white border-4 border-${slide.color}-500 flex items-center justify-center font-black text-xl md:text-3xl text-${slide.color}-600 shrink-0 shadow-xl shadow-${slide.color}-500/20 group-hover:scale-110 transition-transform`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-2 md:pt-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 md:mb-4">
                        <span className={`px-3 md:px-4 py-1 md:py-2 bg-${slide.color}-50 text-${slide.color}-600 rounded-full text-xs md:text-sm font-black uppercase tracking-widest`}>
                          {item.tahap}
                        </span>
                        <span className="text-slate-400 font-bold text-xs md:text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {item.durasi}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-tight mb-2 md:mb-4">{item.kegiatan}</h3>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 overflow-y-auto pr-4 custom-scrollbar">
              {slide.individu && (
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ y: -10 }}
                  className="p-6 md:p-10 bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-rose-500/5 space-y-6 md:space-y-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:scale-125 transition-transform">
                    <User size={80} className="md:size-[120px]" />
                  </div>
                  <div className="flex items-center gap-4 text-rose-600">
                    <div className="p-2 md:p-3 bg-rose-50 rounded-xl md:rounded-2xl">
                      <User size={24} className="md:size-[32px]" />
                    </div>
                    <h3 className="text-xl md:text-3xl font-black">Tugas Individu</h3>
                  </div>
                  <div className="space-y-4 md:space-y-6 relative z-10">
                    <h4 className="font-black text-slate-900 text-lg md:text-2xl leading-tight">{slide.individu.judul}</h4>
                    <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium">{slide.individu.instruksi}</p>
                  </div>
                </motion.div>
              )}
              {slide.kelompok && (
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ y: -10 }}
                  className="p-6 md:p-10 bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-indigo-500/5 space-y-6 md:space-y-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:scale-125 transition-transform">
                    <Users size={80} className="md:size-[120px]" />
                  </div>
                  <div className="flex items-center gap-4 text-indigo-600">
                    <div className="p-2 md:p-3 bg-indigo-50 rounded-xl md:rounded-2xl">
                      <Users size={24} className="md:size-[32px]" />
                    </div>
                    <h3 className="text-xl md:text-3xl font-black">Tugas Kelompok</h3>
                  </div>
                  <div className="space-y-4 md:space-y-6 relative z-10">
                    <h4 className="font-black text-slate-900 text-lg md:text-2xl leading-tight">{slide.kelompok.judul}</h4>
                    <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium">{slide.kelompok.instruksi}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'evaluasi':
        return (
          <div className={containerClass}>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
              <div className={`p-3 md:p-4 bg-${slide.color}-50 text-${slide.color}-600 rounded-2xl md:rounded-3xl shadow-sm border border-${slide.color}-100 w-fit`}>
                {slide.icon}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{slide.title}</h2>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`space-y-6 md:space-y-8 ${isPrint ? '' : 'overflow-y-auto pr-4 custom-scrollbar'}`}
            >
              {slide.questions.map((q: any, i: number) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-6 md:p-10 bg-white border border-slate-100 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/30 space-y-6 md:space-y-8"
                >
                  <div className="flex gap-4 md:gap-6 items-start">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-${slide.color}-50 text-${slide.color}-600 flex items-center justify-center font-black text-lg md:text-xl shrink-0`}>
                      {i + 1}
                    </div>
                    <p className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{q.soal}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 md:ml-18">
                    {['A', 'B', 'C', 'D', 'E'].map(opt => (
                      <div key={opt} className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 text-slate-700 font-bold text-base md:text-lg hover:bg-white hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-default">
                        <span className="text-emerald-500 mr-3">{opt}.</span> {q[`opsi${opt}`]}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'closing':
        return (
          <div className={`flex flex-col items-center justify-center text-center space-y-10 overflow-y-auto custom-scrollbar ${isPrint ? 'min-h-[600px]' : 'h-full pt-24 md:pt-32 pb-12 px-8 md:px-16 relative z-10'}`}>
            <motion.div 
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="p-10 bg-white shadow-2xl shadow-amber-500/10 rounded-[3rem] mb-4 border border-amber-50"
            >
              {slide.icon}
            </motion.div>
            <div className="space-y-6">
              <motion.h1 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`${isPrint ? 'text-7xl' : 'text-7xl md:text-9xl'} font-black text-slate-900 leading-tight tracking-tight`}
              >
                {slide.title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl text-amber-600 font-bold uppercase tracking-[0.3em]"
              >
                {slide.subtitle}
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-12 border-t border-slate-200 w-full max-w-md"
            >
              <p className="text-2xl text-slate-800 font-black">{slide.author}</p>
              <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest font-bold">Penyusun Modul</p>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isExportingMode) {
    return (
      <div className="bg-white p-8 space-y-12">
        {slides.map((slide, index) => (
          <div key={index} className="page-break-after-always">
            {renderSlideContent(slide)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col bg-white overflow-hidden relative group transition-all duration-500 ${
        isFullscreen 
          ? "w-screen h-screen rounded-none border-none" 
          : "w-full aspect-video min-h-[500px] max-h-[90vh] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100"
      }`}
    >
      {/* Student-Friendly Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Vibrant Base Image with subtle zoom/pan */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://picsum.photos/seed/education/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover opacity-[0.07] blur-[2px] saturate-150"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Floating Educational Icons - Fun for students */}
        {[...Array(12)].map((_, i) => {
          const icons = [<Sparkles size={24} />, <BookOpen size={24} />, <Target size={24} />, <GraduationCap size={24} />, <HelpCircle size={24} />];
          const icon = icons[i % icons.length];
          const colors = ['text-emerald-400', 'text-indigo-400', 'text-amber-400', 'text-rose-400', 'text-sky-400'];
          const color = colors[i % colors.length];
          
          return (
            <motion.div
              key={`icon-${i}`}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0,
                scale: 0.5
              }}
              animate={{
                x: [
                  `${Math.random() * 100}%`, 
                  `${Math.random() * 100}%`, 
                  `${Math.random() * 100}%`
                ],
                y: [
                  `${Math.random() * 100}%`, 
                  `${Math.random() * 100}%`, 
                  `${Math.random() * 100}%`
                ],
                opacity: [0.1, 0.4, 0.1],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 360]
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute ${color} blur-[0.5px]`}
            >
              {icon}
            </motion.div>
          );
        })}

        {/* Vibrant Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0.1, 0.25, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-96 h-96 rounded-full blur-[100px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? 'rgba(16, 185, 129, 0.2)' : i % 3 === 1 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(245, 158, 11, 0.2)'
            }}
          />
        ))}
        
        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/40 mix-blend-overlay" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
        <div className="flex items-center gap-3 md:gap-4 bg-white/90 backdrop-blur-xl p-2 md:p-3 pr-4 md:pr-6 rounded-2xl border border-white shadow-xl shadow-slate-200/20">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Presentation size={20} className="md:size-[24px]" />
          </div>
          <div className="max-w-[200px] md:max-w-md">
            <h3 className="text-slate-900 font-black text-xs md:text-base leading-tight truncate">{result.judulMateri}</h3>
            <div className="flex items-center gap-2 mt-0.5 md:mt-1">
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] md:text-[10px] font-black rounded-md uppercase tracking-wider">{subject}</span>
              <span className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Slide {currentSlide + 1} / {slides.length}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={toggleFullscreen}
            className="p-3 md:p-4 bg-white/90 hover:bg-white text-slate-600 rounded-2xl transition-all backdrop-blur-xl shadow-xl shadow-slate-200/20 border border-white active:scale-90"
            title={isFullscreen ? "Minimize" : "Maximize"}
          >
            {isFullscreen ? <Minimize2 size={18} className="md:size-[20px]" /> : <Maximize2 size={18} className="md:size-[20px]" />}
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            {...slideTransition}
            className="absolute inset-0"
          >
            {renderSlideContent(slides[currentSlide])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-slate-50 flex justify-between items-center z-30">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentSlide(0)}
            className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:rotate-[-45deg]"
            title="Reset to Start"
          >
            <RotateCcw size={22} />
          </button>
          <div className="relative w-64 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 rounded-[1.5rem] transition-all active:scale-90 shadow-sm"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-lg min-w-[100px] text-center shadow-2xl shadow-slate-900/20">
            {currentSlide + 1} <span className="text-slate-500 text-sm font-bold mx-1">/</span> {slides.length}
          </div>
          <button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white rounded-[1.5rem] transition-all shadow-xl shadow-emerald-600/20 active:scale-90"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      {/* Keyboard Instructions Overlay */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none translate-y-[10px] group-hover:translate-y-0">
        <div className="bg-slate-900/90 backdrop-blur-xl text-white/80 text-[10px] px-6 py-2.5 rounded-full flex gap-6 uppercase tracking-[0.2em] font-black shadow-2xl">
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[8px]">←</div> Prev</span>
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[8px]">→</div> Next</span>
          <span className="flex items-center gap-2"><div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center text-[8px]">F</div> Fullscreen</span>
        </div>
      </div>
    </motion.div>
  );
};
