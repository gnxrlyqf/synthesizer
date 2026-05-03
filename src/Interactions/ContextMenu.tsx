import React from 'react';

interface ModuleMenuProps {
  id: string;
  x: number;
  y: number;
  color: string;
  currentName: string;
}

export interface ModuleActions {
  onDelete: (id: string) => void;
  onDisconnect: (id: string) => void;
  onReset: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const DisconnectOption = ({ onDispatch }: { id: string, onDispatch: (action: string) => void }) => (
  <button 
    className="w-full text-left px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-xs flex justify-between items-center group border-b border-zinc-900"
    onClick={() => onDispatch('DISCONNECT')}
  >
    <span>DISCONNECT</span>
    <span className="opacity-0 group-hover:opacity-50 text-[10px]">✕</span>
  </button>
);

const ResetOption = ({ onDispatch }: { id: string, onDispatch: (action: string) => void }) => (
  <button 
    className="w-full text-left px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-xs flex justify-between items-center group border-b border-zinc-900"
    onClick={() => onDispatch('RESET')}
  >
    <span>RESET VALUES</span>
    <span className="opacity-0 group-hover:opacity-50 text-[10px]">↺</span>
  </button>
);

const RenameOption = ({ currentName, onDispatch }: { id: string, currentName: string, onDispatch: (action: string, detail: any) => void }) => (
  <button 
    className="w-full text-left px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors text-xs flex justify-between items-center group border-b border-zinc-900"
    onClick={() => {
      const newName = prompt("Enter new module name:", currentName);
      if (newName) onDispatch('RENAME', { name: newName });
    }}
  >
    <span>RENAME</span>
    <span className="opacity-0 group-hover:opacity-50 text-[10px]">✎</span>
  </button>
);

const DeleteOption = ({ onDispatch }: { id: string, onDispatch: (action: string) => void }) => (
  <button 
    className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold flex justify-between items-center group"
    onClick={() => {
      if(confirm("Are you sure?")) onDispatch('DELETE');
    }}
  >
    <span>DELETE</span>
    <span className="group-hover:scale-110">🗑</span>
  </button>
);

export function ModuleMenu({ id, x, y, color, currentName }: ModuleMenuProps)
{
  const dispatch = (action: string, detail = {}) => {
    window.dispatchEvent(new CustomEvent('MOD_ACTION', { 
      detail: { type: action, id, ...detail } 
    }));
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: y,
    left: x,
    zIndex: 9999,
    borderLeft: `4px solid ${color}`,
  };

  return (
    <div 
      style={menuStyle}
      className="w-44 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.7)] overflow-hidden font-lexend flex flex-col"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()} 
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div className="px-4 py-2 text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] bg-zinc-900/50 select-none">
        Module Settings
      </div>
      
      <DisconnectOption id={id} onDispatch={dispatch} />
      <ResetOption id={id} onDispatch={dispatch} />
      <RenameOption id={id} onDispatch={dispatch} currentName={currentName} />
      <DeleteOption id={id} onDispatch={dispatch} />
      
    </div>
  );
}
