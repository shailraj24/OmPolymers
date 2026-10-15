import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

interface DraggableWhatsAppProps {
  whatsAppLink: string;
  whatsAppNumber?: string;
}

export const DraggableWhatsApp: React.FC<DraggableWhatsAppProps> = ({ whatsAppLink, whatsAppNumber }) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragInfo = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  // Initialize position to bottom-right on mount and handle window resize safely
  useEffect(() => {
    const updateDefaultPos = () => {
      const defaultX = Math.max(16, window.innerWidth - 84);
      const defaultY = Math.max(16, window.innerHeight - 88);
      setPos(prev => {
        if (!prev) return { x: defaultX, y: defaultY };
        const boundedX = Math.max(16, Math.min(window.innerWidth - 68, prev.x));
        const boundedY = Math.max(16, Math.min(window.innerHeight - 68, prev.y));
        return { x: boundedX, y: boundedY };
      });
    };

    updateDefaultPos();
    window.addEventListener('resize', updateDefaultPos);
    return () => window.removeEventListener('resize', updateDefaultPos);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos ? pos.x : window.innerWidth - 84,
      origY: pos ? pos.y : window.innerHeight - 88,
      moved: false
    };
    setIsDragging(true);
    setHasMoved(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfo.current) return;
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    // 5px threshold to distinguish intentional drag from a stationary click/tap
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      dragInfo.current.moved = true;
      setHasMoved(true);
    }

    const boundedX = Math.max(16, Math.min(window.innerWidth - 68, dragInfo.current.origX + deltaX));
    const boundedY = Math.max(16, Math.min(window.innerHeight - 68, dragInfo.current.origY + deltaY));
    setPos({ x: boundedX, y: boundedY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfo.current) return;
    const moved = dragInfo.current.moved;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    dragInfo.current = null;
    setIsDragging(false);

    // If pointer was not dragged beyond threshold, execute WhatsApp launch
    if (!moved) {
      window.open(whatsAppLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!pos) return null;

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        touchAction: 'none'
      }}
      className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'} transition-transform duration-75`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="button"
      tabIndex={0}
      aria-label="Chat on WhatsApp - Drag to reposition anywhere on screen"
      title="Chat with OM Polymer on WhatsApp (Drag anywhere to reposition)"
    >
      <div className="relative group">
        <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-300/40 ring-4 ring-emerald-500/20">
          <MessageCircle className="w-6 h-6 shrink-0" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        {/* Subtle tooltip indicator */}
        <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2.5 py-1 bg-slate-900 text-slate-200 text-[11px] font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap pointer-events-none">
          <span>WhatsApp Chat <span className="text-slate-400 text-[10px]">(Drag to move)</span></span>
        </div>
      </div>
    </div>
  );
};
