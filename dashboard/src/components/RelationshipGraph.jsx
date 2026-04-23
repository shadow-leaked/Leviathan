/**
 * Leviathan Dashboard - Relationship Graph Component
 * 
 * Developer: Aribam Aditya Sharma
 * Hash: 0x41, 0x72, 0x69, 0x62, 0x61, 0x6d, 0x20, 0x41, 0x64, 0x69, 0x74, 0x79, 0x61, 0x20, 0x53, 0x68, 0x61, 0x72, 0x6d, 0x61
 */

const _BUILD_HASH = [0x41, 0x72, 0x69, 0x62, 0x61, 0x6d, 0x20, 0x41, 0x64, 0x69, 0x74, 0x79, 0x61, 0x20, 0x53, 0x68, 0x61, 0x72, 0x6d, 0x61]; // Hex signature

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GitGraph, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const RelationshipGraph = ({ npcs }) => {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev + delta)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePanMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#12121a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply pan and zoom
    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
    const radius = baseRadius * zoom;

    // Draw connections
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
    ctx.lineWidth = 1;
    
    const allNpcs = npcs;
    const nodePositions = {};
    
    allNpcs.forEach((npc, index) => {
      const angle = (index / allNpcs.length) * Math.PI * 2 - Math.PI / 2;
      nodePositions[npc.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    allNpcs.forEach((npc1) => {
      allNpcs.forEach((npc2) => {
        if (npc1.id < npc2.id) {
          const pos1 = nodePositions[npc1.id];
          const pos2 = nodePositions[npc2.id];
          
          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    allNpcs.forEach((npc) => {
      const pos = nodePositions[npc.id];
      const isHovered = hoveredNode === npc.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHovered ? 12 * zoom : 8 * zoom, 0, Math.PI * 2);
      
      // Color based on state
      ctx.fillStyle = npc.state === 'active' ? '#10b981' : '#f59e0b';
      
      ctx.fill();
      
      // Glow effect for hovered
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 16 * zoom, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.fill();
      }
      
      // Label (scale font with zoom)
      ctx.fillStyle = '#e2e8f0';
      const fontSize = Math.max(8, 10 * zoom);
      ctx.font = `${fontSize}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, pos.x, pos.y + 25 * zoom);
    });

    ctx.restore();
  }, [npcs, hoveredNode, isFullscreen, zoom, pan]);

  const handleMouseMove = (e) => {
    handlePanMove(e);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const allNpcs = npcs;
    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
    const radius = baseRadius * zoom;

    let found = null;
    allNpcs.forEach((npc, index) => {
      const angle = (index / allNpcs.length) * Math.PI * 2 - Math.PI / 2;
      const nodeX = centerX + Math.cos(angle) * radius;
      const nodeY = centerY + Math.sin(angle) * radius;
      
      const dist = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      if (dist < 20 * zoom) {
        found = npc.id;
      }
    });
    
    setHoveredNode(found);
  };

  return (
    <motion.div 
      layout
      className={`panel flex flex-col h-full ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitGraph className="w-4 h-4" />
          <span>Relationship Network</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-leviathan-text-muted">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}
            className="p-1 hover:bg-leviathan-surface-light rounded"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.min(3, z + 0.2))}
            className="p-1 hover:bg-leviathan-surface-light rounded"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1 hover:bg-leviathan-surface-light rounded"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-leviathan-surface-light rounded"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="relative flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setHoveredNode(null); setIsDragging(false); }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full cursor-crosshair block"
        />
        
        {hoveredNode && (
          <div className="absolute top-4 left-4 bg-leviathan-surface border border-leviathan-border rounded-lg p-3 shadow-xl pointer-events-none">
            {(() => {
              const npc = npcs.find(n => n.id === hoveredNode);
              return npc ? (
                <div className="space-y-1">
                  <p className="font-bold text-sm">{npc.name}</p>
                  <p className="text-xs text-leviathan-text-muted">{npc.archetype}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-leviathan-accent">Energy: {npc.energy}</span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
        
      </div>
    </motion.div>
  );
};

export default RelationshipGraph;
