import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Share2, Download, Maximize2 } from 'lucide-react';

interface MindMapProps {
  data: {
    judulMateri: string;
    subTopik: {
      judulSub: string;
      penjelasan: string;
    }[];
  };
}

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      children: data.subTopik.map(sub => ({
        name: sub.judulSub,
        children: [] // Can add more depth if needed
      }))
    };

    const treeLayout = d3.tree().size([2 * Math.PI, Math.min(width, height) / 2 - 100]);
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
      `);

    node.append("circle")
      .attr("fill", (d: any) => d.depth === 0 ? "#059669" : "#10b981")
      .attr("r", (d: any) => d.depth === 0 ? 8 : 5);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.x < Math.PI ? 10 : -10)
      .attr("text-anchor", (d: any) => d.x < Math.PI ? "start" : "end")
      .attr("transform", (d: any) => d.x >= Math.PI ? "rotate(180)" : null)
      .text((d: any) => d.data.name)
      .attr("font-size", (d: any) => d.depth === 0 ? "14px" : "12px")
      .attr("font-weight", (d: any) => d.depth === 0 ? "bold" : "normal")
      .attr("fill", "#1e293b")
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
          <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-emerald-600" title="Perbesar">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative w-full h-[600px] bg-slate-50/30 cursor-grab active:cursor-grabbing">
        <svg ref={svgRef} className="w-full h-full"></svg>
        
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-sm text-[10px] text-slate-500 max-w-[200px]">
          <p className="font-bold text-slate-700 mb-1 uppercase tracking-wider">Instruksi:</p>
          <ul className="list-disc pl-3 space-y-1">
            <li>Gunakan mouse scroll untuk zoom in/out</li>
            <li>Klik dan seret untuk menggeser peta</li>
            <li>Peta ini membantu visualisasi struktur materi</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
