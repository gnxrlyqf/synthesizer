import React from 'react';

interface ModuleMenuProps {
  id: string;
  x: number;
  y: number;
  color: string;
  onDelete: (id: string) => void;
}

export function ModuleMenu({ id, x, y, color, onDelete }: ModuleMenuProps) {
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: y,
    left: x,
    zIndex: 9999,
    borderColor: color,
  };

  return (
    <div 
      style={menuStyle}
      className="w-48 bg-black border-2 rounded-xl shadow-2xl overflow-hidden font-lexend flex flex-col"
      onClick={(e) => e.stopPropagation()} 
      onContextMenu={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }}
    >
      <div 
        style={{ backgroundColor: color }}
        className="px-3 py-1.5 text-black font-bold text-[10px] uppercase tracking-widest select-none"
      >
        Module Options
      </div>
      
      <button 
        className="w-full text-left px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-sm border-b border-zinc-900"
        onClick={() => {
          console.log('Disconnecting cables for', id);
        }}
      >
        Disconnect
      </button>
      
      <button 
        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-950/30 transition-colors text-sm font-medium"
        onClick={() => onDelete(id)}
      >
        Delete Module
      </button>
    </div>
  );
}