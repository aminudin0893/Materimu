import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Maximize2, X, Info, Printer } from 'lucide-react';

interface MindMapProps {
  data: {
    judulMateri: string;
    subTopik: {
      judulSub: string;
      penjelasan: string;
      subSubTopik?: string[];
    }[];
  };
}

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<{ name: string; explanation: string } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = containerRef.current?.clientWidth || 800;
    const height = 600;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Prepare data structure for D3 tree
    const rootData: any = {
      name: data.judulMateri,
      explanation: "Materi utama yang sedang dipelajari.",
      children: data.subTopik.map(sub => ({
        name: sub.judulSub,
        explanation: sub.penjelasan,
        children: sub.subSubTopik?.map(ss => ({
          name: ss,
          explanation: `Bagian detail dari ${sub.judulSub}: ${ss}`,
          children: []
        })) || []
      }))
    };

    const treeLayout = d3.tree().size([2 * Math.PI, Math.min(width, height) / 2 - 120]);
    const root = d3.hierarchy(rootData);
    treeLayout(root);

    // Links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkRadial()
        .angle((d: any) => d.x)
        .radius((d: any) => d.y) as any);

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d: any) => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
      .style("cursor", "pointer")
      .on("click", (event, d: any) => {
        setSelectedNode({
          name: d.data.name,
          explanation: d.data.explanation
        });
      });

    node.append("circle")
      .attr("fill", (d: any) => {
        if (d.depth === 0) return "#059669";
        if (d.depth === 1) return "#10b981";
        return "#34d399";
      })
      .attr("r", (d: any) => {
        if (d.depth === 0) return 12;
        if (d.depth === 1) return 8;
        return 5;
      })
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .on("mouseover", function() {
        d3.select(this).transition().duration(200).attr("r", (d: any) => {
          if (d.depth === 0) return 14;
          if (d.depth === 1) return 10;
          return 7;
        });
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).attr("r", (d: any) => {
          if (d.depth === 0) return 12;
          if (d.depth === 1) return 8;
          return 5;
        });
      });

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.x < Math.PI ? 12 : -12)
      .attr("text-anchor", (d: any) => d.x < Math.PI ? "start" : "end")
      .attr("transform", (d: any) => d.x >= Math.PI ? "rotate(180)" : null)
      .text((d: any) => d.data.name)
      .attr("font-size", (d: any) => {
        if (d.depth === 0) return "14px";
        if (d.depth === 1) return "12px";
        return "10px";
      })
      .attr("font-weight", (d: any) => d.depth === 0 ? "bold" : "normal")
      .attr("fill", (d: any) => d.depth === 2 ? "#64748b" : "#1e293b")
      .clone(true).lower()
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    d3.select(svgRef.current).call(zoom as any);

  }, [data]);

  const handleDownload = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const svgSize = svgRef.current.getBoundingClientRect();
    canvas.width = svgSize.width * 2; // High res
    canvas.height = svgSize.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `MindMap-${data.judulMateri}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link aplikasi telah disalin ke clipboard!");
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Share2 size={18} className="text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm md:text-base">Peta Konsep (Mind Map)</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600" 
            title="Bagikan Link"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600" 
            title="Unduh Gambar"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={handlePrint}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600" 
            title="Cetak Mind Map"
          >
            <Printer size={16} />
          </button>
          <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600" title="Perbesar">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative w-full h-[600px] bg-slate-50/30 cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} className="w-full h-full"></svg>
        
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-emerald-100 shadow-xl z-10"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Info size={18} />
                  <h4 className="font-bold text-sm">Detail Materi</h4>
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <h5 className="font-bold text-slate-800 mb-2">{selectedNode.name}</h5>
              <div className="text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {selectedNode.explanation.split('\n').map((p, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{p}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm text-[10px] text-slate-500 max-w-[200px]">
          <p className="font-bold text-slate-700 mb-1 uppercase tracking-wider">Instruksi:</p>
          <ul className="list-disc pl-3 space-y-1">
            <li>Gunakan mouse scroll untuk zoom in/out</li>
            <li>Klik dan seret untuk menggeser peta</li>
            <li>Klik pada poin (bulatan) untuk melihat materi</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
